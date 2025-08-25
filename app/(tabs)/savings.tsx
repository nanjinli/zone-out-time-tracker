import { useTimer } from '@/contexts/TimerContext';
import { auth } from '@/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { LogOut, Settings } from 'react-native-feather';
import { Menu } from 'react-native-paper';

export default function SavingsScreen() {
  const { hourlyRate, getTotalEarnings } = useTimer();
  const [direction, setDirection] = useState<'moneyToHours' | 'hoursToMoney'>('moneyToHours');
  const [money, setMoney] = useState('200');
  const [hours, setHours] = useState(() => (hourlyRate ? (200 / hourlyRate).toFixed(1) : '0'));
  const [menuVisible, setMenuVisible] = useState(false);

  // Update default values when hourly rate changes
  useEffect(() => {
    if (hourlyRate && hourlyRate > 0) {
      // Set a reasonable default amount based on hourly rate
      const defaultAmount = Math.round(hourlyRate * 2); // 2 hours worth
      setMoney(defaultAmount.toString());
      setHours((defaultAmount / hourlyRate).toFixed(1));
    }
  }, [hourlyRate]);

  // Update conversion when input or direction changes
  const handleMoneyChange = (val: string) => {
    setMoney(val);
    const num = parseFloat(val);
    if (!isNaN(num) && hourlyRate > 0) {
      setHours((num / hourlyRate).toFixed(1));
    } else {
      setHours('0');
    }
  };
  
  const handleHoursChange = (val: string) => {
    setHours(val);
    const num = parseFloat(val);
    if (!isNaN(num) && hourlyRate > 0) {
      setMoney((num * hourlyRate).toFixed(0));
    } else {
      setMoney('0');
    }
  };
  
  const handleSwap = () => {
    setDirection(d => (d === 'moneyToHours' ? 'hoursToMoney' : 'moneyToHours'));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMenuVisible(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Format total earnings
  const totalEarnings = getTotalEarnings();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/* App Header - Consistent with Home tab */}
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
        <Text style={styles.mainTitle}>欢迎使用摸鱼计算器，算算怎么摸才能最划算吧！</Text>

        {/* Current Savings Display */}
        <View style={styles.savingsDisplay}>
          <Text style={styles.savingsText}>小金库共 ¥{totalEarnings.toFixed(2)}</Text>
        </View>

        {/* Converter Section */}
        <View style={styles.converterCard}>
          {direction === 'moneyToHours' ? (
            <>
              <Text style={styles.label}>我想花</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={money}
                  onChangeText={handleMoneyChange}
                  placeholder="0"
                  placeholderTextColor="#aaa"
                />
                <Text style={styles.currency}>人民币</Text>
              </View>
              <View style={styles.swapRow}>
                <View style={styles.line} />
                <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
                  <Ionicons name="swap-vertical" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.line} />
              </View>
              <Text style={styles.label}>需要我摸鱼/拉屎/开会</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={hours}
                  editable={false}
                />
                <Text style={styles.unit}>小时</Text>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.label}>需要我摸鱼/拉屎/开会</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={hours}
                  onChangeText={handleHoursChange}
                  placeholder="0"
                  placeholderTextColor="#aaa"
                />
                <Text style={styles.unit}>小时</Text>
              </View>
              <View style={styles.swapRow}>
                <View style={styles.line} />
                <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
                  <Ionicons name="swap-vertical" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.line} />
              </View>
              <Text style={styles.label}>我想花</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={money}
                  editable={false}
                />
                <Text style={styles.currency}>人民币</Text>
              </View>
            </>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
  },
  // Header styles - Consistent with Home tab
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
  // Main content styles
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
    marginBottom: 24,
  },
  savingsDisplay: {
    backgroundColor: '#F7F2EF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 20,
    marginBottom: 24,
    alignSelf: 'stretch',
  },
  savingsText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  converterCard: {
    backgroundColor: '#FFE7A0',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 32,
    fontWeight: 'bold',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    textAlign: 'center',
  },
  currency: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  unit: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  swapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    width: '100%',
    justifyContent: 'center',
  },
  swapButton: {
    backgroundColor: '#111',
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#FFFFFF',
  },
});