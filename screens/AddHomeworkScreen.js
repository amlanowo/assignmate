import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

export default function AddHomeworkScreen({ navigation }) {
  const { colors, typography, spacing, borderRadius, shadows } = useTheme();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState('medium');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [enableReminders, setEnableReminders] = useState(true);
  const [reminderTime, setReminderTime] = useState('1_hour'); // Default: 1 hour before
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  


  const priorities = [
    { key: 'low', label: 'Low', color: colors.success },
    { key: 'medium', label: 'Medium', color: colors.warning },
    { key: 'high', label: 'High', color: colors.error },
  ];

  const reminderOptions = [
    { key: '15_min', label: '15 minutes before', value: 15 },
    { key: '30_min', label: '30 minutes before', value: 30 },
    { key: '1_hour', label: '1 hour before', value: 60 },
    { key: '2_hours', label: '2 hours before', value: 120 },
    { key: '1_day', label: '1 day before', value: 1440 },
    { key: '2_days', label: '2 days before', value: 2880 },
  ];

  const scheduleNotification = async (homework) => {
    if (!enableReminders) return;

    try {
      const selectedOption = reminderOptions.find(option => option.key === reminderTime);
      if (!selectedOption) return;

      const reminderDate = new Date(homework.dueDate);
      reminderDate.setMinutes(reminderDate.getMinutes() - selectedOption.value);

      // Don't schedule if reminder time has already passed
      if (reminderDate <= new Date()) return;

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '📚 Homework Reminder',
          body: `${homework.title} is due in ${selectedOption.label.replace(' before', '')}!`,
          data: { 
            homeworkId: homework.id,
            type: 'homework_reminder'
          },
          sound: true,
        },
        trigger: {
          date: reminderDate,
        },
      });

      console.log('Notification scheduled:', notificationId);
      return notificationId;
    } catch (error) {
      console.log('Error scheduling notification:', error);
    }
  };



  const saveHomework = async () => {
    if (!title.trim()) {
      Alert.alert('❌ Error', 'Please enter a title for your homework');
      return;
    }

    try {
      const existingHomework = await Storage.getHomework();
      const newHomework = {
        id: Date.now(),
        title: title.trim(),
        subject: subject.trim(),
        description: description.trim(),
        dueDate: dueDate.toISOString(),
        priority,
        isCompleted: false,
        createdAt: new Date().toISOString(),
        notificationId: null,
        reminderEnabled: enableReminders,
        reminderTime: reminderTime,
      };
      
      // Schedule notification if reminders are enabled
      if (enableReminders) {
        const notificationId = await scheduleNotification(newHomework);
        if (notificationId) {
          newHomework.notificationId = notificationId;
        }
      }
      
      const updatedHomework = [...existingHomework, newHomework];
      await Storage.saveHomework(updatedHomework);
      
      Alert.alert('✅ Success', 'Homework added successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
      clearForm();
    } catch (error) {
      Alert.alert('❌ Error', 'Failed to save homework');
    }
  };

  const clearForm = () => {
    setTitle('');
    setSubject('');
    setDescription('');
    setDueDate(new Date());
    setPriority('medium');
    setEnableReminders(true);
    setReminderTime('1_hour');
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const getSelectedReminderLabel = () => {
    const selected = reminderOptions.find(option => option.key === reminderTime);
    return selected ? selected.label : '1 hour before';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.header, { color: colors.text, ...typography.title1 }]}>
            Add New Homework
          </Text>

          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text, ...typography.headline }]}>
              Title *
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.card, 
                color: colors.text, 
                borderColor: colors.border,
                borderRadius: borderRadius.md,
                ...typography.body 
              }]}
              placeholder="Enter homework title"
              placeholderTextColor={colors.textSecondary}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Subject Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text, ...typography.headline }]}>
              Subject
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.card, 
                color: colors.text, 
                borderColor: colors.border,
                borderRadius: borderRadius.md,
                ...typography.body 
              }]}
              placeholder="e.g., Math, Science, English"
              placeholderTextColor={colors.textSecondary}
              value={subject}
              onChangeText={setSubject}
            />
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text, ...typography.headline }]}>
              Description
            </Text>
            <TextInput
              style={[styles.textArea, { 
                backgroundColor: colors.card, 
                color: colors.text, 
                borderColor: colors.border,
                borderRadius: borderRadius.md,
                ...typography.body 
              }]}
              placeholder="Add any additional details..."
              placeholderTextColor={colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Due Date */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text, ...typography.headline }]}>
              Due Date
            </Text>
            <TouchableOpacity
              style={[styles.dateButton, { 
                backgroundColor: colors.card, 
                borderColor: colors.border,
                borderRadius: borderRadius.md,
                ...shadows.small 
              }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar" size={20} color={colors.primary} />
              <Text style={[styles.dateButtonText, { color: colors.text, ...typography.body }]}>
                {dueDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Priority Selection */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text, ...typography.headline }]}>
              Priority
            </Text>
            <View style={styles.priorityContainer}>
              {priorities.map((priorityOption) => (
                <TouchableOpacity
                  key={priorityOption.key}
                  style={[
                    styles.priorityButton,
                    {
                      backgroundColor: priority === priorityOption.key ? priorityOption.color : colors.card,
                      borderColor: colors.border,
                      borderRadius: borderRadius.md,
                      ...shadows.small
                    }
                  ]}
                  onPress={() => setPriority(priorityOption.key)}
                >
                  <Text style={[
                    styles.priorityButtonText,
                    { 
                      color: priority === priorityOption.key ? 'white' : colors.text,
                      ...typography.body 
                    }
                  ]}>
                    {priorityOption.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Notification Reminders */}
          <View style={[styles.reminderCard, { 
            backgroundColor: colors.card, 
            borderRadius: borderRadius.md,
            ...shadows.medium 
          }]}>
            <View style={styles.reminderHeader}>
              <Ionicons name="notifications" size={24} color={colors.primary} />
              <Text style={[styles.reminderTitle, { color: colors.text, ...typography.headline }]}>
                Reminder Settings
              </Text>
              <Switch
                value={enableReminders}
                onValueChange={setEnableReminders}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                ios_backgroundColor={colors.border}
              />
            </View>

            {enableReminders && (
              <View style={styles.reminderOptions}>
                <Text style={[styles.reminderLabel, { color: colors.textSecondary, ...typography.subhead }]}>
                  Remind me:
                </Text>
                <TouchableOpacity
                  style={[styles.reminderButton, { 
                    backgroundColor: colors.surface, 
                    borderColor: colors.border,
                    borderRadius: borderRadius.sm 
                  }]}
                  onPress={() => setShowReminderPicker(true)}
                >
                  <Text style={[styles.reminderButtonText, { color: colors.text, ...typography.body }]}>
                    {getSelectedReminderLabel()}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.clearButton, { 
                backgroundColor: colors.surface, 
                borderColor: colors.border,
                borderRadius: borderRadius.md 
              }]}
              onPress={clearForm}
            >
              <Text style={[styles.clearButtonText, { color: colors.text, ...typography.body }]}>
                Clear
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, { 
                backgroundColor: colors.primary, 
                borderRadius: borderRadius.md,
                ...shadows.medium 
              }]}
              onPress={saveHomework}
            >
              <Text style={[styles.saveButtonText, { color: 'white', ...typography.body }]}>
                Save Homework
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}

      {/* Reminder Time Picker Modal */}
      {showReminderPicker && (
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalContent, { 
            backgroundColor: colors.card, 
            borderRadius: borderRadius.lg,
            ...shadows.large 
          }]}>
            <Text style={[styles.modalTitle, { color: colors.text, ...typography.title2 }]}>
              Select Reminder Time
            </Text>
            <ScrollView style={styles.modalScrollView}>
              {reminderOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.modalOption,
                    {
                      backgroundColor: reminderTime === option.key ? colors.primary : 'transparent',
                      borderRadius: borderRadius.sm,
                    }
                  ]}
                  onPress={() => {
                    setReminderTime(option.key);
                    setShowReminderPicker(false);
                  }}
                >
                  <Text style={[
                    styles.modalOptionText,
                    { 
                      color: reminderTime === option.key ? 'white' : colors.text,
                      ...typography.body 
                    }
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[styles.modalCancelButton, { 
                backgroundColor: colors.surface, 
                borderRadius: borderRadius.md 
              }]}
              onPress={() => setShowReminderPicker(false)}
            >
              <Text style={[styles.modalCancelText, { color: colors.text, ...typography.body }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}


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
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    padding: 16,
    fontSize: 17,
  },
  textArea: {
    height: 100,
    borderWidth: 1,
    padding: 16,
    fontSize: 17,
  },
  dateButton: {
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateButtonText: {
    marginLeft: 8,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    borderWidth: 1,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  priorityButtonText: {
    textAlign: 'center',
  },
  reminderCard: {
    marginTop: 24,
    padding: 20,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reminderTitle: {
    flex: 1,
    marginLeft: 8,
  },
  reminderOptions: {
    marginTop: 8,
  },
  reminderLabel: {
    marginBottom: 4,
  },
  reminderButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  reminderButtonText: {
    flex: 1,
    marginRight: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  clearButton: {
    flex: 1,
    borderWidth: 1,
    padding: 16,
    marginRight: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    textAlign: 'center',
  },
  saveButton: {
    flex: 2,
    padding: 16,
    marginLeft: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    textAlign: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalContent: {
    width: '80%',
    padding: 20,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  modalScrollView: {
    maxHeight: 200,
  },
  modalOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalOptionText: {
    textAlign: 'center',
  },
  modalCancelButton: {
    marginTop: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  modalCancelText: {
    textAlign: 'center',
  },

});
