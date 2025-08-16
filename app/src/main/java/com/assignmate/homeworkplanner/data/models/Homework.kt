package com.assignmate.homeworkplanner.data.models

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey
import java.time.LocalDateTime

@Entity(tableName = "homework")
data class Homework(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    
    @ColumnInfo(name = "title")
    val title: String,
    
    @ColumnInfo(name = "subject")
    val subject: String? = null,
    
    @ColumnInfo(name = "description")
    val description: String? = null,
    
    @ColumnInfo(name = "due_date")
    val dueDate: LocalDateTime,
    
    @ColumnInfo(name = "priority")
    val priority: Priority = Priority.MEDIUM,
    
    @ColumnInfo(name = "is_completed")
    val isCompleted: Boolean = false,
    
    @ColumnInfo(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @ColumnInfo(name = "reminder_time")
    val reminderTime: LocalDateTime? = null,
    
    @ColumnInfo(name = "notification_id")
    val notificationId: Int? = null
)
