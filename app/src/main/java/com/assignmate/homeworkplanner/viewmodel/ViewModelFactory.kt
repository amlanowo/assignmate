package com.assignmate.homeworkplanner.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.assignmate.homeworkplanner.data.repository.HomeworkRepository

class ViewModelFactory(
    private val repository: HomeworkRepository
) : ViewModelProvider.Factory {
    
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return when {
            modelClass.isAssignableFrom(HomeViewModel::class.java) -> {
                HomeViewModel(repository) as T
            }
            modelClass.isAssignableFrom(HomeworkListViewModel::class.java) -> {
                HomeworkListViewModel(repository) as T
            }
            modelClass.isAssignableFrom(AddHomeworkViewModel::class.java) -> {
                AddHomeworkViewModel(repository) as T
            }
            modelClass.isAssignableFrom(HomeworkDetailsViewModel::class.java) -> {
                HomeworkDetailsViewModel(repository) as T
            }
            modelClass.isAssignableFrom(SettingsViewModel::class.java) -> {
                SettingsViewModel(repository) as T
            }
            else -> throw IllegalArgumentException("Unknown ViewModel class")
        }
    }
}
