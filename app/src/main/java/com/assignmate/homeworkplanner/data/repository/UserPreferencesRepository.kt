package com.assignmate.homeworkplanner.data.repository

import com.assignmate.homeworkplanner.data.database.UserPreferencesDao
import com.assignmate.homeworkplanner.data.models.UserPreferences
import kotlinx.coroutines.flow.Flow

class UserPreferencesRepository(
    private val userPreferencesDao: UserPreferencesDao
) {
    fun getUserPreferences(): Flow<UserPreferences?> {
        return userPreferencesDao.getUserPreferences()
    }
    
    suspend fun insert(userPreferences: UserPreferences) {
        userPreferencesDao.insert(userPreferences)
    }
    
    suspend fun update(userPreferences: UserPreferences) {
        userPreferencesDao.update(userPreferences)
    }
    
    suspend fun updateThemeMode(themeMode: String) {
        userPreferencesDao.updateThemeMode(themeMode)
    }
    
    suspend fun updateDefaultReminderHours(hours: Int) {
        userPreferencesDao.updateDefaultReminderHours(hours)
    }
    
    suspend fun updateDailyReminderEnabled(enabled: Boolean) {
        userPreferencesDao.updateDailyReminderEnabled(enabled)
    }
    
    suspend fun updateDailyReminderTime(time: String) {
        userPreferencesDao.updateDailyReminderTime(time)
    }
}
