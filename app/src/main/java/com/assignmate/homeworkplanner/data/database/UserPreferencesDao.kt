package com.assignmate.homeworkplanner.data.database

import androidx.room.*
import com.assignmate.homeworkplanner.data.models.UserPreferences
import kotlinx.coroutines.flow.Flow

@Dao
interface UserPreferencesDao {
    @Query("SELECT * FROM user_preferences WHERE id = 1")
    fun getUserPreferences(): Flow<UserPreferences?>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(userPreferences: UserPreferences)
    
    @Update
    suspend fun update(userPreferences: UserPreferences)
    
    @Query("UPDATE user_preferences SET theme_mode = :themeMode WHERE id = 1")
    suspend fun updateThemeMode(themeMode: String)
    
    @Query("UPDATE user_preferences SET default_reminder_hours = :hours WHERE id = 1")
    suspend fun updateDefaultReminderHours(hours: Int)
    
    @Query("UPDATE user_preferences SET daily_reminder_enabled = :enabled WHERE id = 1")
    suspend fun updateDailyReminderEnabled(enabled: Boolean)
    
    @Query("UPDATE user_preferences SET daily_reminder_time = :time WHERE id = 1")
    suspend fun updateDailyReminderTime(time: String)
}
