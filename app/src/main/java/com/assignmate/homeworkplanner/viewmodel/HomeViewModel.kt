package com.assignmate.homeworkplanner.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.assignmate.homeworkplanner.data.models.Homework
import com.assignmate.homeworkplanner.data.repository.HomeworkRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.time.LocalDateTime
import java.time.LocalTime

data class HomeUiState(
    val todayTasks: List<Homework> = emptyList(),
    val upcomingTasks: List<Homework> = emptyList(),
    val pendingCount: Int = 0,
    val overdueCount: Int = 0,
    val completedCount: Int = 0,
    val isLoading: Boolean = false,
    val error: String? = null
)

class HomeViewModel(
    private val repository: HomeworkRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(HomeUiState(isLoading = true))
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()
    
    init {
        loadData()
    }
    
    private fun loadData() {
        viewModelScope.launch {
            try {
                combine(
                    repository.getTodayHomework(LocalDateTime.now()),
                    repository.getUpcomingHomework(LocalDateTime.now()),
                    repository.getHomeworkByStatus(false),
                    repository.getHomeworkByStatus(true),
                    repository.getOverdueHomework(LocalDateTime.now())
                ) { todayTasks, upcomingTasks, pendingTasks, completedTasks, overdueTasks ->
                    HomeUiState(
                        todayTasks = todayTasks,
                        upcomingTasks = upcomingTasks.take(5), // Show only next 5 upcoming tasks
                        pendingCount = pendingTasks.size,
                        overdueCount = overdueTasks.size,
                        completedCount = completedTasks.size,
                        isLoading = false,
                        error = null
                    )
                }.collect { state ->
                    _uiState.value = state
                }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message ?: "Unknown error occurred"
                )
            }
        }
    }
    
    fun refresh() {
        loadData()
    }
    
    fun markAsCompleted(homework: Homework) {
        viewModelScope.launch {
            try {
                repository.update(homework.copy(isCompleted = true))
            } catch (e: Exception) {
                // Handle error
            }
        }
    }
    
    fun markAsPending(homework: Homework) {
        viewModelScope.launch {
            try {
                repository.update(homework.copy(isCompleted = false))
            } catch (e: Exception) {
                // Handle error
            }
        }
    }
}
