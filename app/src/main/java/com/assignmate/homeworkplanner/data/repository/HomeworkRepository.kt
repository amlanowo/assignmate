package com.assignmate.homeworkplanner.data.repository

import com.assignmate.homeworkplanner.data.database.HomeworkDao
import com.assignmate.homeworkplanner.data.models.Homework
import kotlinx.coroutines.flow.Flow
import java.time.LocalDateTime

class HomeworkRepository(
    private val homeworkDao: HomeworkDao
) {
    val allHomework: Flow<List<Homework>> = homeworkDao.getAllHomework()
    
    suspend fun insert(homework: Homework): Long {
        return homeworkDao.insert(homework)
    }
    
    suspend fun update(homework: Homework) {
        homeworkDao.update(homework)
    }
    
    suspend fun delete(homework: Homework) {
        homeworkDao.delete(homework)
    }
    
    suspend fun getHomeworkById(id: Long): Homework? {
        return homeworkDao.getHomeworkById(id)
    }
    
    fun getHomeworkByStatus(isCompleted: Boolean): Flow<List<Homework>> {
        return homeworkDao.getHomeworkByStatus(isCompleted)
    }
    
    fun getOverdueHomework(now: LocalDateTime): Flow<List<Homework>> {
        return homeworkDao.getOverdueHomework(now)
    }
    
    fun getTodayHomework(date: LocalDateTime): Flow<List<Homework>> {
        return homeworkDao.getTodayHomework(date)
    }
    
    fun getUpcomingHomework(date: LocalDateTime): Flow<List<Homework>> {
        return homeworkDao.getUpcomingHomework(date)
    }
    
    suspend fun deleteCompletedHomework() {
        homeworkDao.deleteCompletedHomework()
    }
    
    fun getPendingHomeworkCount(): Flow<Int> {
        return homeworkDao.getPendingHomeworkCount()
    }
    
    fun getOverdueHomeworkCount(now: LocalDateTime): Flow<Int> {
        return homeworkDao.getOverdueHomeworkCount(now)
    }
}
