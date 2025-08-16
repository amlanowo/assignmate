package com.assignmate.homeworkplanner.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.assignmate.homeworkplanner.data.models.Homework
import com.assignmate.homeworkplanner.data.models.Priority
import com.assignmate.homeworkplanner.data.repository.HomeworkRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.time.LocalDateTime

data class AddHomeworkUiState(
    val title: String = "",
    val subject: String = "",
    val description: String = "",
    val dueDate: LocalDateTime = LocalDateTime.now().plusDays(1),
    val priority: Priority = Priority.MEDIUM,
    val isLoading: Boolean = false,
    val error: String? = null,
    val isSuccess: Boolean = false
)

class AddHomeworkViewModel(
    private val repository: HomeworkRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(AddHomeworkUiState())
    val uiState: StateFlow<AddHomeworkUiState> = _uiState.asStateFlow()
    
    fun updateTitle(title: String) {
        _uiState.value = _uiState.value.copy(title = title)
    }
    
    fun updateSubject(subject: String) {
        _uiState.value = _uiState.value.copy(subject = subject)
    }
    
    fun updateDescription(description: String) {
        _uiState.value = _uiState.value.copy(description = description)
    }
    
    fun updateDueDate(dueDate: LocalDateTime) {
        _uiState.value = _uiState.value.copy(dueDate = dueDate)
    }
    
    fun updatePriority(priority: Priority) {
        _uiState.value = _uiState.value.copy(priority = priority)
    }
    
    fun saveHomework() {
        val currentState = _uiState.value
        
        // Validation
        if (currentState.title.isBlank()) {
            _uiState.value = currentState.copy(error = "Title is required")
            return
        }
        
        if (currentState.dueDate.isBefore(LocalDateTime.now())) {
            _uiState.value = currentState.copy(error = "Due date must be in the future")
            return
        }
        
        viewModelScope.launch {
            try {
                _uiState.value = currentState.copy(isLoading = true, error = null)
                
                val homework = Homework(
                    title = currentState.title.trim(),
                    subject = currentState.subject.trim().takeIf { it.isNotBlank() },
                    description = currentState.description.trim().takeIf { it.isNotBlank() },
                    dueDate = currentState.dueDate,
                    priority = currentState.priority
                )
                
                repository.insert(homework)
                _uiState.value = currentState.copy(
                    isLoading = false,
                    isSuccess = true
                )
            } catch (e: Exception) {
                _uiState.value = currentState.copy(
                    isLoading = false,
                    error = e.message ?: "Failed to save homework"
                )
            }
        }
    }
    
    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
    
    fun resetSuccess() {
        _uiState.value = _uiState.value.copy(isSuccess = false)
    }
    
    fun loadHomeworkForEdit(homeworkId: Long) {
        viewModelScope.launch {
            try {
                _uiState.value = _uiState.value.copy(isLoading = true)
                val homework = repository.getHomeworkById(homeworkId)
                homework?.let {
                    _uiState.value = _uiState.value.copy(
                        title = it.title,
                        subject = it.subject ?: "",
                        description = it.description ?: "",
                        dueDate = it.dueDate,
                        priority = it.priority,
                        isLoading = false
                    )
                }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message ?: "Failed to load homework"
                )
            }
        }
    }
}
