import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function TimerScreen({ navigation }) {
  const { colors, typography, spacing, borderRadius, shadows } = useTheme();
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedTime, setSelectedTime] = useState(25 * 60); // Default 25 minutes
  
  const progressValue = useRef(new Animated.Value(0)).current;

  // Timer options in minutes
  const timerOptions = [5, 10, 15, 20, 25, 30, 45, 60];

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            setIsTimerRunning(false);
            setIsSetupMode(true);
            setTimeLeft(selectedTime);
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, selectedTime]);

  useEffect(() => {
    if (isTimerRunning) {
      const progress = 1 - (timeLeft / selectedTime);
      Animated.timing(progressValue, {
        toValue: progress,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [timeLeft, isTimerRunning, selectedTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (selectedTime > 0) {
      setIsSetupMode(false);
      setIsTimerRunning(true);
      setTimeLeft(selectedTime);
      progressValue.setValue(0);
    }
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resumeTimer = () => {
    setIsTimerRunning(true);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setIsSetupMode(true);
    setTimeLeft(selectedTime);
    progressValue.setValue(0);
  };

  const selectTime = (minutes) => {
    setSelectedTime(minutes * 60);
    setTimeLeft(minutes * 60);
  };

  const TimerDisplay = () => {
    const progress = 1 - (timeLeft / selectedTime);

    return (
      <View style={styles.timerContainer}>
        <View style={styles.timerCircle}>
          {/* Progress ring */}
          <View style={styles.progressRing}>
            <Animated.View
              style={[
                styles.progressArc,
                {
                  borderColor: colors.primary,
                  transform: [{
                    rotate: progressValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['-90deg', '270deg'],
                    })
                  }]
                }
              ]}
            />
          </View>
          
          {/* Timer content */}
          <View style={styles.timerContent}>
            <Text style={[styles.timerLabel, { color: colors.textSecondary }]}>
              Focus Timer
            </Text>
            <Text style={[
              styles.timerText,
              { color: colors.text }
            ]}>
              {formatTime(timeLeft)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.surface, borderRadius: borderRadius.full }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[typography.title1, { color: colors.text, fontWeight: '600' }]}>
            Focus Timer
          </Text>
          <View style={styles.placeholder} />
        </View>

        {isSetupMode ? (
          <>
            {/* Time Selection */}
            <View style={styles.setupContainer}>
              <Text style={[styles.setupTitle, { color: colors.text }]}>
                Select Duration
              </Text>
              <Text style={[styles.setupSubtitle, { color: colors.textSecondary }]}>
                Choose how long you want to focus
              </Text>
              
              <View style={styles.timeOptionsContainer}>
                {timerOptions.map((minutes) => (
                  <TouchableOpacity
                    key={minutes}
                    style={[
                      styles.timeOption,
                      {
                        backgroundColor: selectedTime === minutes * 60 ? colors.primary : colors.surface,
                        borderRadius: borderRadius.lg,
                        ...shadows.medium,
                      }
                    ]}
                    onPress={() => selectTime(minutes)}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.timeOptionText,
                      {
                        color: selectedTime === minutes * 60 ? 'white' : colors.text,
                        fontWeight: selectedTime === minutes * 60 ? '600' : '500'
                      }
                    ]}>
                      {minutes} min
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Start Button */}
              <TouchableOpacity
                style={[
                  styles.startButton,
                  {
                    backgroundColor: colors.primary,
                    borderRadius: borderRadius.full,
                    ...shadows.medium,
                  }
                ]}
                onPress={startTimer}
                activeOpacity={0.8}
              >
                <Ionicons name="play" size={32} color="white" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* Timer Display */}
            <TimerDisplay />
            
            {/* Timer Controls */}
            <View style={styles.controlsContainer}>
              <View style={styles.controlButtons}>
                <TouchableOpacity
                  style={[
                    styles.controlButton,
                    {
                      backgroundColor: colors.surface,
                      borderRadius: borderRadius.full,
                      ...shadows.medium,
                    }
                  ]}
                  onPress={resetTimer}
                  activeOpacity={0.8}
                >
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.controlButton,
                    {
                      backgroundColor: isTimerRunning ? colors.warning : colors.primary,
                      borderRadius: borderRadius.full,
                      ...shadows.medium,
                    }
                  ]}
                  onPress={isTimerRunning ? pauseTimer : resumeTimer}
                  activeOpacity={0.8}
                >
                  <Ionicons 
                    name={isTimerRunning ? "pause" : "play"} 
                    size={24} 
                    color="white" 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 32,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 44,
  },
  setupContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 60,
  },
  setupTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  setupSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 48,
  },
  timeOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 60,
  },
  timeOption: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  startButton: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  timerCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressRing: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 4,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressArc: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 4,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  timerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerLabel: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: 2,
  },
  controlsContainer: {
    paddingBottom: 40,
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  controlButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

