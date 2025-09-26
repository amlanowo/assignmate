import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

export default function SettingsScreen() {
  const { isDarkMode, toggleDarkMode, colors, typography, spacing, borderRadius, shadows } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [homeworkCount, setHomeworkCount] = useState(0);

  useEffect(() => {
    loadHomeworkCount();
    checkNotificationPermissions();
  }, []);

  const loadHomeworkCount = async () => {
    const data = await Storage.getHomework();
    setHomeworkCount(data.length);
  };

  const checkNotificationPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setNotificationsEnabled(status === 'granted');
  };

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setNotificationsEnabled(status === 'granted');
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please enable notifications in your device settings to receive homework reminders.',
        [{ text: 'OK' }]
      );
    }
  };





  const clearAllHomework = () => {
    Alert.alert(
      'Clear All Homework',
      'Are you sure you want to delete all homework? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await Storage.saveHomework([]);
            Alert.alert('Success', 'All homework has been cleared.');
            loadHomeworkCount();
          },
        },
      ]
    );
  };

  const clearCompletedHomework = () => {
    Alert.alert(
      'Clear Completed Homework',
      'Are you sure you want to delete all completed homework?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Completed',
          style: 'destructive',
          onPress: async () => {
            const data = await Storage.getHomework();
            const updatedHomework = data.filter(h => !h.isCompleted);
            await Storage.saveHomework(updatedHomework);
            Alert.alert('Success', 'All completed homework has been cleared.');
            loadHomeworkCount();
          },
        },
      ]
    );
  };

  const exportData = async () => {
    const data = await Storage.getHomework();
    const dataString = JSON.stringify(data, null, 2);
    Alert.alert(
      'Export Data',
      `Your homework data:\n\n${dataString}`,
      [{ text: 'OK' }]
    );
  };

  const SettingItem = ({ icon, title, subtitle, onPress, showSwitch, switchValue, onSwitchChange }) => (
    <TouchableOpacity 
      style={[
        styles.settingItem, 
        { 
          borderBottomColor: colors.border,
          borderRadius: borderRadius.md,
          ...shadows.small
        }
      ]} 
      onPress={onPress}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color={colors.primary} style={styles.settingIcon} />
        <View style={styles.settingText}>
          <Text style={[typography.headline, { color: colors.text }]}>{title}</Text>
          {subtitle && <Text style={[typography.subhead, { color: colors.textSecondary }]}>{subtitle}</Text>}
        </View>
      </View>
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={switchValue ? '#fff' : '#f4f3f4'}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[typography.largeTitle, { color: colors.text }]}>
              Settings
            </Text>
                         <Text style={[typography.subhead, { color: colors.textSecondary, marginTop: 4 }]}>
               Customize your experience
             </Text>
          </View>

          {/* App Info */}
          <View style={styles.section}>
                         <Text style={[typography.title2, { color: colors.text, marginBottom: 16 }]}>
               App Information
             </Text>
            <View style={[
              styles.infoCard, 
              { 
                backgroundColor: colors.card, 
                borderRadius: borderRadius.md,
                ...shadows.medium
              }
            ]}>
                             <Text style={[typography.body, { color: colors.textSecondary, marginBottom: 8 }]}>
                 Total Homework: {homeworkCount}
               </Text>
              <Text style={[typography.body, { color: colors.textSecondary }]}>
                Version: 1.0.0
              </Text>
            </View>
          </View>

          {/* Preferences */}
          <View style={styles.section}>
                         <Text style={[typography.title2, { color: colors.text, marginBottom: 16 }]}>
               Preferences
             </Text>
            <View style={[
              styles.settingsCard, 
              { 
                backgroundColor: colors.card, 
                borderRadius: borderRadius.md,
                ...shadows.medium
              }
            ]}>
              <SettingItem
                icon="notifications-outline"
                title="Notifications"
                subtitle="Get reminders for due homework"
                showSwitch={true}
                switchValue={notificationsEnabled}
                onSwitchChange={requestNotificationPermissions}
              />


              <SettingItem
                icon="moon-outline"
                title="Dark Mode"
                subtitle="Use dark theme"
                showSwitch={true}
                switchValue={isDarkMode}
                onSwitchChange={toggleDarkMode}
              />
            </View>
          </View>

          {/* Data Management */}
          <View style={styles.section}>
                         <Text style={[typography.title2, { color: colors.text, marginBottom: 16 }]}>
               Data Management
             </Text>
            <View style={[
              styles.settingsCard, 
              { 
                backgroundColor: colors.card, 
                borderRadius: borderRadius.md,
                ...shadows.medium
              }
            ]}>
              <SettingItem
                icon="download-outline"
                title="Export Data"
                subtitle="Export your homework data"
                onPress={exportData}
              />
              <SettingItem
                icon="checkmark-done-outline"
                title="Clear Completed"
                subtitle="Delete all completed homework"
                onPress={clearCompletedHomework}
              />
              <SettingItem
                icon="trash-outline"
                title="Clear All Data"
                subtitle="Delete all homework"
                onPress={clearAllHomework}
              />
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
                         <Text style={[typography.title2, { color: colors.text, marginBottom: 16 }]}>
               About
             </Text>
            <View style={[
              styles.settingsCard, 
              { 
                backgroundColor: colors.card, 
                borderRadius: borderRadius.md,
                ...shadows.medium
              }
            ]}>
              <SettingItem
                icon="information-circle-outline"
                title="About Homework Planner"
                subtitle="Learn more about the app"
                onPress={() => Alert.alert('About', 'Homework Planner v1.0.0\n\nA simple and effective way to manage your homework assignments.')}
              />
              <SettingItem
                icon="star-outline"
                title="Rate App"
                subtitle="Rate us on the app store"
                onPress={() => Alert.alert('Rate App', 'Thank you for using Homework Planner! Please rate us on the app store.')}
              />
            </View>
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
  section: {
    marginBottom: 32,
  },
  infoCard: {
    padding: 20,
  },
  settingsCard: {
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    marginBottom: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
});
