import { useTimer } from '@/contexts/TimerContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Button, TextInput } from 'react-native-paper';

export default function SaveSessionScreen() {
  const router = useRouter();
  const { currentTimer, saveSession, calculateEarnings } = useTimer();

  // This hook safely navigates back if the screen is ever opened without a timer.
  useEffect(() => {
    if (!currentTimer) {
      if (router.canGoBack()) {
        router.back();
      }
    }
  }, [currentTimer]);

  const generateDefaultName = () => {
    if (!currentTimer) return '';
    const date = new Date();
    const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${time} 的 ${currentTimer.activity.split(' ')[0]}`;
  };

  const [name, setName] = useState(generateDefaultName());
  const [notes, setNotes] = useState('');

  if (!currentTimer) {
    return null; // Render nothing while we safely navigate away.
  }

  const handleSave = () => {
    if (!currentTimer) return;

    saveSession({ name, notes, activity: currentTimer.activity, duration: currentTimer.time });

    // Calculate earnings and pass to success screen
    const earnedAmount = calculateEarnings(currentTimer.time);
    router.dismissAll();
    setTimeout(() => {
      router.push({
        pathname: '/success',
        params: { activity: currentTimer.activity, earned: earnedAmount.toString() }
      });
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F2F2F7' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}><Ionicons name="close" size={30} color="black" /></Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{currentTimer.activity.split(' ')[1]}</Text>
            </View>
            <Text style={styles.label}>命名:</Text>
            <TextInput value={name} onChangeText={setName} style={styles.input} mode="outlined" />
            <Text style={styles.label}>一句话记录心情:</Text>
            <TextInput value={notes} onChangeText={setNotes} style={styles.inputMulti} mode="outlined" multiline />
            <Button mode="contained" onPress={handleSave} style={styles.saveButton} labelStyle={styles.saveButtonText}>记录</Button>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, alignItems: 'flex-start' },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  iconContainer: { alignItems: 'center', marginBottom: 30 },
  icon: { fontSize: 50 },
  label: { fontSize: 16, color: 'gray', marginBottom: 8 },
  input: { marginBottom: 20, backgroundColor: 'white' },
  inputMulti: { marginBottom: 30, minHeight: 100, backgroundColor: 'white' },
  saveButton: { paddingVertical: 8, backgroundColor: 'black', borderRadius: 30 },
  saveButtonText: { fontSize: 18, color: 'white', fontWeight: 'bold' },
});