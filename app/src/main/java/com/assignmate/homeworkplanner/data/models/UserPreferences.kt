package com.assignmate.homeworkplanner.data.models

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey
import java.time.LocalTime
import java.util.TimeZone

@Entity(tableName = "user_preferences")
data class UserPreferences(
    @PrimaryKey
    val id: Int = 1,
    
    @ColumnInfo(name = "theme_mode")
    val themeMode: ThemeMode = ThemeMode.SYSTEM,
    
    @ColumnInfo(name = "default_reminder_hours")
    val defaultReminderHours: Int = 24,
    
    @ColumnInfo(name = "daily_reminder_enabled")
    val dailyReminderEnabled: Boolean = false,
    
    @ColumnInfo(name = "daily_reminder_time")
    val dailyReminderTime: LocalTime = LocalTime.of(19, 0), // 7 PM
    
    @ColumnInfo(name = "timezone")
    val timezone: String = TimeZone.getDefault().id
)

enum class ThemeMode {
    LIGHT, DARK, SYSTEM;
    
    fun getDisplayName(): String {
        return when (this) {
            LIGHT -> "Light"
            DARK -> "Dark"
            SYSTEM -> "System"
        }
    }
}
