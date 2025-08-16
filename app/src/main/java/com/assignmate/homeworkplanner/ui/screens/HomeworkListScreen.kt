package com.assignmate.homeworkplanner.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.assignmate.homeworkplanner.R
import com.assignmate.homeworkplanner.ui.components.HomeworkCard
import com.assignmate.homeworkplanner.viewmodel.HomeworkListViewModel
import com.assignmate.homeworkplanner.viewmodel.HomeworkFilter

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeworkListScreen(
    onNavigateToAdd: () -> Unit,
    onNavigateToDetails: (Long) -> Unit,
    viewModel: HomeworkListViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(stringResource(R.string.nav_list)) },
                actions = {
                    IconButton(onClick = onNavigateToAdd) {
                        Icon(Icons.Default.Add, contentDescription = stringResource(R.string.add_homework))
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Search bar
            OutlinedTextField(
                value = uiState.searchQuery,
                onValueChange = { viewModel.updateSearchQuery(it) },
                placeholder = { Text("Search homework...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Search") },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                singleLine = true
            )
            
            // Filter chips
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                item {
                    FilterChip(
                        onClick = { viewModel.updateFilter(HomeworkFilter.ALL) },
                        label = { Text("All") },
                        selected = uiState.selectedFilter == HomeworkFilter.ALL
                    )
                }
                item {
                    FilterChip(
                        onClick = { viewModel.updateFilter(HomeworkFilter.PENDING) },
                        label = { Text(stringResource(R.string.pending)) },
                        selected = uiState.selectedFilter == HomeworkFilter.PENDING
                    )
                }
                item {
                    FilterChip(
                        onClick = { viewModel.updateFilter(HomeworkFilter.COMPLETED) },
                        label = { Text(stringResource(R.string.completed)) },
                        selected = uiState.selectedFilter == HomeworkFilter.COMPLETED
                    )
                }
                item {
                    FilterChip(
                        onClick = { viewModel.updateFilter(HomeworkFilter.OVERDUE) },
                        label = { Text(stringResource(R.string.overdue)) },
                        selected = uiState.selectedFilter == HomeworkFilter.OVERDUE
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            // Homework list
            if (uiState.isLoading) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            } else if (uiState.filteredHomework.isEmpty()) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        Text(
                            text = "No homework found",
                            style = MaterialTheme.typography.headlineSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Button(onClick = onNavigateToAdd) {
                            Icon(Icons.Default.Add, contentDescription = null)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(stringResource(R.string.add_homework))
                        }
                    }
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(uiState.filteredHomework) { homework ->
                        HomeworkCard(
                            homework = homework,
                            onClick = { onNavigateToDetails(homework.id) }
                        )
                    }
                }
            }
        }
    }
}
