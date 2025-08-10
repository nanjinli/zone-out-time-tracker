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

  // Fun mood suggestions for different "zoning out" activities
  const moodSuggestions = {
    '摸鱼': [
      "摸鱼能不开心吗？😄",
      "鱼，就是越摸越爽！🐟",
      "今天又是摸鱼的一天～",
      "摸鱼使我快乐，摸鱼使我进步！",
      "摸鱼一时爽，一直摸鱼一直爽！",
      "工作？什么工作？我在摸鱼！",
      "摸鱼是门艺术，我是艺术家！🎨",
      "摸鱼摸出新高度！",
      "摸鱼使我充满活力！⚡",
      "摸鱼是人生必修课！📚",
      "摸鱼使我心情愉悦～",
      "摸鱼是种生活态度！",
      "摸鱼使我更有创造力！💡",
      "摸鱼是种享受！",
      "摸鱼使我更懂得生活！",
      "摸鱼是种智慧！🧠",
      "摸鱼使我更快乐！",
      "摸鱼是种艺术！",
      "摸鱼使我更放松！😌",
      "摸鱼是种享受！",
      "摸鱼使我更有灵感！✨",
      "摸鱼是种生活哲学！",
      "摸鱼使我更懂得珍惜时间！⏰",
      "摸鱼是种生活美学！",
      "摸鱼使我更懂得平衡！⚖️",
      "摸鱼是种生活智慧！",
      "摸鱼使我更懂得享受！",
      "摸鱼是种生活艺术！",
      "摸鱼使我更懂得生活！",
      "摸鱼是种生活态度！",
      "摸鱼使我更懂得快乐！😊"
    ],
    '会议': [
      "会议使我成长，会议使我强大！💪",
      "又一场会议，又一段人生感悟～",
      "会议是人生的调味剂！",
      "会议使我更懂得倾听！👂",
      "会议使我更有耐心！",
      "会议使我学会等待的艺术！",
      "会议使我更懂得时间管理！⏰",
      "会议使我更懂得团队合作！🤝",
      "会议使我更懂得沟通技巧！",
      "会议使我更懂得领导力！👑",
      "会议使我更懂得决策力！",
      "会议使我更懂得专注力！",
      "会议使我更懂得表达力！",
      "会议使我更懂得理解力！",
      "会议使我更懂得包容力！",
      "会议使我更懂得执行力！",
      "会议使我更懂得创新力！💡",
      "会议使我更懂得学习力！📚",
      "会议使我更懂得适应力！",
      "会议使我更懂得抗压力！",
      "会议使我更懂得协调力！",
      "会议使我更懂得组织力！",
      "会议使我更懂得规划力！",
      "会议使我更懂得分析力！",
      "会议使我更懂得判断力！",
      "会议使我更懂得洞察力！",
      "会议使我更懂得预见力！",
      "会议使我更懂得应变力！",
      "会议使我更懂得总结力！",
      "会议使我更懂得反思力！",
      "会议使我更懂得成长力！🌱"
    ],
    '厕所': [
      "厕所时间，思考人生！🧘‍♂️",
      "厕所是我最好的思考空间！",
      "厕所使我更懂得独处！",
      "厕所时间，充电时间！🔋",
      "厕所使我更懂得放松！",
      "厕所是我心灵的避风港！",
      "厕所使我更懂得珍惜！",
      "厕所使我更懂得感恩！🙏",
      "厕所使我更懂得反思！",
      "厕所使我更懂得规划！",
      "厕所使我更懂得整理！",
      "厕所使我更懂得清洁！",
      "厕所使我更懂得卫生！",
      "厕所使我更懂得健康！💪",
      "厕所使我更懂得生活！",
      "厕所使我更懂得时间！⏰",
      "厕所使我更懂得空间！",
      "厕所使我更懂得隐私！",
      "厕所使我更懂得尊重！",
      "厕所使我更懂得文明！",
      "厕所使我更懂得环保！🌱",
      "厕所使我更懂得节约！",
      "厕所使我更懂得效率！",
      "厕所使我更懂得专注！",
      "厕所使我更懂得冥想！",
      "厕所使我更懂得静心！",
      "厕所使我更懂得内省！",
      "厕所使我更懂得成长！",
      "厕所使我更懂得成熟！",
      "厕所使我更懂得智慧！🧠",
      "厕所使我更懂得人生！"
    ]
  };

  // Get mood suggestions based on activity type
  const getMoodSuggestions = (activity: string) => {
    if (activity.includes('会议')) return moodSuggestions['会议'];
    if (activity.includes('厕所')) return moodSuggestions['厕所'];
    return moodSuggestions['摸鱼']; // Default to 摸鱼 suggestions
  };

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
  const [notes, setNotes] = useState(() => {
    if (!currentTimer) return '';
    const suggestions = getMoodSuggestions(currentTimer.activity);
    const randomIndex = Math.floor(Math.random() * suggestions.length);
    return suggestions[randomIndex];
  });

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
              <Text style={styles.icon}>{currentTimer.activity.split(' ')[0]}</Text>
            </View>
            <Text style={styles.label}>命名:</Text>
            <TextInput value={name} onChangeText={setName} style={styles.input} mode="outlined" />
            <Text style={styles.label}>一句话记录心情:</Text>
            <TextInput 
              value={notes} 
              onChangeText={setNotes} 
              style={styles.inputMulti} 
              mode="outlined" 
              multiline 
            />
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