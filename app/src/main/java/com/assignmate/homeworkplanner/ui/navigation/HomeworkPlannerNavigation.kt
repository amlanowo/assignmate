package com.assignmate.homeworkplanner.ui.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.assignmate.homeworkplanner.R
import com.assignmate.homeworkplanner.ui.screens.AddHomeworkScreen
import com.assignmate.homeworkplanner.ui.screens.HomeScreen
import com.assignmate.homeworkplanner.ui.screens.HomeworkDetailsScreen
import com.assignmate.homeworkplanner.ui.screens.HomeworkListScreen
import com.assignmate.homeworkplanner.ui.screens.SettingsScreen

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeworkPlannerNavigation() {
    val navController = rememberNavController()
    
    Scaffold(
        bottomBar = {
            NavigationBar {
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentDestination = navBackStackEntry?.destination
                
                val screens = listOf(
                    Screen.Home,
                    Screen.List,
                    Screen.Settings
                )
                
                screens.forEach { screen ->
                    NavigationBarItem(
                        icon = { Icon(screen.icon, contentDescription = null) },
                        label = { Text(stringResource(screen.resourceId)) },
                        selected = currentDestination?.hierarchy?.any { it.route == screen.route } == true,
                        onClick = {
                            navController.navigate(screen.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    )
                }
            }
        },
        floatingActionButton = {
            val currentRoute = navController.currentBackStackEntryAsState().value?.destination?.route
            if (currentRoute == Screen.Home.route) {
                FloatingActionButton(
                    onClick = {
                        navController.navigate(Screen.AddHomework.route)
                    }
                ) {
                    Icon(Icons.Default.Add, contentDescription = stringResource(R.string.add_homework))
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Home.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Screen.Home.route) {
                HomeScreen(
                    onNavigateToAdd = { navController.navigate(Screen.AddHomework.route) },
                    onNavigateToDetails = { homeworkId -> 
                        navController.navigate(Screen.HomeworkDetails.createRoute(homeworkId))
                    }
                )
            }
            
            composable(Screen.List.route) {
                HomeworkListScreen(
                    onNavigateToAdd = { navController.navigate(Screen.AddHomework.route) },
                    onNavigateToDetails = { homeworkId -> 
                        navController.navigate(Screen.HomeworkDetails.createRoute(homeworkId))
                    }
                )
            }
            
            composable(Screen.Settings.route) {
                SettingsScreen()
            }
            
            composable(Screen.AddHomework.route) {
                AddHomeworkScreen(
                    onNavigateBack = { navController.popBackStack() }
                )
            }
            
            composable(
                route = Screen.HomeworkDetails.route,
                arguments = Screen.HomeworkDetails.arguments
            ) { backStackEntry ->
                val homeworkId = backStackEntry.arguments?.getLong("homeworkId") ?: 0L
                HomeworkDetailsScreen(
                    homeworkId = homeworkId,
                    onNavigateBack = { navController.popBackStack() },
                    onNavigateToEdit = { 
                        navController.navigate(Screen.AddHomework.route)
                    }
                )
            }
        }
    }
}
