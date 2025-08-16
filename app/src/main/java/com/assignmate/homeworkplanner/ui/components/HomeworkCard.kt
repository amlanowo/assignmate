package com.assignmate.homeworkplanner.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.assignmate.homeworkplanner.data.models.Homework
import com.assignmate.homeworkplanner.data.models.Priority
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeworkCard(
    homework: Homework,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .clickable { onClick() },
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column(
                    modifier = Modifier.weight(1f)
                ) {
                    Text(
                        text = homework.title,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold,
                        color = if (homework.isCompleted) 
                            MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                        else 
                            MaterialTheme.colorScheme.onSurface
                    )
                    
                    if (!homework.subject.isNullOrBlank()) {
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = homework.subject,
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
                
                Row(
                    verticalAlignment = Alignment.Center,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    if (homework.isCompleted) {
                        Icon(
                            imageVector = Icons.Default.CheckCircle,
                            contentDescription = "Completed",
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(20.dp)
                        )
                    } else {
                        PriorityIndicator(priority = homework.priority)
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Row(
                verticalAlignment = Alignment.Center,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Schedule,
                    contentDescription = "Due date",
                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.size(16.dp)
                )
                
                Text(
                    text = getDueDateText(homework.dueDate),
                    style = MaterialTheme.typography.bodySmall,
                    color = if (isOverdue(homework.dueDate) && !homework.isCompleted)
                        MaterialTheme.colorScheme.error
                    else
                        MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
fun PriorityIndicator(priority: Priority) {
    Box(
        modifier = Modifier
            .size(12.dp)
            .background(
                color = priority.getColor(),
                shape = MaterialTheme.shapes.small
            )
    )
}

private fun getDueDateText(dueDate: LocalDateTime): String {
    val now = LocalDateTime.now()
    val daysUntil = ChronoUnit.DAYS.between(now.toLocalDate(), dueDate.toLocalDate())
    val hoursUntil = ChronoUnit.HOURS.between(now, dueDate)
    
    return when {
        daysUntil < 0 -> "Overdue"
        daysUntil == 0L -> "Due today at ${dueDate.format(DateTimeFormatter.ofPattern("HH:mm"))}"
        daysUntil == 1L -> "Due tomorrow at ${dueDate.format(DateTimeFormatter.ofPattern("HH:mm"))}"
        daysUntil <= 7 -> "Due in $daysUntil days"
        else -> "Due ${dueDate.format(DateTimeFormatter.ofPattern("MMM dd"))}"
    }
}

private fun isOverdue(dueDate: LocalDateTime): Boolean {
    return dueDate.isBefore(LocalDateTime.now())
}
