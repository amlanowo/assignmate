package com.assignmate.homeworkplanner

import android.app.Application
import androidx.work.Configuration
import androidx.work.WorkManager
import com.assignmate.homeworkplanner.data.database.HomeworkDatabase

class HomeworkPlannerApplication : Application(), Configuration.Provider {
    
    val database: HomeworkDatabase by lazy { HomeworkDatabase.getDatabase(this) }
    
    override fun onCreate() {
        super.onCreate()
        // Initialize WorkManager
        WorkManager.initialize(this, workManagerConfiguration)
    }
    
    override fun getWorkManagerConfiguration(): Configuration {
        return Configuration.Builder()
            .setMinimumLoggingLevel(android.util.Log.INFO)
            .build()
    }
}
