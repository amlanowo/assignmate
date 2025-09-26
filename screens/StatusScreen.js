import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { format, startOfWeek, endOfWeek, isWithinInterval, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from 'date-fns';

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
};

export default function StatusScreen() {
  const { colors, typography, spacing, borderRadius, shadows } = useTheme();
  const [homeworkData, setHomeworkData] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weeklyStats, setWeeklyStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    completionRate: 0,
  });

  useFocusEffect(
    React.useCallback(() => {
      loadHomework();
    }, [])
  );

  const loadHomework = async () => {
    const data = await Storage.getHomework();
    setHomeworkData(data);
    calculateWeeklyStats(data);
  };

  const calculateWeeklyStats = (data) => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 }); // Sunday

    const weeklyHomework = data.filter(hw => {
      const dueDate = new Date(hw.dueDate);
      return isWithinInterval(dueDate, { start: weekStart, end: weekEnd });
    });

    const total = weeklyHomework.length;
    const completed = weeklyHomework.filter(hw => hw.isCompleted).length;
    const pending = total - completed;
    const overdue = weeklyHomework.filter(hw => 
      !hw.isCompleted && new Date(hw.dueDate) < now
    ).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    setWeeklyStats({
      total,
      completed,
      pending,
      overdue,
      completionRate,
    });
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
  };

  const getHomeworkForDate = (date) => {
    return homeworkData.filter(hw => {
      const dueDate = new Date(hw.dueDate);
      return isSameDay(dueDate, date);
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.primary;
    }
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <View style={[
      styles.statCard,
      {
        backgroundColor: colors.card,
        borderRadius: borderRadius.md,
        ...shadows.medium,
      }
    ]}>
      <View style={styles.statHeader}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: color + '20' }
        ]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <Text style={[typography.title3, { color: colors.text }]}>
          {value}
        </Text>
      </View>
      <Text style={[typography.headline, { color: colors.text, marginTop: spacing.sm }]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[typography.subhead, { color: colors.textSecondary, marginTop: spacing.xs }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );

  const ProgressBar = ({ percentage, color }) => (
    <View style={[
      styles.progressContainer,
      { backgroundColor: colors.border }
    ]}>
      <View style={[
        styles.progressBar,
        {
          width: `${percentage}%`,
          backgroundColor: color,
        }
      ]} />
    </View>
  );

  const WeeklyProgressCard = () => (
    <View style={[
      styles.progressCard,
      {
        backgroundColor: colors.card,
        borderRadius: borderRadius.md,
        ...shadows.medium,
      }
    ]}>
      <Text style={[typography.title2, { color: colors.text, marginBottom: spacing.md }]}>
        Weekly Progress
      </Text>
      
      <View style={styles.progressItem}>
        <View style={styles.progressInfo}>
          <Text style={[typography.headline, { color: colors.text }]}>
            Completion Rate
          </Text>
          <Text style={[typography.title3, { color: colors.primary }]}>
            {weeklyStats.completionRate}%
          </Text>
        </View>
        <ProgressBar percentage={weeklyStats.completionRate} color={colors.primary} />
      </View>

      <View style={styles.progressItem}>
        <View style={styles.progressInfo}>
          <Text style={[typography.headline, { color: colors.text }]}>
            Completed
          </Text>
          <Text style={[typography.title3, { color: colors.success }]}>
            {weeklyStats.completed}/{weeklyStats.total}
          </Text>
        </View>
        <ProgressBar 
          percentage={weeklyStats.total > 0 ? (weeklyStats.completed / weeklyStats.total) * 100 : 0} 
          color={colors.success} 
        />
      </View>
    </View>
  );



  // Calendar Components
  const CalendarHeader = () => (
    <View style={styles.calendarHeader}>
      <Text style={[styles.calendarTitle, { color: colors.text, ...typography.title1 }]}>
        Select a Day
      </Text>
      <View style={styles.monthNavigation}>
        <Text style={[styles.monthText, { color: colors.text, ...typography.title2 }]}>
          {format(currentDate, 'MMMM yyyy')}
        </Text>
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: colors.surface }]}
            onPress={prevMonth}
          >
            <Ionicons name="chevron-back" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: colors.surface }]}
            onPress={nextMonth}
          >
            <Ionicons name="chevron-forward" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const DayLabels = () => (
    <View style={styles.dayLabels}>
      {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, index) => (
        <Text key={index} style={[styles.dayLabel, { color: colors.textSecondary, ...typography.caption1 }]}>
          {day}
        </Text>
      ))}
    </View>
  );

  const CalendarGrid = () => {
    const days = getDaysInMonth(currentDate);
    const firstDayOfMonth = startOfMonth(currentDate);
    const dayOfWeek = firstDayOfMonth.getDay();
    
    // Add empty cells for days before the first day of the month
    const emptyCells = Array(dayOfWeek).fill(null);
    const allDays = [...emptyCells, ...days];

    return (
      <View style={styles.calendarGrid}>
        {allDays.map((day, index) => {
          if (!day) {
            return <View key={`empty-${index}`} style={styles.emptyDay} />;
          }

          const homeworkForDay = getHomeworkForDate(day);
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentDay = isToday(day);
          const hasHomework = homeworkForDay.length > 0;

          return (
            <TouchableOpacity
              key={day.toISOString()}
              style={[
                styles.dayCell,
                isSelected && {
                  backgroundColor: colors.primary,
                  borderRadius: borderRadius.full,
                },
                hasHomework && !isSelected && {
                  backgroundColor: colors.primary + '20',
                  borderRadius: borderRadius.full,
                },
              ]}
              onPress={() => setSelectedDate(day)}
            >
              <Text style={[
                styles.dayText,
                { color: colors.text, ...typography.body },
                isSelected && { color: 'white' },
                isCurrentDay && !isSelected && { color: colors.primary, fontWeight: 'bold' },
              ]}>
                {format(day, 'd')}
              </Text>
              {hasHomework && (
                <View style={styles.homeworkIndicator}>
                  {homeworkForDay.slice(0, 3).map((hw, hwIndex) => (
                    <View
                      key={hw.id}
                      style={[
                        styles.homeworkDot,
                        { backgroundColor: getPriorityColor(hw.priority) },
                      ]}
                    />
                  ))}
                  {homeworkForDay.length > 3 && (
                    <Text style={[styles.moreIndicator, { color: colors.textSecondary, ...typography.caption2 }]}>
                      +{homeworkForDay.length - 3}
                    </Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const SelectedDateHomework = () => {
    const homeworkForSelectedDate = getHomeworkForDate(selectedDate);
    
    if (homeworkForSelectedDate.length === 0) {
      return (
        <View style={[styles.noHomeworkContainer, { backgroundColor: colors.card, borderRadius: borderRadius.md, ...shadows.medium }]}>
          <Ionicons name="calendar-outline" size={48} color={colors.textSecondary} />
          <Text style={[styles.noHomeworkText, { color: colors.textSecondary, ...typography.headline }]}>
            No homework due on {format(selectedDate, 'MMMM d, yyyy')}
          </Text>
        </View>
      );
    }

    return (
      <View style={[styles.homeworkListContainer, { backgroundColor: colors.card, borderRadius: borderRadius.md, ...shadows.medium }]}>
        <Text style={[styles.homeworkListTitle, { color: colors.text, ...typography.title2 }]}>
          Due on {format(selectedDate, 'MMMM d, yyyy')}
        </Text>
        {homeworkForSelectedDate.map((hw) => (
          <View key={hw.id} style={styles.homeworkItem}>
            <View style={styles.homeworkInfo}>
              <Text style={[styles.homeworkTitle, { color: colors.text, ...typography.headline }]}>
                {hw.title}
              </Text>
              {hw.subject && (
                <Text style={[styles.homeworkSubject, { color: colors.textSecondary, ...typography.subhead }]}>
                  {hw.subject}
                </Text>
              )}
            </View>
            <View style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(hw.priority), borderRadius: borderRadius.full }
            ]}>
              <Text style={[styles.priorityText, { color: 'white', ...typography.caption1 }]}>
                {hw.priority.toUpperCase()}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[typography.largeTitle, { color: colors.text }]}>
              Weekly Homework Status
            </Text>
            <Text style={[typography.subhead, { color: colors.textSecondary, marginTop: spacing.xs }]}>
              Track your progress this week
            </Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <StatCard
              title="Total"
              value={weeklyStats.total}
              subtitle="This week"
              icon="book-outline"
              color={colors.primary}
            />
            <StatCard
              title="Completed"
              value={weeklyStats.completed}
              subtitle="Done"
              icon="checkmark-circle-outline"
              color={colors.success}
            />
            <StatCard
              title="Pending"
              value={weeklyStats.pending}
              subtitle="To do"
              icon="time-outline"
              color={colors.warning}
            />
            <StatCard
              title="Overdue"
              value={weeklyStats.overdue}
              subtitle="Late"
              icon="alert-circle-outline"
              color={colors.error}
            />
          </View>

          {/* Weekly Progress */}
          <WeeklyProgressCard />

          {/* Calendar */}
          <View style={[styles.calendarContainer, { backgroundColor: colors.card, borderRadius: borderRadius.lg, ...shadows.large }]}>
            <CalendarHeader />
            <DayLabels />
            <CalendarGrid />
          </View>

          {/* Selected Date Homework */}
          <View style={styles.selectedDateSection}>
            <SelectedDateHomework />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    width: '48%',
    padding: 20,
    marginBottom: 16,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCard: {
    padding: 20,
    marginBottom: 32,
  },
  progressItem: {
    marginBottom: 20,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },

  // Calendar styles
  calendarContainer: {
    padding: 20,
    marginBottom: 24,
  },
  calendarHeader: {
    marginBottom: 20,
  },
  calendarTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthText: {
    fontWeight: '600',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayLabels: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dayLabel: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '500',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyDay: {
    width: '14.28%',
    height: 50,
  },
  dayCell: {
    width: '14.28%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
  },
  homeworkIndicator: {
    position: 'absolute',
    bottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  homeworkDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  moreIndicator: {
    fontSize: 10,
    marginLeft: 2,
  },
  selectedDateSection: {
    marginTop: 8,
  },
  noHomeworkContainer: {
    padding: 32,
    alignItems: 'center',
  },
  noHomeworkText: {
    marginTop: 16,
    textAlign: 'center',
  },
  homeworkListContainer: {
    padding: 20,
  },
  homeworkListTitle: {
    marginBottom: 16,
  },
  homeworkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  homeworkInfo: {
    flex: 1,
    marginRight: 12,
  },
  homeworkTitle: {
    marginBottom: 4,
  },
  homeworkSubject: {
    opacity: 0.7,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  priorityText: {
    fontWeight: '600',
  },
});
