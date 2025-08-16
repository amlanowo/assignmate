package com.assignmate.homeworkplanner.data.database

import androidx.room.*
import com.assignmate.homeworkplanner.data.models.Homework
import kotlinx.coroutines.flow.Flow
import java.time.LocalDateTime

@Dao
interface HomeworkDao {
    @Query("SELECT * FROM homework ORDER BY due_date ASC")
    fun getAllHomework(): Flow<List<Homework>>
    
    @Query("SELECT * FROM homework WHERE is_completed = :isCompleted ORDER BY due_date ASC")
    fun getHomeworkByStatus(isCompleted: Boolean): Flow<List<Homework>>
    
    @Query("SELECT * FROM homework WHERE due_date < :now AND is_completed = 0 ORDER BY due_date ASC")
    fun getOverdueHomework(now: LocalDateTime): Flow<List<Homework>>
    
    @Query("SELECT * FROM homework WHERE DATE(due_date) = DATE(:date) AND is_completed = 0 ORDER BY due_date ASC")
    fun getTodayHomework(date: LocalDateTime): Flow<List<Homework>>
    
    @Query("SELECT * FROM homework WHERE due_date > :date AND is_completed = 0 ORDER BY due_date ASC")
    fun getUpcomingHomework(date: LocalDateTime): Flow<List<Homework>>
    
    @Query("SELECT * FROM homework WHERE id = :id")
    suspend fun getHomeworkById(id: Long): Homework?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(homework: Homework): Long
    
    @Update
    suspend fun update(homework: Homework)
    
    @Delete
    suspend fun delete(homework: Homework)
    
    @Query("DELETE FROM homework WHERE is_completed = 1")
    suspend fun deleteCompletedHomework()
    
    @Query("SELECT COUNT(*) FROM homework WHERE is_completed = 0")
    fun getPendingHomeworkCount(): Flow<Int>
    
    @Query("SELECT COUNT(*) FROM homework WHERE due_date < :now AND is_completed = 0")
    fun getOverdueHomeworkCount(now: LocalDateTime): Flow<Int>
}
