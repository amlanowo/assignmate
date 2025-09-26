import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Simple in-app notification service as fallback
class SimpleNotificationService {
  constructor() {
    this.isEnabled = false;
    this.pendingNotifications = [];
  }

  async initialize() {
    try {
      // Check if user has enabled notifications
      const enabled = await AsyncStorage.getItem('notifications_enabled');
      this.isEnabled = enabled === 'true';
      return this.isEnabled;
    } catch (error) {
      console.log('Error checking notification settings:', error);
      return false;
    }
  }

  async enable() {
    try {
      await AsyncStorage.setItem('notifications_enabled', 'true');
      this.isEnabled = true;
      return true;
    } catch (error) {
      console.log('Error enabling notifications:', error);
      return false;
    }
  }

  async disable() {
    try {
      await AsyncStorage.setItem('notifications_enabled', 'false');
      this.isEnabled = false;
      return true;
    } catch (error) {
      console.log('Error disabling notifications:', error);
      return false;
    }
  }

  // Show immediate notification
  showNotification(title, message) {
    if (this.isEnabled) {
      Alert.alert(title, message, [{ text: 'OK' }]);
    }
  }

  // Schedule a simple reminder (stores in AsyncStorage)
  async scheduleReminder(homework, hoursBefore) {
    if (!this.isEnabled) return;

    try {
      const dueDate = new Date(homework.dueDate);
      const reminderTime = new Date(dueDate.getTime() - (hoursBefore * 60 * 60 * 1000));
      
      const reminder = {
        id: `${homework.id}_${hoursBefore}h`,
        homeworkId: homework.id,
        title: homework.title,
        reminderTime: reminderTime.toISOString(),
        hoursBefore,
        message: `"${homework.title}" is due in ${hoursBefore} hour${hoursBefore > 1 ? 's' : ''}!`
      };

      const existingReminders = await this.getScheduledReminders();
      const updatedReminders = existingReminders.filter(r => r.id !== reminder.id);
      updatedReminders.push(reminder);
      
      await AsyncStorage.setItem('scheduled_reminders', JSON.stringify(updatedReminders));
    } catch (error) {
      console.log('Error scheduling reminder:', error);
    }
  }

  // Get all scheduled reminders
  async getScheduledReminders() {
    try {
      const reminders = await AsyncStorage.getItem('scheduled_reminders');
      return reminders ? JSON.parse(reminders) : [];
    } catch (error) {
      console.log('Error getting reminders:', error);
      return [];
    }
  }

  // Check for due reminders
  async checkDueReminders() {
    if (!this.isEnabled) return;

    try {
      const reminders = await this.getScheduledReminders();
      const now = new Date();
      const dueReminders = reminders.filter(reminder => {
        const reminderTime = new Date(reminder.reminderTime);
        return reminderTime <= now;
      });

      for (const reminder of dueReminders) {
        this.showNotification('📚 Homework Reminder', reminder.message);
      }

      // Remove due reminders
      const remainingReminders = reminders.filter(reminder => {
        const reminderTime = new Date(reminder.reminderTime);
        return reminderTime > now;
      });

      await AsyncStorage.setItem('scheduled_reminders', JSON.stringify(remainingReminders));
    } catch (error) {
      console.log('Error checking reminders:', error);
    }
  }

  // Schedule due date reminders for homework
  async scheduleDueDateReminders(homework) {
    if (!this.isEnabled) return;

    const dueDate = new Date(homework.dueDate);
    const now = new Date();

    if (dueDate <= now) return;

    // Schedule reminders at 24h, 6h, and 1h before
    const reminderTimes = [24, 6, 1];
    
    for (const hours of reminderTimes) {
      await this.scheduleReminder(homework, hours);
    }
  }

  // Cancel reminders for a specific homework
  async cancelHomeworkReminders(homeworkId) {
    try {
      const reminders = await this.getScheduledReminders();
      const updatedReminders = reminders.filter(r => r.homeworkId !== homeworkId);
      await AsyncStorage.setItem('scheduled_reminders', JSON.stringify(updatedReminders));
    } catch (error) {
      console.log('Error canceling reminders:', error);
    }
  }



  // Check if notifications are enabled
  async areNotificationsEnabled() {
    return this.isEnabled;
  }
}

export default new SimpleNotificationService();


