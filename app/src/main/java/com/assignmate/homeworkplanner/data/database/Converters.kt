package com.assignmate.homeworkplanner.data.database

import androidx.room.TypeConverter
import com.assignmate.homeworkplanner.data.models.Priority
import com.assignmate.homeworkplanner.data.models.ThemeMode
import java.time.Instant
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.ZoneId

class Converters {
    @TypeConverter
    fun fromTimestamp(value: Long?): LocalDateTime? {
        return value?.let { LocalDateTime.ofInstant(Instant.ofEpochMilli(it), ZoneId.systemDefault()) }
    }
    
    @TypeConverter
    fun dateToTimestamp(date: LocalDateTime?): Long? {
        return date?.atZone(ZoneId.systemDefault())?.toInstant()?.toEpochMilli()
    }
    
    @TypeConverter
    fun fromPriority(priority: Priority): String {
        return priority.name
    }
    
    @TypeConverter
    fun toPriority(value: String): Priority {
        return Priority.valueOf(value)
    }
    
    @TypeConverter
    fun fromThemeMode(themeMode: ThemeMode): String {
        return themeMode.name
    }
    
    @TypeConverter
    fun toThemeMode(value: String): ThemeMode {
        return ThemeMode.valueOf(value)
    }
    
    @TypeConverter
    fun fromLocalTime(time: LocalTime): String {
        return time.toString()
    }
    
    @TypeConverter
    fun toLocalTime(value: String): LocalTime {
        return LocalTime.parse(value)
    }
}
