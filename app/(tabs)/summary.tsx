import { CompletedSession, useTimer } from '@/contexts/TimerContext';
import { auth } from '@/firebaseConfig';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { useState } from 'react';
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { LogOut, Settings } from 'react-native-feather';
import { Button, Menu } from 'react-native-paper';

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  let timeString = '';
  if (hours > 0) timeString += `${hours}h `;
  if (minutes > 0) timeString += `${minutes}m `;
  if (secs > 0 || timeString === '') timeString += `${secs}s`;
  return timeString.trim();
};

// Map activity name to its corresponding emoji
const getActivityEmoji = (activity: string): string => {
  switch (activity) {
    case '摸鱼':
      return '🐟';
    case '开会':
      return '💻';
    case '拉屎':
      return '💩';
    default:
      return '🐟';
  }
};

function getYear(dateStr: string) {
  return new Date(dateStr).getFullYear();
}
function getMonth(dateStr: string) {
  return new Date(dateStr).getMonth() + 1;
}

export default function SummaryScreen() {
  const { completedSessions } = useTimer();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  
  // Debug logging
  console.log('SummaryScreen: completedSessions length:', completedSessions.length);
  console.log('SummaryScreen: completedSessions data:', completedSessions);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMenuVisible(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Get all unique years and months
  const years = Array.from(new Set(completedSessions.map(s => getYear(s.date)))).sort((a, b) => b - a);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // Filter sessions by selected year and month
  const filteredSessions = completedSessions.filter(s => {
    const year = getYear(s.date);
    const month = getMonth(s.date);
    const yearMatch = selectedYear === 'All' || year === Number(selectedYear);
    const monthMatch = selectedMonth === 'All' || month === Number(selectedMonth);
    return yearMatch && monthMatch;
  });

  if (completedSessions.length === 0) {
    return (
      <View style={styles.container}>
        {/* App Header - Consistent with other tabs */}
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
        
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No records yet!</Text>
          <Text style={styles.emptySubText}>Stop a timer to save your first session.</Text>
        </View>
      </View>
    );
  }

  const renderItem = ({ item }: { item: CompletedSession }) => {
    // Format time string - use 24-hour format only (e.g. 14:30)
    const dateObj = new Date(item.date);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    // Format duration: show seconds if < 60, else minutes
    let durationStr = '';
    if (item.duration < 60) {
      durationStr = `${item.duration}秒`;
    } else {
      durationStr = `${Math.round(item.duration / 60)}分钟`;
    }
    return (
              <TouchableOpacity onPress={() => router.push({ pathname: '/(modals)/entryDetail/[id]', params: { id: item.id } })}>
        <View style={styles.summaryCard}>
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{getActivityEmoji(item.activity)}</Text>
          </View>
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionHeader}>
              +{item.earnings.toFixed(2)} RMB | {durationStr}
            </Text>
            <Text style={styles.sessionTitle}>
              {item.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* App Header - Consistent with other tabs */}
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

      {/* Main Title */}
      <Text style={styles.mainTitle}>这是你的所有摸鱼记录</Text>

      <View style={styles.filterRow}>
        <Pressable style={styles.filterButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.filterButtonText}>
            {selectedYear === 'All' && selectedMonth === 'All'
              ? '全部时间'
              : `${selectedYear !== 'All' ? selectedYear + '年' : ''}${selectedMonth !== 'All' ? selectedMonth + '月' : ''}`}
          </Text>
        </Pressable>
      </View>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.pickerSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.filterTitle}>选择时间</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.pickerContainer}>
            <View style={styles.singlePicker}>
              <Text style={styles.pickerLabel}>年份</Text>
              <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                <TouchableOpacity 
                  style={[styles.pickerOption, selectedYear === 'All' && styles.selectedOption]}
                  onPress={() => setSelectedYear('All')}
                >
                  <Text style={[styles.pickerOptionText, selectedYear === 'All' && styles.selectedOptionText]}>全部</Text>
                </TouchableOpacity>
                {years.map(year => (
                  <TouchableOpacity 
                    key={year} 
                    style={[styles.pickerOption, selectedYear === year.toString() && styles.selectedOption]}
                    onPress={() => setSelectedYear(year.toString())}
                  >
                    <Text style={[styles.pickerOptionText, selectedYear === year.toString() && styles.selectedOptionText]}>{year}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.singlePicker}>
              <Text style={styles.pickerLabel}>月份</Text>
              <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                <TouchableOpacity 
                  style={[styles.pickerOption, selectedMonth === 'All' && styles.selectedOption]}
                  onPress={() => setSelectedMonth('All')}
                >
                  <Text style={[styles.pickerOptionText, selectedMonth === 'All' && styles.selectedOptionText]}>全部</Text>
                </TouchableOpacity>
                {months.map(month => (
                  <TouchableOpacity 
                    key={month} 
                    style={[styles.pickerOption, selectedMonth === month.toString() && styles.selectedOption]}
                    onPress={() => setSelectedMonth(month.toString())}
                  >
                    <Text style={[styles.pickerOptionText, selectedMonth === month.toString() && styles.selectedOptionText]}>{month}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
          <Button 
            mode="contained" 
            onPress={() => setModalVisible(false)} 
            style={styles.applyButton}
            contentStyle={styles.applyButtonContent}
          >
            保存
          </Button>
        </View>
      </Modal>
      <FlatList
        data={filteredSessions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
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
    alignItems: 'center',
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
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 20,
    textAlign: 'left',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  filterButton: {
    backgroundColor: '#F7F2EF',
    borderRadius: 32,
    borderWidth: 0,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1,
  },
  pickerSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    zIndex: 2,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: '500',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  singlePicker: {
    flex: 1,
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pickerScroll: {
    maxHeight: 120,
    width: '100%',
  },
  pickerOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 1,
    backgroundColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: 'transparent',
  },
  pickerOptionText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
  },
  selectedOptionText: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  applyButton: {
    marginTop: 16,
    backgroundColor: '#8B4513',
    borderRadius: 24,
  },
  applyButtonContent: {
    height: 48,
  },
  list: {
    paddingHorizontal: 20,
  },
  card: {
    marginBottom: 15,
    backgroundColor: '#F2F2F7',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: 'bold',
  },
  durationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34C759'
  },
  notesText: {
    marginTop: 8,
    color: 'gray',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  emptySubText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 8,
  },
  summaryCard: {
    backgroundColor: '#F7F2EF',
    borderRadius: 32,
    borderWidth: 0,
    padding: 24,
    marginBottom: 12,
    height: 96,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  emoji: {
    fontSize: 24,
  },
  sessionInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  sessionHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    lineHeight: 24,
  },
  sessionTitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});