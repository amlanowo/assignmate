package com.assignmate.homeworkplanner.data.database

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.assignmate.homeworkplanner.data.models.Homework
import com.assignmate.homeworkplanner.data.models.UserPreferences

@Database(
    entities = [Homework::class, UserPreferences::class],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class HomeworkDatabase : RoomDatabase() {
    abstract fun homeworkDao(): HomeworkDao
    abstract fun userPreferencesDao(): UserPreferencesDao
    
    companion object {
        @Volatile
        private var INSTANCE: HomeworkDatabase? = null
        
        fun getDatabase(context: Context): HomeworkDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    HomeworkDatabase::class.java,
                    "homework_database"
                )
                .fallbackToDestructiveMigration()
                .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
