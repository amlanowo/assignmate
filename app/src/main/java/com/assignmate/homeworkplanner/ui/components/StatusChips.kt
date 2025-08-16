package com.assignmate.homeworkplanner.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.assignmate.homeworkplanner.R

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StatusChips(
    pendingCount: Int,
    overdueCount: Int,
    completedCount: Int,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        if (overdueCount > 0) {
            FilterChip(
                onClick = { },
                label = { Text("${stringResource(R.string.overdue)} ($overdueCount)") },
                colors = FilterChipDefaults.filterChipColors(
                    containerColor = MaterialTheme.colorScheme.errorContainer,
                    labelColor = MaterialTheme.colorScheme.onErrorContainer
                )
            )
        }
        
        if (pendingCount > 0) {
            FilterChip(
                onClick = { },
                label = { Text("${stringResource(R.string.pending)} ($pendingCount)") },
                colors = FilterChipDefaults.filterChipColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    labelColor = MaterialTheme.colorScheme.onPrimaryContainer
                )
            )
        }
        
        if (completedCount > 0) {
            FilterChip(
                onClick = { },
                label = { Text("${stringResource(R.string.completed)} ($completedCount)") },
                colors = FilterChipDefaults.filterChipColors(
                    containerColor = MaterialTheme.colorScheme.secondaryContainer,
                    labelColor = MaterialTheme.colorScheme.onSecondaryContainer
                )
            )
        }
    }
}
