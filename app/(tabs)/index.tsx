import { useTimer } from '@/contexts/TimerContext';
import { auth } from '@/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { useState } from 'react';
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

  // Guard: don't render until hourlyRate is available
  if (hourlyRate === undefined) {
    return null; // or a loading spinner
  }

  const handlePressActivity = (activityTitle: string) => {
    selectActivity(activityTitle); // This just prepares the timer, doesn't start it
    router.push('/timer');
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
        <Text style={styles.greetingText}>嗨{username}, 今天又是活力满满的一天呢</Text>
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
        <Card key={activity.title} onPress={() => handlePressActivity(activity.title)} style={styles.card}>
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
});