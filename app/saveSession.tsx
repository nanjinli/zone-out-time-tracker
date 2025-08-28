import { useTimer } from '@/contexts/TimerContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { Button } from 'react-native-paper';

export default function SaveSessionScreen() {
  const router = useRouter();
  const { currentTimer, saveSession, calculateEarnings } = useTimer();

  // Get activity-specific styling
  const getActivityStyle = () => {
    if (!currentTimer) return null;
    
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

  const activityStyle = getActivityStyle();
  if (!activityStyle) return null;

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
    <LinearGradient
      colors={activityStyle.gradientColors}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header Section - Same as Timer Page */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Text style={styles.activityIcon}>{activityStyle.icon}</Text>
            </View>
            <Text style={styles.activityName}>{activityStyle.name}</Text>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.label}>这段美好的摸鱼时光叫:</Text>
            <TextInput 
              value={name} 
              onChangeText={setName} 
              style={styles.input}
              placeholder="给这段时光起个名字"
              placeholderTextColor="#999"
            />
            <Text style={styles.label}>一句话记录心情:</Text>
            <TextInput 
              value={notes} 
              onChangeText={setNotes} 
              style={styles.inputMulti} 
              multiline 
              placeholder="记录一下此刻的心情..."
              placeholderTextColor="#999"
              textAlignVertical="top"
            />
            <Button mode="contained" onPress={handleSave} style={styles.saveButton} labelStyle={styles.saveButtonText}>记录</Button>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
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
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  label: { 
    fontSize: 16, 
    color: '#333', 
    marginBottom: 12,
    fontWeight: '500',
  },
  input: { 
    marginBottom: 20, 
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  inputMulti: { 
    marginBottom: 30, 
    minHeight: 100, 
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
  },
  saveButton: { 
    paddingVertical: 8, 
    backgroundColor: '#29251D', 
    borderRadius: 100,
    height: 54,
  },
  saveButtonText: { 
    fontSize: 18, 
    color: 'white', 
    fontWeight: 'bold' 
  },
});