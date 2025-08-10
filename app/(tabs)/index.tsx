import { useTimer } from '@/contexts/TimerContext';
import { auth } from '@/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Menu, Modal, Paragraph, Portal, TextInput, Title } from 'react-native-paper';

const activities = [
  { title: '摸鱼 🐟', description: '今日宜划水, 宜摸鱼, 宜数钱' },
  { title: '开会 💻', description: '听不下去了? 数数钱可能会开心点' },
  { title: '拉屎 💩', description: '听说带薪拉屎是天底下最爽的事情!' },
];

export default function HomeScreen() {
  const username = "nanjinjin";
  const router = useRouter();
  const { selectActivity, hourlyRate, getTotalEarnings, setHourlyRate } = useTimer();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [tempRate, setTempRate] = useState(hourlyRate.toString());
  const [menuVisible, setMenuVisible] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState<string>('');

  // Fun welcoming messages for daily use
  const welcomingMessages = [
    "嗨{username}, 今天又是活力满满的一天呢",
    "欢迎回来{username}, 摸鱼时间到！🐟",
    "嘿{username}, 准备好赚今天的摸鱼钱了吗？💰",
    "又见面了{username}, 今天也要开开心心地摸鱼哦～",
    "嗨{username}, 摸鱼使我快乐，摸鱼使我进步！",
    "欢迎{username}, 今天也要做最快乐的摸鱼人！",
    "嗨{username}, 摸鱼一时爽，一直摸鱼一直爽！",
    "又回来了{username}, 摸鱼是门艺术，你是艺术家！🎨",
    "欢迎{username}, 今天也要摸出新高度！",
    "嗨{username}, 摸鱼使我充满活力！⚡",
    "又见面了{username}, 摸鱼是人生必修课！📚",
    "欢迎{username}, 今天也要摸鱼摸到爽！",
    "嗨{username}, 摸鱼使我心情愉悦～",
    "又回来了{username}, 摸鱼是种生活态度！",
    "欢迎{username}, 摸鱼使我更有创造力！💡",
    "嗨{username}, 摸鱼是种享受！",
    "又见面了{username}, 摸鱼使我更懂得生活！",
    "欢迎{username}, 摸鱼是种智慧！🧠",
    "嗨{username}, 摸鱼使我更快乐！",
    "又回来了{username}, 摸鱼是种艺术！",
    "欢迎{username}, 摸鱼使我更放松！😌",
    "嗨{username}, 摸鱼是种享受！",
    "又见面了{username}, 摸鱼使我更有灵感！✨",
    "欢迎{username}, 摸鱼是种生活哲学！",
    "嗨{username}, 摸鱼使我更懂得珍惜时间！⏰",
    "又回来了{username}, 摸鱼是种生活美学！",
    "欢迎{username}, 摸鱼使我更懂得平衡！⚖️",
    "嗨{username}, 摸鱼是种生活智慧！",
    "又见面了{username}, 摸鱼使我更懂得享受！",
    "欢迎{username}, 摸鱼是种生活艺术！",
    "嗨{username}, 摸鱼使我更懂得生活！",
    "又回来了{username}, 摸鱼是种生活态度！",
    "欢迎{username}, 摸鱼使我更懂得快乐！😊"
  ];

  // Get a random welcoming message
  const getRandomWelcomeMessage = () => {
    const randomIndex = Math.floor(Math.random() * welcomingMessages.length);
    return welcomingMessages[randomIndex].replace('{username}', username);
  };

  // Set welcome message only when component mounts (user re-enters the app)
  useEffect(() => {
    setWelcomeMessage(getRandomWelcomeMessage());
  }, []); // Empty dependency array means this only runs once when component mounts

  // Guard: don't render until hourlyRate is available
  if (hourlyRate === undefined) {
    return null; // or a loading spinner
  }

  const handlePressActivity = (activityTitle: string) => {
    // Prevent multiple rapid presses
    if (isNavigating) return;
    
    setIsNavigating(true);
    selectActivity(activityTitle); // This just prepares the timer, doesn't start it
    router.push('/timer');
    
    // Reset navigation state after a short delay
    setTimeout(() => {
      setIsNavigating(false);
    }, 1000);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMenuVisible(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleEditRate = () => {
    setTempRate(hourlyRate.toString());
    setEditModalVisible(true);
  };

  const handleSaveRate = () => {
    const newRate = parseFloat(tempRate);
    if (!isNaN(newRate) && newRate > 0) {
      setHourlyRate(newRate);
      setEditModalVisible(false);
    }
  };

  const formatMoney = (amount: number) => {
    return `¥${amount.toFixed(2)}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://raw.githubusercontent.com/nanjinli/Zone-Out-Time-Tracker/main/assets/images/avatar.png' }}
          style={styles.profilePic}
        />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Pressable onPress={() => setMenuVisible(true)} style={styles.menuAnchor}>
              <Ionicons name="settings-outline" size={24} color="black" />
            </Pressable>
          }
          contentStyle={styles.menuContent}
        >
          <Menu.Item 
            onPress={handleLogout} 
            title="退出登录" 
            leadingIcon="logout"
          />
        </Menu>
      </View>
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>{welcomeMessage}</Text>
        <View style={styles.earningsContainer}>
          <Text style={styles.earningsLabel}>今日已赚取</Text>
          <Text style={styles.earningsAmount}>{formatMoney(getTotalEarnings())}</Text>
          <View style={styles.rateContainer}>
            <Text style={styles.hourlyRateText}>时薪: {formatMoney(hourlyRate)}/小时</Text>
            <Pressable onPress={handleEditRate} style={styles.editButton}>
              <Ionicons name="pencil" size={16} color="#007AFF" />
            </Pressable>
          </View>
        </View>
      </View>
      {activities.map((activity) => (
        <Card 
          key={activity.title} 
          onPress={() => handlePressActivity(activity.title)} 
          style={[styles.card, isNavigating && styles.cardDisabled]}
          disabled={isNavigating}
        >
          <Card.Content>
            <Title style={styles.cardTitle}>{activity.title}</Title>
            <Paragraph style={styles.cardParagraph}>{activity.description}</Paragraph>
          </Card.Content>
        </Card>
      ))}

      <Portal>
        <Modal
          visible={editModalVisible}
          onDismiss={() => setEditModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>更新时薪</Text>
            <Text style={styles.modalDescription}>
              设置你的时薪，这样我们就能准确计算你的"摸鱼"收入了 💰
            </Text>
            
            <TextInput
              value={tempRate}
              onChangeText={setTempRate}
              style={styles.modalInput}
              mode="outlined"
              keyboardType="numeric"
              placeholder="例如: 100"
              label="时薪 (元/小时)"
            />
            
            <View style={styles.modalButtons}>
              <Button 
                mode="outlined" 
                onPress={() => setEditModalVisible(false)} 
                style={styles.cancelButton}
              >
                取消
              </Button>
              <Button 
                mode="contained" 
                onPress={handleSaveRate} 
                style={styles.saveButton}
              >
                保存
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 60, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  profilePic: { width: 50, height: 50, borderRadius: 25 },
  greetingContainer: { marginBottom: 30 },
  greetingText: { fontSize: 24, fontWeight: 'bold', color: '#1C1C1E', marginBottom: 16 },
  earningsContainer: {
    backgroundColor: '#F2F2F7',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  earningsLabel: { fontSize: 14, color: 'gray', marginBottom: 4 },
  earningsAmount: { fontSize: 28, fontWeight: 'bold', color: '#34C759', marginBottom: 4 },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hourlyRateText: { fontSize: 12, color: 'gray' },
  editButton: {
    padding: 4,
  },
  card: { marginBottom: 15, backgroundColor: '#F2F2F7', borderRadius: 20, elevation: 0 },
  cardTitle: { fontSize: 22, fontWeight: 'bold' },
  cardParagraph: { fontSize: 14, color: 'gray', marginTop: 4 },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 0,
  },
  modalContent: {
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalInput: {
    marginBottom: 24,
    backgroundColor: 'white',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#34C759',
  },
  menuAnchor: {
    padding: 4,
  },
  menuContent: {
    marginTop: 32,
    borderRadius: 8,
  },
  cardDisabled: {
    opacity: 0.7,
  },
});