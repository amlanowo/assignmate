package com.assignmate.homeworkplanner.data.models

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb

enum class Priority {
    HIGH, MEDIUM, LOW;
    
    fun getColor(): Color {
        return when (this) {
            HIGH -> Color(0xFFE57373)      // Light Red
            MEDIUM -> Color(0xFFFFB74D)    // Light Orange
            LOW -> Color(0xFF81C784)       // Light Green
        }
    }
    
    fun getColorInt(): Int {
        return getColor().toArgb()
    }
    
    fun getDisplayName(): String {
        return when (this) {
            HIGH -> "High"
            MEDIUM -> "Medium"
            LOW -> "Low"
        }
    }
}
