import { useTimer } from '@/contexts/TimerContext';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

export default function TimerScreen() {
  const router = useRouter();
  const { currentTimer, resumeTimer, pauseTimer } = useTimer();
  const [buttonScale] = useState(() => new Animated.Value(1));

  // If the screen somehow opens without a timer, we render nothing.
  // This is a safeguard, but shouldn't happen in the normal flow.
  if (!currentTimer) {
    return null;
  }

  // Get activity-specific styling
  const getActivityStyle = () => {
    switch (currentTimer.activity) {
      case '摸鱼':
        return {
          gradientColors: ['#D6F6FF', '#FFFFFF'] as const,
          icon: '🐟',
          name: '摸鱼'
        };
      case '开会':
        return {
          gradientColors: ['#FFE0F4', '#FFFFFF'] as const,
          icon: '💻',
          name: '开会'
        };
      case '拉屎':
        return {
          gradientColors: ['#FFF5D6', '#FFFFFF'] as const,
          icon: '💩',
          name: '拉屎'
        };
      default:
        return {
          gradientColors: ['#D6F6FF', '#FFFFFF'] as const,
          icon: '🐟',
          name: currentTimer.activity
        };
    }
  };

  const activityStyle = getActivityStyle();

  const handlePauseResume = () => {
    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (currentTimer.isRunning) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      pauseTimer();
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      resumeTimer();
    }
  };

  const handleStop = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    pauseTimer(); // Pause the timer before we navigate
    router.push('/saveSession');
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${secs}`;
  };

  return (
    <LinearGradient
      colors={activityStyle.gradientColors}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.activityIcon}>{activityStyle.icon}</Text>
        </View>
        <Text style={styles.activityName}>{activityStyle.name}</Text>
      </View>

      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>
          {formatTime(currentTimer.time)}
        </Text>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        <View style={styles.buttonGroup}>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <Pressable onPress={handlePauseResume} style={styles.controlButton}>
              <FontAwesome5 
                name={currentTimer.isRunning ? "pause" : "play"} 
                size={24} 
                color="#FFFFFF" 
                solid 
              />
            </Pressable>
          </Animated.View>
          <Text style={styles.buttonLabel}>
            {currentTimer.isRunning ? '暂停' : '开始'}
          </Text>
        </View>

        <View style={styles.buttonGroup}>
          <Pressable onPress={handleStop} style={[styles.controlButton, styles.stopButton]}>
            <FontAwesome5 name="check" size={24} color="#FFFFFF" solid />
          </Pressable>
          <Text style={styles.buttonLabel}>结束</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'transparent',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIcon: {
    fontSize: 24,
  },
  activityName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 72,
    fontVariant: ['tabular-nums'],
    fontWeight: '600',
    color: '#424242',
    // Using system font for now - to use SF Pro Rounded, add the font file to assets/fonts/
    // and load it with expo-font
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 72,
    paddingHorizontal: 40,
  },
  buttonGroup: {
    alignItems: 'center',
    gap: 12,
  },
  controlButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#F46060',
  },
  buttonLabel: {
    fontSize: 16,
    color: '#424242',
    fontWeight: '700',
  },
});