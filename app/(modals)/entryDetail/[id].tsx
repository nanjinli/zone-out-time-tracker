import { useTimer } from '@/contexts/TimerContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EntryDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { completedSessions, selectActivity } = useTimer();
  const entry = completedSessions.find(e => e.id === id);

  if (!entry) {
    return <View style={styles.container}><Text>记录未找到</Text></View>;
  }

  // Get activity style with gradient colors and emoji
  const getActivityStyle = (activity: string) => {
    switch (activity) {
      case '摸鱼':
        return {
          gradientColors: ['#D6F6FF', '#FFFFFF'] as const,
          icon: '🐟',
        };
      case '开会':
        return {
          gradientColors: ['#FFE0F4', '#FFFFFF'] as const,
          icon: '💻',
        };
      case '拉屎':
        return {
          gradientColors: ['#FFF5D6', '#FFFFFF'] as const,
          icon: '💩',
        };
      default:
        return {
          gradientColors: ['#D6F6FF', '#FFFFFF'] as const,
          icon: '🐟',
        };
    }
  };

  const activityStyle = getActivityStyle(entry.activity);
  const emoji = activityStyle.icon;
  // Time string - use 24-hour format only
  const dateObj = new Date(entry.date);
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={async () => {
                const url = `https://yourapp.com/record/${id}`;
                await Share.share({
                  message: `看看我刚刚又摸鱼赚了钱！详情见：${url}`,
                  url,
                  title: '分享我的摸鱼记录',
                });
              }}
              style={{ marginRight: 16 }}
            >
              <Ionicons name="share-social-outline" size={24} color="#111" />
            </TouchableOpacity>
          ),
          headerTitle: '',
          headerTransparent: true,
        }}
      />
      <LinearGradient
        colors={activityStyle.gradientColors}
        style={styles.container}
      >
        <View style={{ height: 32 }} />
        {/* Header with emoji and title */}
        <View style={styles.header}>
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{emoji}</Text>
          </View>
          <Text style={styles.headerTitle}>{entry.name}</Text>
        </View>
        
        {/* Content without grey box - left aligned */}
        <View style={styles.content}>
          <Text style={styles.congratsText}>恭喜你赚了</Text>
          <Text style={styles.earnedAmount}>{entry.earnings.toFixed(2)} RMB</Text>
          <Text style={styles.durationLabel}>你的摸鱼时长为</Text>
          <Text style={styles.durationText}>{entry.duration < 60 ? `${entry.duration}秒` : `${Math.round(entry.duration / 60)}分钟`}</Text>
          <Text style={styles.moodLabel}>你的心情是</Text>
          <View style={styles.moodBox}>
            <Text style={styles.moodText}>{entry.notes || '摸鱼还能不高兴么？又赚到了！'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.earnBtn} onPress={() => {
          selectActivity(entry.activity);
          router.push('/timer');
        }}>
          <Text style={styles.earnBtnText}>再赚一笔</Text>
        </TouchableOpacity>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 32,
    paddingHorizontal: 8,
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
  emoji: { fontSize: 24 },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '500', 
    color: '#333',
    flex: 1,
  },
  content: { 
    paddingHorizontal: 8,
  },
  congratsText: { 
    fontSize: 16, 
    color: '#000000', 
    marginBottom: 8,
    textAlign: 'left',
  },
  earnedAmount: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 20,
    textAlign: 'left',
  },
  durationLabel: { 
    fontSize: 16, 
    color: '#000000', 
    marginBottom: 8,
    textAlign: 'left',
  },
  durationText: { 
    fontSize: 24, 
    fontWeight: '600', 
    color: '#333', 
    marginBottom: 20,
    textAlign: 'left',
  },
  moodLabel: { 
    fontSize: 16, 
    color: '#000000', 
    marginBottom: 8,
    textAlign: 'left',
  },
  moodBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 52,
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'flex-start',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  moodText: { 
    fontSize: 16, 
    color: '#333', 
    textAlign: 'left',
    lineHeight: 22,
  },
  earnBtn: { 
    backgroundColor: '#333', 
    borderRadius: 32, 
    paddingVertical: 16, 
    alignItems: 'center', 
    marginTop: 44,
    alignSelf: 'stretch',
  },
  earnBtnText: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
}); 