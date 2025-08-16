package com.assignmate.homeworkplanner.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.assignmate.homeworkplanner.data.models.Homework
import com.assignmate.homeworkplanner.data.repository.HomeworkRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class HomeworkDetailsUiState(
    val homework: Homework? = null,
    val isLoading: Boolean = false,
    val error: String? = null
)

class HomeworkDetailsViewModel(
    private val repository: HomeworkRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(HomeworkDetailsUiState(isLoading = true))
    val uiState: StateFlow<HomeworkDetailsUiState> = _uiState.asStateFlow()
    
    fun loadHomework(homeworkId: Long) {
        viewModelScope.launch {
            try {
                _uiState.value = _uiState.value.copy(isLoading = true, error = null)
                val homework = repository.getHomeworkById(homeworkId)
                _uiState.value = _uiState.value.copy(
                    homework = homework,
                    isLoading = false
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message ?: "Failed to load homework"
                )
            }
        }
    }
    
    fun toggleCompletion() {
        val currentHomework = _uiState.value.homework ?: return
        
        viewModelScope.launch {
            try {
                val updatedHomework = currentHomework.copy(isCompleted = !currentHomework.isCompleted)
                repository.update(updatedHomework)
                _uiState.value = _uiState.value.copy(homework = updatedHomework)
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    error = e.message ?: "Failed to update homework"
                )
            }
        }
    }
    
    fun deleteHomework() {
        val currentHomework = _uiState.value.homework ?: return
        
        viewModelScope.launch {
            try {
                repository.delete(currentHomework)
                // Navigate back or show success message
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    error = e.message ?: "Failed to delete homework"
                )
            }
        }
    }
    
    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
}
