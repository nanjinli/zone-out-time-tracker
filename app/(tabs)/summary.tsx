import { CompletedSession, useTimer } from '@/contexts/TimerContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Button } from 'react-native-paper';

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
  const router = useRouter();

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
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No records yet!</Text>
        <Text style={styles.emptySubText}>Stop a timer to save your first session.</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: CompletedSession }) => {
    // Format earned amount
    const earned = `+${item.earnings.toFixed(2)} RMB`;
    // Format time string (e.g. 上午8点50分)
    const dateObj = new Date(item.date);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const isAM = hours < 12;
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    const timeStr = `${isAM ? '上午' : '下午'}${hour12}点${minutes.toString().padStart(2, '0')}分`;
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
          <Text style={styles.earnedText}>{earned}</Text>
          <Text style={styles.sessionInfo}>
            {timeStr + '的' + item.name} | {durationStr}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Summary</Text>
      <View style={styles.filterRow}>
        <Button mode="outlined" onPress={() => setModalVisible(true)}>
          {selectedYear === 'All' && selectedMonth === 'All'
            ? 'All'
            : `${selectedYear !== 'All' ? selectedYear : ''}${selectedMonth !== 'All' ? '-' + selectedMonth : ''}`}
        </Button>
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
          <Text style={styles.filterTitle}>Filter by Year & Month</Text>
          <View style={styles.pickerContainer}>
            <View style={styles.singlePicker}>
              <Text style={styles.pickerLabel}>Year</Text>
              <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                <TouchableOpacity 
                  style={[styles.pickerOption, selectedYear === 'All' && styles.selectedOption]}
                  onPress={() => setSelectedYear('All')}
                >
                  <Text style={[styles.pickerOptionText, selectedYear === 'All' && styles.selectedOptionText]}>All</Text>
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
              <Text style={styles.pickerLabel}>Month</Text>
              <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                <TouchableOpacity 
                  style={[styles.pickerOption, selectedMonth === 'All' && styles.selectedOption]}
                  onPress={() => setSelectedMonth('All')}
                >
                  <Text style={[styles.pickerOptionText, selectedMonth === 'All' && styles.selectedOptionText]}>All</Text>
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
            Apply
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
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
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
  filterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
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
    color: '#007AFF',
    fontWeight: '600',
  },
  applyButton: {
    marginTop: 16,
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
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#222',
    padding: 24,
    marginBottom: 18,
  },
  earnedText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sessionInfo: {
    fontSize: 14,
    fontWeight: '500',
  },
});