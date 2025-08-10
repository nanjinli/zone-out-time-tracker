import { useTimer } from '@/contexts/TimerContext';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

export default function TimerScreen() {
  const router = useRouter();
  const { currentTimer, resumeTimer, pauseTimer } = useTimer();
  const [buttonScale] = useState(() => new Animated.Value(1));

  // If the screen somehow opens without a timer, we render nothing.
  // This is a safeguard, but shouldn't happen in the normal flow.
  if (!currentTimer) {
    return null;
  }

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
    <View style={styles.container}>
      <Text style={styles.activityTitle}>{currentTimer.activity}</Text>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>
          {formatTime(currentTimer.time)}
        </Text>
        <Text style={styles.timerSubtitle}>seconds</Text>
      </View>
      <View style={styles.controlsContainer}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <Pressable onPress={handlePauseResume}>
            <FontAwesome5 name={currentTimer.isRunning ? "pause-circle" : "play-circle"} size={70} color="#4A4A4A" solid />
          </Pressable>
        </Animated.View>
        <Pressable onPress={handleStop}>
          <FontAwesome5 name="stop-circle" size={70} color="#E53935" solid />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 100 },
  activityTitle: { fontSize: 40, fontWeight: 'bold', textAlign: 'center' },
  timerText: { fontSize: 80, fontVariant: ['tabular-nums'], fontWeight: '200' },
  timerSubtitle: { fontSize: 20, color: '#4A4A4A', marginTop: 5 },
  timerContainer: { alignItems: 'center' },
  controlsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '70%' },
});