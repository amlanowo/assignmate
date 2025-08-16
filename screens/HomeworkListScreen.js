import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  ScrollView,
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

export default function HomeworkListScreen() {
  const { colors, typography, spacing, borderRadius, shadows } = useTheme();
  const [homework, setHomework] = useState([]);
  const [filteredHomework, setFilteredHomework] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, completed, overdue

  useFocusEffect(
    React.useCallback(() => {
      loadHomework();
    }, [])
  );

  useEffect(() => {
    filterHomework();
  }, [homework, searchQuery, filter]);

  const loadHomework = async () => {
    const data = await Storage.getHomework();
    setHomework(data);
  };

  const filterHomework = () => {
    let filtered = homework;

    // Apply status filter
    const now = new Date();
    switch (filter) {
      case 'pending':
        filtered = filtered.filter(h => !h.isCompleted && new Date(h.dueDate) > now);
        break;
      case 'completed':
        filtered = filtered.filter(h => h.isCompleted);
        break;
      case 'overdue':
        filtered = filtered.filter(h => !h.isCompleted && new Date(h.dueDate) < now);
        break;
      default:
        break;
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(h =>
        h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (h.subject && h.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (h.description && h.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredHomework(filtered);
  };

  const toggleComplete = async (id, isCompleted) => {
    const updatedHomework = [...homework];
    const homeworkIndex = updatedHomework.findIndex(h => h.id === id);
    
    if (homeworkIndex !== -1) {
      const h = updatedHomework[homeworkIndex];
      const updatedHw = { ...h, isCompleted: !isCompleted };
      
      // Cancel notification if homework is completed
      if (updatedHw.isCompleted && h.notificationId) {
        try {
          await Notifications.cancelScheduledNotificationAsync(h.notificationId);
          console.log('Notification cancelled for completed homework:', h.notificationId);
          updatedHw.notificationId = null;
        } catch (error) {
          console.log('Error cancelling notification:', error);
        }
      }
      
      updatedHomework[homeworkIndex] = updatedHw;
    }
    
    await Storage.saveHomework(updatedHomework);
    setHomework(updatedHomework);
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
            // Cancel notification if it exists
            const homeworkToDelete = homework.find(h => h.id === id);
            if (homeworkToDelete && homeworkToDelete.notificationId) {
              try {
                await Notifications.cancelScheduledNotificationAsync(homeworkToDelete.notificationId);
                console.log('Notification cancelled for deleted homework:', homeworkToDelete.notificationId);
              } catch (error) {
                console.log('Error cancelling notification:', error);
              }
            }
            
            const updatedHomework = homework.filter(h => h.id !== id);
            await Storage.saveHomework(updatedHomework);
            setHomework(updatedHomework);
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
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 12,
          elevation: 6,
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
        
        {item.description && (
          <Text style={[typography.body, { color: colors.textSecondary, marginBottom: 12 }]} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        
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

  const FilterButton = ({ title, value, icon }) => (
    <TouchableOpacity
      style={[
        styles.filterButton, 
        { 
          backgroundColor: filter === value ? colors.primary : colors.card,
          borderRadius: borderRadius.sm,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }
      ]}
      onPress={() => setFilter(value)}
    >
      <Ionicons 
        name={icon} 
        size={14} 
        color={filter === value ? 'white' : colors.textSecondary} 
        style={styles.filterIcon}
      />
      <Text style={[
        typography.caption2, 
        { 
          color: filter === value ? 'white' : colors.textSecondary,
          fontWeight: filter === value ? '600' : '400',
        }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[typography.largeTitle, { color: colors.text }]}>
            All Homework
          </Text>
                     <Text style={[typography.subhead, { color: colors.textSecondary, marginTop: 4 }]}>
             Manage your assignments
           </Text>
        </View>
        
        {/* Search Bar */}
        <View style={[
          styles.searchContainer, 
          { 
            backgroundColor: colors.card, 
            borderRadius: borderRadius.md,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 4,
          }
        ]}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search homework..."
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterWrapper}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContainer}
            style={styles.filterScrollView}
          >
            <FilterButton
              title="All"
              value="all"
              icon="list-outline"
            />
            <FilterButton
              title="Pending"
              value="pending"
              icon="time-outline"
            />
            <FilterButton
              title="Completed"
              value="completed"
              icon="checkmark-circle-outline"
            />
            <FilterButton
              title="Overdue"
              value="overdue"
              icon="warning-outline"
            />
          </ScrollView>
          {/* Scroll indicator shadow */}
          <View style={[
            styles.scrollIndicator,
            { 
              backgroundColor: colors.background,
              shadowColor: colors.shadow,
              shadowOffset: { width: -4, height: 0 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 8,
            }
          ]} />
        </View>

        {/* Homework List */}
        <FlatList
          data={filteredHomework}
          renderItem={renderHomeworkItem}
          keyExtractor={item => item.id.toString()}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-outline" size={64} color={colors.textSecondary} />
                             <Text style={[typography.headline, { color: colors.textSecondary, marginTop: 16 }]}>
                 No homework found
               </Text>
              <Text style={[typography.subhead, { color: colors.textSecondary, textAlign: 'center' }]}>
                Try adjusting your search or filters
              </Text>
            </View>
          }
        />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
  },
  filterWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  filterScrollView: {
    paddingRight: 20, // Space for shadow indicator
  },
  filterScrollContainer: {
    paddingHorizontal: 4,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    minWidth: 60,
  },
  filterIcon: {
    marginRight: 4,
  },
  scrollIndicator: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 20,
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
