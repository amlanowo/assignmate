import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

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

  const SubjectBreakdown = () => {
    const subjectStats = {};
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    homeworkData.forEach(hw => {
      const dueDate = new Date(hw.dueDate);
      if (isWithinInterval(dueDate, { start: weekStart, end: weekEnd })) {
        if (!subjectStats[hw.subject]) {
          subjectStats[hw.subject] = { total: 0, completed: 0 };
        }
        subjectStats[hw.subject].total++;
        if (hw.isCompleted) {
          subjectStats[hw.subject].completed++;
        }
      }
    });

    return (
      <View style={[
        styles.subjectCard,
        {
          backgroundColor: colors.card,
          borderRadius: borderRadius.md,
          ...shadows.medium,
        }
      ]}>
        <Text style={[typography.title2, { color: colors.text, marginBottom: spacing.md }]}>
          Subject Breakdown
        </Text>
        
        {Object.keys(subjectStats).length === 0 ? (
          <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center' }]}>
            No homework this week
          </Text>
        ) : (
          Object.entries(subjectStats).map(([subject, stats]) => (
            <View key={subject} style={styles.subjectItem}>
              <View style={styles.subjectInfo}>
                <Text style={[typography.headline, { color: colors.text }]}>
                  {subject}
                </Text>
                <Text style={[typography.subhead, { color: colors.textSecondary }]}>
                  {stats.completed}/{stats.total} completed
                </Text>
              </View>
              <ProgressBar 
                percentage={stats.total > 0 ? (stats.completed / stats.total) * 100 : 0} 
                color={colors.primary} 
              />
            </View>
          ))
        )}
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

          {/* Subject Breakdown */}
          <SubjectBreakdown />
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
  subjectCard: {
    padding: 20,
  },
  subjectItem: {
    marginBottom: 16,
  },
  subjectInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
});
