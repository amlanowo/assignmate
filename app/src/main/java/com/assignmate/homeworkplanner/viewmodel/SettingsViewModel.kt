package com.assignmate.homeworkplanner.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.assignmate.homeworkplanner.data.models.ThemeMode
import com.assignmate.homeworkplanner.data.models.UserPreferences
import com.assignmate.homeworkplanner.data.repository.UserPreferencesRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.time.LocalTime

data class SettingsUiState(
    val userPreferences: UserPreferences? = null,
    val isLoading: Boolean = false,
    val error: String? = null,
    val isSuccess: Boolean = false
)

class SettingsViewModel(
    private val userPreferencesRepository: UserPreferencesRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(SettingsUiState(isLoading = true))
    val uiState: StateFlow<SettingsUiState> = _uiState.asStateFlow()
    
    init {
        loadUserPreferences()
    }
    
    private fun loadUserPreferences() {
        viewModelScope.launch {
            try {
                userPreferencesRepository.getUserPreferences().collect { preferences ->
                    _uiState.value = _uiState.value.copy(
                        userPreferences = preferences,
                        isLoading = false,
                        error = null
                    )
                }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message ?: "Failed to load preferences"
                )
            }
        }
    }
    
    fun updateThemeMode(themeMode: ThemeMode) {
        viewModelScope.launch {
            try {
                userPreferencesRepository.updateThemeMode(themeMode.name)
                _uiState.value = _uiState.value.copy(isSuccess = true)
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    error = e.message ?: "Failed to update theme"
                )
            }
        }
    }
    
    fun updateDefaultReminderHours(hours: Int) {
        viewModelScope.launch {
            try {
                userPreferencesRepository.updateDefaultReminderHours(hours)
                _uiState.value = _uiState.value.copy(isSuccess = true)
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    error = e.message ?: "Failed to update reminder settings"
                )
            }
        }
    }
    
    fun updateDailyReminderEnabled(enabled: Boolean) {
        viewModelScope.launch {
            try {
                userPreferencesRepository.updateDailyReminderEnabled(enabled)
                _uiState.value = _uiState.value.copy(isSuccess = true)
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    error = e.message ?: "Failed to update daily reminder"
                )
            }
        }
    }
    
    fun updateDailyReminderTime(time: LocalTime) {
        viewModelScope.launch {
            try {
                userPreferencesRepository.updateDailyReminderTime(time.toString())
                _uiState.value = _uiState.value.copy(isSuccess = true)
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    error = e.message ?: "Failed to update reminder time"
                )
            }
        }
    }
    
    fun clearCompletedTasks() {
        viewModelScope.launch {
            try {
                // This would be implemented in the homework repository
                _uiState.value = _uiState.value.copy(isSuccess = true)
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    error = e.message ?: "Failed to clear completed tasks"
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
}
