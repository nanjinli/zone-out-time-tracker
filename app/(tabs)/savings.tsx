import { useTimer } from '@/contexts/TimerContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export default function SavingsScreen() {
  const { hourlyRate, getTotalEarnings } = useTimer();
  const [direction, setDirection] = useState<'moneyToHours' | 'hoursToMoney'>('moneyToHours');
  const [money, setMoney] = useState('200');
  const [hours, setHours] = useState(() => (hourlyRate ? (200 / hourlyRate).toFixed(1) : '0'));

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

  // Masked total earnings
  const totalEarnings = getTotalEarnings();
  const maskedEarnings = totalEarnings.toFixed(0).replace(/\d/g, '*');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.earningsTitle}>小金库共{maskedEarnings}元👀</Text>
        <Text style={styles.sectionTitle}>算算其他想买的：</Text>
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
                <Text style={styles.currency}>🇨🇳 人民币 v</Text>
              </View>
              <View style={styles.swapRow}>
                <View style={styles.line} />
                <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
                  <Ionicons name="swap-vertical" size={28} color="#fff" />
                </TouchableOpacity>
                <View style={styles.line} />
              </View>
              <Text style={styles.labelGray}>需要我摸鱼/拉屎/开会</Text>
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
              <Text style={styles.labelGray}>需要我摸鱼/拉屎/开会</Text>
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
                  <Ionicons name="swap-vertical" size={28} color="#fff" />
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
                <Text style={styles.currency}>🇨🇳 人民币 v</Text>
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
    paddingTop: 80,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  earningsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'flex-start',
    marginLeft: 32,
  },
  converterCard: {
    width: '90%',
    backgroundColor: '#f3f3f3',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    marginTop: 8,
  },
  label: {
    fontSize: 16,
    color: '#888',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  labelGray: {
    fontSize: 16,
    color: '#bbb',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  input: {
    flex: 1,
    fontSize: 32,
    fontWeight: 'bold',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#222',
    paddingHorizontal: 16,
    paddingVertical: 8,
    textAlign: 'center',
    // marginRight: 8, // Remove this to make both inputs same width
  },
  currency: {
    fontSize: 16,
    color: '#888',
  },
  unit: {
    fontSize: 16,
    color: '#888',
  },
  swapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
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
    backgroundColor: '#ddd',
  },
});