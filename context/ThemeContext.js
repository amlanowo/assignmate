import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('darkMode');
      if (savedTheme !== null) {
        setIsDarkMode(JSON.parse(savedTheme));
      }
    } catch (error) {
      console.log('Error loading theme preference:', error);
    }
  };

  const toggleDarkMode = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await AsyncStorage.setItem('darkMode', JSON.stringify(newMode));
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const theme = {
    isDarkMode,
    toggleDarkMode,
    colors: isDarkMode ? {
      // Dark theme - sophisticated dark colors
      background: '#0A0A0A',
      surface: '#1A1A1A',
      primary: '#007AFF',
      text: '#FFFFFF',
      textSecondary: '#B3B3B3',
      border: '#2A2A2A',
      card: '#1E1E1E',
      success: '#34C759',
      error: '#FF3B30',
      warning: '#FF9500',
      info: '#5AC8FA',
      shadow: 'rgba(0, 0, 0, 0.3)',
      overlay: 'rgba(0, 0, 0, 0.7)',
    } : {
      // Light theme - clean, modern colors matching the image
      background: '#F8F9FA',
      surface: '#FFFFFF',
      primary: '#007AFF',
      text: '#1C1C1E',
      textSecondary: '#8E8E93',
      border: '#E5E5EA',
      card: '#FFFFFF',
      success: '#34C759',
      error: '#FF3B30',
      warning: '#FF9500',
      info: '#5AC8FA',
      shadow: 'rgba(0, 0, 0, 0.08)',
      overlay: 'rgba(0, 0, 0, 0.4)',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    typography: {
      largeTitle: {
        fontSize: 34,
        fontWeight: '700',
        lineHeight: 41,
      },
      title1: {
        fontSize: 28,
        fontWeight: '700',
        lineHeight: 34,
      },
      title2: {
        fontSize: 22,
        fontWeight: '600',
        lineHeight: 28,
      },
      title3: {
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 24,
      },
      headline: {
        fontSize: 17,
        fontWeight: '600',
        lineHeight: 22,
      },
      body: {
        fontSize: 17,
        fontWeight: '400',
        lineHeight: 22,
      },
      callout: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 21,
      },
      subhead: {
        fontSize: 15,
        fontWeight: '400',
        lineHeight: 20,
      },
      footnote: {
        fontSize: 13,
        fontWeight: '400',
        lineHeight: 18,
      },
      caption1: {
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 16,
      },
      caption2: {
        fontSize: 11,
        fontWeight: '400',
        lineHeight: 13,
      },
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    borderRadius: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
      full: 9999,
    },
    shadows: {
      small: {
        shadowColor: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.08)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
      },
      medium: {
        shadowColor: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.08)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 4,
      },
      large: {
        shadowColor: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.08)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 16,
        elevation: 8,
      },
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
