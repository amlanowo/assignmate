import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { useTheme } from '../context/ThemeContext';

// Simple storage helper
const Storage = {
  async getHomework() {
    try {
      const data = await AsyncStorage.getItem('homework');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.log('Error loading homework:', error);
      return [];
    }
  },
  
  async saveHomework(homework) {
    try {
      await AsyncStorage.setItem('homework', JSON.stringify(homework));
    } catch (error) {
      console.log('Error saving homework:', error);
    }
  }
};

export default function HomeScreen() {
  const { colors, typography, spacing, borderRadius, shadows } = useTheme();
  const [homework, setHomework] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    completed: 0,
    overdue: 0,
  });
  const [notificationStatus, setNotificationStatus] = useState('granted');

  useFocusEffect(
    React.useCallback(() => {
      loadHomework();
      checkNotificationStatus();
    }, [])
  );

  const loadHomework = async () => {
    const data = await Storage.getHomework();
    setHomework(data);
    calculateStats(data);
  };

  const calculateStats = (data) => {
    const now = new Date();
    const pending = data.filter(h => !h.isCompleted && new Date(h.dueDate) > now).length;
    const completed = data.filter(h => h.isCompleted).length;
    const overdue = data.filter(h => !h.isCompleted && new Date(h.dueDate) < now).length;
    
    setStats({ pending, completed, overdue });
  };

  const checkNotificationStatus = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setNotificationStatus(status);
    } catch (error) {
      console.log('Error checking notification status:', error);
    }
  };

  const toggleComplete = async (id, isCompleted) => {
    const updatedHomework = homework.map(h => 
      h.id === id ? { ...h, isCompleted: !isCompleted } : h
    );
    await Storage.saveHomework(updatedHomework);
    setHomework(updatedHomework);
    calculateStats(updatedHomework);
  };

  const deleteHomework = (id) => {
    Alert.alert(
      'Delete Homework',
      'Are you sure you want to delete this homework?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedHomework = homework.filter(h => h.id !== id);
            await Storage.saveHomework(updatedHomework);
            setHomework(updatedHomework);
            calculateStats(updatedHomework);
          },
        },
      ]
    );
  };

  const renderHomeworkItem = ({ item }) => {
    const isOverdue = !item.isCompleted && new Date(item.dueDate) < new Date();
    const priorityColors = {
      high: colors.error,
      medium: colors.warning,
      low: colors.success,
    };

    return (
      <View style={[
        styles.homeworkCard, 
        { 
          backgroundColor: colors.card, 
          borderRadius: borderRadius.md,
          ...shadows.medium
        }, 
        item.isCompleted && styles.completedCard
      ]}>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text style={[
              typography.headline,
              { color: colors.text }, 
              item.isCompleted && styles.completedText
            ]}>
              {item.title}
            </Text>
            {item.subject && (
              <Text style={[typography.subhead, { color: colors.textSecondary }]}>
                {item.subject}
              </Text>
            )}
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity
              onPress={() => toggleComplete(item.id, item.isCompleted)}
              style={styles.actionButton}
            >
              <Ionicons
                name={item.isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
                size={24}
                color={item.isCompleted ? colors.success : colors.textSecondary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => deleteHomework(item.id)}
              style={styles.actionButton}
            >
              <Ionicons name="trash-outline" size={24} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          <View style={[
            styles.priorityBadge, 
            { 
              backgroundColor: priorityColors[item.priority],
              borderRadius: borderRadius.full
            }
          ]}>
            <Text style={[typography.caption1, { color: 'white', fontWeight: '600' }]}>
              {item.priority.toUpperCase()}
            </Text>
          </View>
          <Text style={[
            typography.footnote, 
            { color: colors.textSecondary }, 
            isOverdue && styles.overdueText
          ]}>
            Due: {format(new Date(item.dueDate), 'MMM dd, yyyy')}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[typography.largeTitle, { color: colors.text }]}>
            Homework Planner
          </Text>
          <Text style={[typography.subhead, { color: colors.textSecondary, marginTop: 4 }]}>
            Stay organized and on track
          </Text>
        </View>

        {/* Notification Status */}
        {notificationStatus !== 'granted' && (
          <View style={[styles.notificationWarning, { 
            backgroundColor: colors.warning + '20', 
            borderColor: colors.warning,
            borderRadius: borderRadius.md 
          }]}>
            <Ionicons name="notifications-off" size={20} color={colors.warning} />
            <Text style={[styles.notificationWarningText, { color: colors.warning, ...typography.subhead }]}>
              Notifications are disabled. Enable them in Settings to get homework reminders.
            </Text>
          </View>
        )}
        
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[
            styles.statCard, 
            { 
              backgroundColor: colors.card, 
              borderRadius: borderRadius.md,
              ...shadows.small
            }
          ]}>
            <Text style={[typography.title1, { color: colors.primary }]}>
              {stats.pending}
            </Text>
            <Text style={[typography.caption1, { color: colors.textSecondary }]}>
              Pending
            </Text>
          </View>
          
          <View style={[
            styles.statCard, 
            { 
              backgroundColor: colors.card, 
              borderRadius: borderRadius.md,
              ...shadows.small
            }
          ]}>
            <Text style={[typography.title1, { color: colors.success }]}>
              {stats.completed}
            </Text>
            <Text style={[typography.caption1, { color: colors.textSecondary }]}>
              Completed
            </Text>
          </View>
          
          <View style={[
            styles.statCard, 
            { 
              backgroundColor: colors.card, 
              borderRadius: borderRadius.md,
              ...shadows.small
            }
          ]}>
            <Text style={[typography.title1, { color: colors.error }]}>
              {stats.overdue}
            </Text>
            <Text style={[typography.caption1, { color: colors.textSecondary }]}>
              Overdue
            </Text>
          </View>
        </View>

        {/* Homework List */}
        <View style={styles.listContainer}>
          <Text style={[typography.title2, { color: colors.text, marginBottom: 16 }]}>
            Recent Homework
          </Text>
          <FlatList
            data={homework.slice(0, 5)} // Show only first 5 items
            renderItem={renderHomeworkItem}
            keyExtractor={item => item.id.toString()}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="document-outline" size={64} color={colors.textSecondary} />
                                 <Text style={[typography.headline, { color: colors.textSecondary, marginTop: 16 }]}>
                   No homework yet
                 </Text>
                <Text style={[typography.subhead, { color: colors.textSecondary, textAlign: 'center' }]}>
                  Add your first homework assignment to get started
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
    marginHorizontal: 4,
  },
  notificationWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  notificationWarningText: {
    flex: 1,
    marginLeft: 12,
  },
  listContainer: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  homeworkCard: {
    padding: 16,
    marginBottom: 12,
  },
  completedCard: {
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  cardActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 8,
    padding: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  overdueText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
});
