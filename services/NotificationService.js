import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior with better defaults
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  constructor() {
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return true;

    try {
      // Request permissions with error handling
      let permissionStatus;
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        permissionStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          permissionStatus = status;
        }
      } catch (permissionError) {
        console.log('Permission request failed:', permissionError);
        return false;
      }

      if (permissionStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return false;
      }

      // Configure notification channels for Android
      if (Platform.OS === 'android') {
        try {
          // Homework reminders channel (high priority)
          await Notifications.setNotificationChannelAsync('homework-reminders', {
            name: 'Homework Reminders',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF6B6B',
            sound: 'default',
            enableVibrate: true,
            showBadge: true,
          });

          // Daily review channel (medium priority)
          await Notifications.setNotificationChannelAsync('daily-review', {
            name: 'Daily Review',
            importance: Notifications.AndroidImportance.DEFAULT,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#4ECDC4',
            sound: 'default',
            enableVibrate: true,
            showBadge: false,
          });

          // General notifications channel
          await Notifications.setNotificationChannelAsync('general', {
            name: 'General',
            importance: Notifications.AndroidImportance.DEFAULT,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#45B7D1',
            sound: 'default',
            enableVibrate: false,
            showBadge: false,
          });
        } catch (channelError) {
          console.log('Channel creation failed:', channelError);
        }
      }

      this.isInitialized = true;
      console.log('Notification service initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing notification service:', error);
      return false;
    }
  }

  // Enhanced due date reminders with better messaging
  async scheduleDueDateReminders(homework) {
    try {
      const dueDate = new Date(homework.dueDate);
      const now = new Date();

      // Only schedule if due date is in the future
      if (dueDate <= now) return;

      // Cancel any existing notifications for this homework
      await this.cancelHomeworkNotifications(homework.id);

      const reminders = [
        { 
          hours: 24, 
          title: '📚 Due Tomorrow!', 
          body: `"${homework.title}" is due tomorrow. Don't forget to complete it!`,
          channelId: 'homework-reminders',
          priority: 'high'
        },
        { 
          hours: 6, 
          title: '⏰ Due Soon!', 
          body: `"${homework.title}" is due in 6 hours. Time to get started!`,
          channelId: 'homework-reminders',
          priority: 'high'
        },
        { 
          hours: 1, 
          title: '🚨 Due in 1 Hour!', 
          body: `"${homework.title}" is due in 1 hour! This is your final reminder.`,
          channelId: 'homework-reminders',
          priority: 'high'
        },
      ];

      for (const reminder of reminders) {
        const triggerDate = new Date(dueDate.getTime() - (reminder.hours * 60 * 60 * 1000));
        
        // Only schedule if the reminder time is in the future
        if (triggerDate > now) {
          try {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: reminder.title,
                body: reminder.body,
                data: {
                  type: 'due-date-reminder',
                  homeworkId: homework.id,
                  homeworkTitle: homework.title,
                  subject: homework.subject,
                  priority: homework.priority,
                  hoursUntilDue: reminder.hours,
                },
                sound: true,
                priority: reminder.priority === 'high' ? 'high' : 'default',
                autoDismiss: false,
                sticky: reminder.hours <= 1, // Make 1-hour reminders sticky
              },
              trigger: {
                date: triggerDate,
                channelId: reminder.channelId,
              },
            });
          } catch (scheduleError) {
            console.log('Failed to schedule reminder:', scheduleError);
          }
        }
      }

      console.log(`Scheduled ${reminders.length} reminders for homework: ${homework.title}`);
    } catch (error) {
      console.error('Error scheduling due date reminders:', error);
    }
  }

  // Enhanced daily review reminder
  async scheduleDailyReviewReminder(time = '19:00') {
    try {
      // Cancel existing daily review notifications
      await this.cancelDailyReviewNotifications();

      const [hours, minutes] = time.split(':').map(Number);
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '📚 Daily Homework Review',
          body: 'Time to review your homework for today! Check what\'s due and plan for tomorrow.',
          data: {
            type: 'daily-review',
            action: 'open-app',
          },
          sound: true,
          priority: 'default',
          autoDismiss: true,
        },
        trigger: {
          hour: hours,
          minute: minutes,
          repeats: true,
          channelId: 'daily-review',
        },
      });

      console.log(`Scheduled daily review reminder for ${time}`);
    } catch (error) {
      console.error('Error scheduling daily review reminder:', error);
    }
  }

  // Schedule a custom notification
  async scheduleCustomNotification(title, body, triggerDate, data = {}) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: {
            type: 'custom',
            ...data,
          },
          sound: true,
          priority: 'default',
        },
        trigger: {
          date: triggerDate,
          channelId: 'general',
        },
      });
    } catch (error) {
      console.error('Error scheduling custom notification:', error);
    }
  }

  // Enhanced test notification
  async sendTestNotification() {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🧪 Test Notification',
          body: 'This is a test notification from Homework Planner! Notifications are working perfectly.',
          data: { 
            type: 'test',
            timestamp: new Date().toISOString(),
          },
          sound: true,
          priority: 'default',
          autoDismiss: true,
        },
        trigger: { 
          seconds: 3,
          channelId: 'general',
        },
      });
      
      console.log('Test notification scheduled');
    } catch (error) {
      console.error('Error sending test notification:', error);
      throw error;
    }
  }

  // Send immediate notification
  async sendImmediateNotification(title, body, data = {}) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: {
            type: 'immediate',
            ...data,
          },
          sound: true,
          priority: 'default',
        },
        trigger: { 
          seconds: 1,
          channelId: 'general',
        },
      });
    } catch (error) {
      console.error('Error sending immediate notification:', error);
    }
  }

  // Cancel all notifications for a specific homework
  async cancelHomeworkNotifications(homeworkId) {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      
      for (const notification of scheduledNotifications) {
        if (notification.content.data?.homeworkId === homeworkId) {
          await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
      }
    } catch (error) {
      console.error('Error canceling homework notifications:', error);
    }
  }

  // Cancel daily review notifications
  async cancelDailyReviewNotifications() {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      
      for (const notification of scheduledNotifications) {
        if (notification.content.data?.type === 'daily-review') {
          await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
      }
    } catch (error) {
      console.error('Error canceling daily review notifications:', error);
    }
  }

  // Cancel all notifications
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications canceled');
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  // Get all scheduled notifications
  async getScheduledNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  // Get notification statistics
  async getNotificationStats() {
    try {
      const notifications = await this.getScheduledNotifications();
      const stats = {
        total: notifications.length,
        dueDateReminders: notifications.filter(n => n.content.data?.type === 'due-date-reminder').length,
        dailyReviews: notifications.filter(n => n.content.data?.type === 'daily-review').length,
        custom: notifications.filter(n => n.content.data?.type === 'custom').length,
      };
      return stats;
    } catch (error) {
      console.error('Error getting notification stats:', error);
      return { total: 0, dueDateReminders: 0, dailyReviews: 0, custom: 0 };
    }
  }

  // Update notifications when homework is modified
  async updateHomeworkNotifications(homework) {
    await this.scheduleDueDateReminders(homework);
  }

  // Remove notifications when homework is deleted
  async removeHomeworkNotifications(homeworkId) {
    await this.cancelHomeworkNotifications(homeworkId);
  }

  // Check if notifications are enabled
  async areNotificationsEnabled() {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      return false;
    }
  }

  // Simple permission request
  async requestPermissions() {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }
}

// Export singleton instance
export default new NotificationService();
