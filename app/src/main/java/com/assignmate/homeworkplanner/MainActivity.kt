package com.assignmate.homeworkplanner

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.*
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.lifecycle.viewmodel.compose.viewModel
import com.assignmate.homeworkplanner.data.repository.HomeworkRepository
import com.assignmate.homeworkplanner.data.repository.UserPreferencesRepository
import com.assignmate.homeworkplanner.ui.theme.HomeworkPlannerTheme
import com.assignmate.homeworkplanner.ui.navigation.HomeworkPlannerNavigation
import com.assignmate.homeworkplanner.viewmodel.ViewModelFactory

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()
        super.onCreate(savedInstanceState)
        
        // Initialize repositories
        val database = (application as HomeworkPlannerApplication).database
        val homeworkRepository = HomeworkRepository(database.homeworkDao())
        val userPreferencesRepository = UserPreferencesRepository(database.userPreferencesDao())
        val viewModelFactory = ViewModelFactory(homeworkRepository)
        
        setContent {
            val isDarkTheme = isSystemInDarkTheme()
            
            HomeworkPlannerTheme(darkTheme = isDarkTheme) {
                HomeworkPlannerNavigation()
            }
        }
    }
}
