import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

// Import screens
import HomeScreen from './screens/HomeScreen';
import AddHomeworkScreen from './screens/AddHomeworkScreen';
import HomeworkListScreen from './screens/HomeworkListScreen';
import StatusScreen from './screens/StatusScreen';
import SettingsScreen from './screens/SettingsScreen';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { colors, isDarkMode, spacing, borderRadius, shadows } = useTheme();
  
  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Add') {
              iconName = focused ? 'add' : 'add';
            } else if (route.name === 'List') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'Status') {
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 80,
            paddingTop: 8,
            paddingBottom: 20,
            paddingHorizontal: 20,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerStyle: {
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
            borderBottomWidth: 1,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            color: colors.text,
            fontWeight: 'bold',
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: 4,
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons 
                name={focused ? 'home' : 'home-outline'} 
                size={24} 
                color={color} 
              />
            ),
          }}
        />
        <Tab.Screen 
          name="List" 
          component={HomeworkListScreen}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons 
                name={focused ? 'list' : 'list-outline'} 
                size={24} 
                color={color} 
              />
            ),
          }}
        />
        <Tab.Screen 
          name="Add" 
          component={AddHomeworkScreen}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <View style={[
                styles.centerButton,
                {
                  backgroundColor: colors.primary,
                  borderRadius: borderRadius.full,
                  ...shadows.medium,
                }
              ]}>
                <Ionicons 
                  name="add" 
                  size={28} 
                  color="white" 
                />
              </View>
            ),
            tabBarLabel: () => null,
          }}
        />
        <Tab.Screen 
          name="Status" 
          component={StatusScreen}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons 
                name={focused ? 'stats-chart' : 'stats-chart-outline'} 
                size={24} 
                color={color} 
              />
            ),
          }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons 
                name={focused ? 'settings' : 'settings-outline'} 
                size={24} 
                color={color} 
              />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  centerButton: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
  },
});

export default function App() {
  useEffect(() => {
    // Request notification permissions when app starts
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      console.log('Notification permission status:', status);
    };
    
    requestPermissions();
  }, []);

  return (
    <ThemeProvider>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}
