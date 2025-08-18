import { useTimer } from '@/contexts/TimerContext';
import { auth } from '@/firebaseConfig';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Edit3, LogOut, Settings } from 'react-native-feather';
import { Menu, TextInput } from 'react-native-paper';

const activities = [
  { 
    title: '摸鱼', 
    description: '今日宜划水,宜摸鱼,宜数钱',
    icon: '🐟',
    backgroundColor: '#B7F0FF',
    iconBackground: '#2196F3'
  },
  { 
    title: '开会', 
    description: '听不下去了?数数钱可能会开心点',
    icon: '💻',
    backgroundColor: '#FFC7EA',
    iconBackground: '#9E9E9E'
  },
  { 
    title: '拉屎', 
    description: '听说带薪拉屎是天底下最爽的事情!',
    icon: '💩',
    backgroundColor: '#FFE7A0',
    iconBackground: '#8D6E63'
  },
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
      {/* App Header */}
      <View style={styles.appHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.fishIconContainer}>
            <Text style={styles.fishIcon}>🐟</Text>
          </View>
        </View>
        <Text style={styles.appTitle}>摸鱼时钟</Text>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Pressable onPress={() => setMenuVisible(true)} style={styles.settingsButton}>
              <Settings width={24} height={24} color="#333" />
            </Pressable>
          }
          contentStyle={styles.menuContent}
        >
          <Menu.Item 
            onPress={handleLogout} 
            title="退出登录" 
            leadingIcon={() => <LogOut width={20} height={20} color="#666" />}
          />
        </Menu>
      </View>

      {/* Greeting Section */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>{welcomeMessage}</Text>
      </View>

      {/* Earnings Display */}
      <View style={styles.earningsContainer}>
        <View style={styles.earningsLeft}>
          <Text style={styles.earningsText}>今日已赚 {formatMoney(getTotalEarnings())}</Text>
        </View>
        <View style={styles.earningsRight}>
          <Text style={styles.hourlyRateText}>时薪 {formatMoney(hourlyRate)}/小时</Text>
          <Pressable onPress={handleEditRate} style={styles.editIconContainer}>
            <Edit3 width={16} height={16} color="#666" />
          </Pressable>
        </View>
      </View>

      {/* Activity Cards */}
      {activities.map((activity) => (
        <Pressable 
          key={activity.title} 
          onPress={() => handlePressActivity(activity.title)} 
          style={[
            styles.activityCard, 
            { backgroundColor: activity.backgroundColor },
            isNavigating && styles.cardDisabled
          ]}
          disabled={isNavigating}
        >
          <View style={[styles.iconContainer, { backgroundColor: 'white' }]}>
            <Text style={styles.activityIcon}>{activity.icon}</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{activity.title}</Text>
            <Text style={styles.cardDescription}>{activity.description}</Text>
          </View>
        </Pressable>
      ))}

      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderSpacer} />
                <Text style={styles.modalTitle}>更新时薪</Text>
                <Pressable onPress={() => setEditModalVisible(false)} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </Pressable>
              </View>
              
              <Text style={styles.modalDescription}>
                设置你的时薪,这样我们就能更准备计算你的摸鱼收入了!
              </Text>
              
              <TextInput
                value={tempRate}
                onChangeText={setTempRate}
                style={styles.modalInput}
                mode="outlined"
                keyboardType="numeric"
                placeholder="¥100/小时"
                label=""
                outlineStyle={styles.modalInputOutline}
              />
              
              <Pressable 
                onPress={handleSaveRate} 
                style={styles.saveButton}
              >
                <Text style={styles.saveButtonText}>保存</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingHorizontal: 20, 
    paddingTop: 60, 
    backgroundColor: '#FFFFFF' 
  },
  appHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 30,
    paddingHorizontal: 10
  },
  headerLeft: {
    width: 40,
    alignItems: 'center'
  },
  fishIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center'
  },
  fishIcon: {
    fontSize: 20
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center'
  },
  settingsButton: {
    width: 40,
    alignItems: 'center',
    padding: 8
  },
  greetingContainer: { 
    marginBottom: 6,
    alignItems: 'flex-start'
  },
  greetingText: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#1C1C1E', 
    marginBottom: 16,
    textAlign: 'left'
  },
  smileyEmoji: {
    fontSize: 32
  },
  earningsContainer: {
    backgroundColor: '#F7F2EF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 20,
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 52
  },
  earningsLeft: {
    flex: 1
  },
  earningsText: { 
    fontSize: 16, 
    color: '#333',
    fontWeight: '500'
  },
  earningsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  hourlyRateText: { 
    fontSize: 14, 
    color: '#666',
    fontWeight: '500'
  },
  editIconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  activityCard: { 
    marginBottom: 12, 
    borderRadius: 32, 
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    height: 124
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  activityIcon: {
    fontSize: 24
  },
  cardContent: {
    flex: 1
  },
  cardTitle: { 
    fontSize: 24, 
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8
  },
  cardDescription: { 
    fontSize: 16, 
    color: '#666',
    lineHeight: 22
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 32,
    padding: 0,
    width: '75%',
    maxHeight: '55%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  modalContent: {
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  modalHeaderSpacer: {
    width: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  modalDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
    width: '100%',
  },
  modalInput: {
    marginBottom: 24,
    backgroundColor: '#F7F2EF',
    width: '100%',
    height: 50,
    alignSelf: 'center',
  },
  modalInputOutline: {
    borderRadius: 16,
    borderColor: 'transparent',
  },
  saveButton: {
    backgroundColor: '#29251D',
    borderRadius: 100,
    height: 54,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
    textAlignVertical: 'center',
  },
  menuContent: {
    marginTop: 40,
    borderRadius: 20,
    backgroundColor: '#F7F2EF',
    elevation: 0,
    shadowOpacity: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
  },
  cardDisabled: {
    opacity: 0.7,
  },
});