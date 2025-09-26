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

export default function PomodoroScreen({ navigation }) {
  const { colors, typography, spacing, borderRadius, shadows } = useTheme();
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  
  const progressValue = useRef(new Animated.Value(0)).current;

  // Pomodoro settings
  const pomodoroWorkTime = 25 * 60; // 25 minutes
  const pomodoroBreakTime = 5 * 60; // 5 minutes
  const pomodoroLongBreakTime = 15 * 60; // 15 minutes
  const pomodorosBeforeLongBreak = 4;

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            handleTimerComplete();
            return timeLeft;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  useEffect(() => {
    if (isTimerRunning) {
      const currentTime = isBreakTime ? 
        (pomodoroCount === 0 ? pomodoroLongBreakTime : pomodoroBreakTime) : 
        pomodoroWorkTime;
      const progress = 1 - (timeLeft / currentTime);
      Animated.timing(progressValue, {
        toValue: progress,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [timeLeft, isTimerRunning, isBreakTime, pomodoroCount]);

  const handleTimerComplete = () => {
    setIsTimerRunning(false);
    
    if (!isBreakTime) {
      // Work session completed
      setCompletedPomodoros(prev => prev + 1);
      setPomodoroCount(prev => prev + 1);
      
      // Check if it's time for a long break
      if (pomodoroCount + 1 >= pomodorosBeforeLongBreak) {
        setTimeLeft(pomodoroLongBreakTime);
        setIsBreakTime(true);
        setPomodoroCount(0); // Reset for next cycle
      } else {
        // Regular break
        setTimeLeft(pomodoroBreakTime);
        setIsBreakTime(true);
      }
    } else {
      // Break completed, start next work session
      setTimeLeft(pomodoroWorkTime);
      setIsBreakTime(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsSetupMode(false);
    setIsTimerRunning(true);
    setTimeLeft(pomodoroWorkTime);
    setIsBreakTime(false);
    progressValue.setValue(0);
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
    setIsBreakTime(false);
    setPomodoroCount(0);
    setTimeLeft(pomodoroWorkTime);
    progressValue.setValue(0);
  };

  const skipBreak = () => {
    if (isBreakTime) {
      setTimeLeft(pomodoroWorkTime);
      setIsBreakTime(false);
      setIsTimerRunning(false);
    }
  };

  const TimerDisplay = () => {
    const currentTime = isBreakTime ? 
      (pomodoroCount === 0 ? pomodoroLongBreakTime : pomodoroBreakTime) : 
      pomodoroWorkTime;
    const progress = 1 - (timeLeft / currentTime);
    const isLongBreak = isBreakTime && pomodoroCount === 0 && completedPomodoros > 0;

    return (
      <View style={styles.timerContainer}>
        <View style={styles.timerCircle}>
          {/* Progress ring */}
          <View style={styles.progressRing}>
            <Animated.View
              style={[
                styles.progressArc,
                {
                  borderColor: isBreakTime ? colors.success : colors.primary,
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
              {isBreakTime ? (isLongBreak ? 'Long Break' : 'Short Break') : 'Focus Time'}
            </Text>
            <Text style={[
              styles.timerText,
              { color: colors.text }
            ]}>
              {formatTime(timeLeft)}
            </Text>
            <Text style={[styles.pomodoroCount, { color: colors.textSecondary }]}>
              {isBreakTime ? `Session ${completedPomodoros}` : `Session ${completedPomodoros + 1}`}
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
            Pomodoro Timer
          </Text>
          <View style={styles.placeholder} />
        </View>

        {isSetupMode ? (
          <>
            {/* Setup Screen */}
            <View style={styles.setupContainer}>
              <Text style={[styles.setupTitle, { color: colors.text }]}>
                Pomodoro Technique
              </Text>
              <Text style={[styles.setupSubtitle, { color: colors.textSecondary }]}>
                25 minutes of focused work, followed by 5-minute breaks
              </Text>
              
              {/* Pomodoro Info */}
              <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                  <Ionicons name="timer-outline" size={20} color={colors.primary} />
                  <Text style={[styles.infoText, { color: colors.text }]}>
                    Work Session: 25 minutes
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="cafe-outline" size={20} color={colors.success} />
                  <Text style={[styles.infoText, { color: colors.text }]}>
                    Short Break: 5 minutes
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="bed-outline" size={20} color={colors.warning} />
                  <Text style={[styles.infoText, { color: colors.text }]}>
                    Long Break: 15 minutes (after 4 sessions)
                  </Text>
                </View>
              </View>

              {/* Stats */}
              {completedPomodoros > 0 && (
                <View style={styles.statsContainer}>
                  <Text style={[styles.statsTitle, { color: colors.text }]}>
                    Today's Progress
                  </Text>
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Text style={[styles.statNumber, { color: colors.primary }]}>
                        {completedPomodoros}
                      </Text>
                      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                        Completed
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={[styles.statNumber, { color: colors.success }]}>
                        {Math.floor(completedPomodoros * 25 / 60)}
                      </Text>
                      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                        Hours Focused
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              
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

                {/* Skip Break Button (only show during breaks) */}
                {isBreakTime && (
                  <TouchableOpacity
                    style={[
                      styles.controlButton,
                      {
                        backgroundColor: colors.surface,
                        borderRadius: borderRadius.full,
                        ...shadows.medium,
                      }
                    ]}
                    onPress={skipBreak}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="skip-forward" size={24} color={colors.text} />
                  </TouchableOpacity>
                )}
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
    marginBottom: 40,
  },
  infoContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  statsContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
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
  pomodoroCount: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
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
