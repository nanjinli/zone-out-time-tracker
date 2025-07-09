import { useTimer } from '@/contexts/TimerContext';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
// We have removed the `useEffect` hook that was causing the problems.

export default function TimerScreen() {
  const router = useRouter();
  const { currentTimer, resumeTimer, pauseTimer } = useTimer();

  // If the screen somehow opens without a timer, we render nothing.
  // This is a safeguard, but shouldn't happen in the normal flow.
  if (!currentTimer) {
    return null;
  }

  const handlePauseResume = () => {
    if (currentTimer.isRunning) {
      pauseTimer();
    } else {
      resumeTimer();
    }
  };

  const handleStop = () => {
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
      <View><Text style={styles.timerText}>{formatTime(currentTimer.time)}</Text></View>
      <View style={styles.controlsContainer}>
        <Pressable onPress={handlePauseResume}>
          <FontAwesome5 name={currentTimer.isRunning ? "pause-circle" : "play-circle"} size={70} color="#4A4A4A" solid />
        </Pressable>
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
  controlsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '70%' },
});