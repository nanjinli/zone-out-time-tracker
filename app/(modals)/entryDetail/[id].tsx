import { useTimer } from '@/contexts/TimerContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EntryDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { completedSessions, selectActivity } = useTimer();
  const entry = completedSessions.find(e => e.id === id);

  if (!entry) {
    return <View style={styles.container}><Text>记录未找到</Text></View>;
  }

  // Emoji: use category mapping
  let emoji = '🐟';
  if (entry.activity.includes('摸鱼')) emoji = '🐟';
  else if (entry.activity.includes('开会')) emoji = '💻';
  else if (entry.activity.includes('拉屎')) emoji = '💩';
  // Time string
  const dateObj = new Date(entry.date);
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const isAM = hours < 12;
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const timeStr = `${isAM ? '上午' : '下午'}${hour12}点${minutes.toString().padStart(2, '0')}分`;

  return (
    <View style={styles.container}>
        <View style={{ height: 32 }} />
        <View style={styles.row}>
          <View style={styles.emojiBox}><Text style={styles.emoji}>{emoji}</Text></View>
          <View style={{ marginLeft: 16 }}>
            <Text style={styles.timeText}>{`${timeStr}的${entry.name}`}</Text>
            <View style={styles.activityTag}><Text style={styles.activityText}>{entry.name}</Text></View>
          </View>
        </View>
        <Text style={styles.label}>我赚了</Text>
        <Text style={styles.earned}>{entry.earnings.toFixed(2)}人民币</Text>
        <Text style={styles.label}>我的心情</Text>
        <View style={styles.moodBox}>
          <TextInput
            style={styles.moodInput}
            value={entry.notes || '摸鱼还能不高兴么？又赚到了！'}
            editable={false}
            multiline
          />
          <Ionicons name="pencil-outline" size={20} color="#bbb" style={styles.editIcon} />
        </View>
        <TouchableOpacity style={styles.earnBtn} onPress={() => {
          selectActivity(entry.activity);
          router.push('/timer');
        }}>
          <Text style={styles.earnBtnText}>再赚一笔</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e5ecef', padding: 24 },
  backBtn: { marginBottom: 16 },
  backText: { fontSize: 18, color: '#222' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  emojiBox: { width: 72, height: 72, borderRadius: 24, backgroundColor: '#dde6ea', alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 40 },
  timeText: { fontSize: 18, fontWeight: '500', marginBottom: 8 },
  activityTag: { backgroundColor: '#dde6ea', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 4, alignSelf: 'flex-start' },
  activityText: { fontSize: 16, color: '#222' },
  label: { fontSize: 18, color: '#222', marginTop: 16, marginBottom: 4 },
  earned: { fontSize: 36, fontWeight: 'bold', color: '#111', marginBottom: 16 },
  moodBox: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginTop: 8, marginBottom: 32, flexDirection: 'row', alignItems: 'center' },
  moodInput: { flex: 1, fontSize: 16, color: '#bbb' },
  editIcon: { marginLeft: 8 },
  earnBtn: { backgroundColor: '#111', borderRadius: 32, paddingVertical: 16, alignItems: 'center', marginTop: 32 },
  earnBtnText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
}); 