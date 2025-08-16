package com.assignmate.homeworkplanner.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.Settings
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavType
import androidx.navigation.navArgument
import com.assignmate.homeworkplanner.R

sealed class Screen(
    val route: String,
    val resourceId: Int,
    val icon: ImageVector
) {
    object Home : Screen("home", R.string.nav_home, Icons.Default.Home)
    object List : Screen("list", R.string.nav_list, Icons.Default.List)
    object Settings : Screen("settings", R.string.nav_settings, Icons.Default.Settings)
    object AddHomework : Screen("add_homework", R.string.add_homework, Icons.Default.Home)
    
    object HomeworkDetails : Screen(
        route = "homework_details/{homeworkId}",
        resourceId = R.string.app_name,
        icon = Icons.Default.Home
    ) {
        val arguments = listOf(
            navArgument("homeworkId") {
                type = NavType.LongType
            }
        )
        
        fun createRoute(homeworkId: Long) = "homework_details/$homeworkId"
    }
}
