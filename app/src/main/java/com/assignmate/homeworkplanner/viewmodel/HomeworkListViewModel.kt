package com.assignmate.homeworkplanner.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.assignmate.homeworkplanner.data.models.Homework
import com.assignmate.homeworkplanner.data.repository.HomeworkRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class HomeworkListUiState(
    val homework: List<Homework> = emptyList(),
    val filteredHomework: List<Homework> = emptyList(),
    val searchQuery: String = "",
    val selectedFilter: HomeworkFilter = HomeworkFilter.ALL,
    val isLoading: Boolean = false,
    val error: String? = null
)

enum class HomeworkFilter {
    ALL, PENDING, COMPLETED, OVERDUE
}

class HomeworkListViewModel(
    private val repository: HomeworkRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(HomeworkListUiState(isLoading = true))
    val uiState: StateFlow<HomeworkListUiState> = _uiState.asStateFlow()
    
    init {
        loadHomework()
    }
    
    private fun loadHomework() {
        viewModelScope.launch {
            try {
                repository.allHomework.collect { homework ->
                    _uiState.value = _uiState.value.copy(
                        homework = homework,
                        filteredHomework = filterHomework(homework),
                        isLoading = false,
                        error = null
                    )
                }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message ?: "Unknown error occurred"
                )
            }
        }
    }
    
    fun updateSearchQuery(query: String) {
        _uiState.value = _uiState.value.copy(searchQuery = query)
        updateFilteredHomework()
    }
    
    fun updateFilter(filter: HomeworkFilter) {
        _uiState.value = _uiState.value.copy(selectedFilter = filter)
        updateFilteredHomework()
    }
    
    private fun updateFilteredHomework() {
        val filtered = filterHomework(_uiState.value.homework)
        _uiState.value = _uiState.value.copy(filteredHomework = filtered)
    }
    
    private fun filterHomework(homework: List<Homework>): List<Homework> {
        var filtered = homework
        
        // Apply status filter
        filtered = when (_uiState.value.selectedFilter) {
            HomeworkFilter.PENDING -> filtered.filter { !it.isCompleted }
            HomeworkFilter.COMPLETED -> filtered.filter { it.isCompleted }
            HomeworkFilter.OVERDUE -> filtered.filter { !it.isCompleted && it.dueDate.isBefore(java.time.LocalDateTime.now()) }
            HomeworkFilter.ALL -> filtered
        }
        
        // Apply search filter
        if (_uiState.value.searchQuery.isNotBlank()) {
            val query = _uiState.value.searchQuery.lowercase()
            filtered = filtered.filter { homework ->
                homework.title.lowercase().contains(query) ||
                (homework.subject?.lowercase()?.contains(query) == true) ||
                (homework.description?.lowercase()?.contains(query) == true)
            }
        }
        
        return filtered.sortedBy { it.dueDate }
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
    
    fun deleteHomework(homework: Homework) {
        viewModelScope.launch {
            try {
                repository.delete(homework)
            } catch (e: Exception) {
                // Handle error
            }
        }
    }
}
