import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const MONEY_EMOJIS = ['💸', '💸', '💸', '💸', '💸'];

export default function SuccessModal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { activity, earned } = params;
  const earnedAmount = typeof earned === 'string' ? parseFloat(earned) : 0;
  const activityName = typeof activity === 'string' ? activity.split(' ')[0] : 'zoning out';

  // Overlay fade-in animation
  const overlayOpacity = useSharedValue(0);
  useEffect(() => {
    overlayOpacity.value = withTiming(1, { duration: 250 });
  }, []);
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  // Money drop animation
  const moneyDrops = MONEY_EMOJIS.map((emoji, i) => {
    const drop = useSharedValue(-100);
    useEffect(() => {
      drop.value = withDelay(i * 120, withTiming(SCREEN_HEIGHT * 0.22 + Math.random() * 30, { duration: 700, easing: Easing.out(Easing.cubic) }));
    }, []);
    const style = useAnimatedStyle(() => ({
      position: 'absolute',
      top: drop.value,
      left: SCREEN_WIDTH * 0.25 + i * 30 + Math.random() * 20,
      fontSize: 40 + Math.random() * 10,
      zIndex: 2,
    }));
    return (
      <Animated.Text key={i} style={style}>{emoji}</Animated.Text>
    );
  });

  const handleDismiss = () => {
    router.dismiss();
  };

  return (
    <Animated.View style={[styles.container, overlayStyle]}>
      {moneyDrops}
      <View style={styles.modalContent}>
        <Pressable style={styles.closeButton} onPress={handleDismiss}>
            <Ionicons name="close" size={24} color="gray" />
        </Pressable>
        <View style={styles.iconContainer}>
            <Text style={styles.moneyBag}>💰</Text>
        </View>
        <Text style={styles.title}>你赚了{earnedAmount}元!</Text>
        <Text style={styles.subtitle}>
            呦嘿, 你刚才{activityName}净赚了{earnedAmount}元! 继续加油吧, 打工仔!
        </Text>
        <Button mode="contained" onPress={handleDismiss} style={styles.confirmButton} labelStyle={styles.confirmButtonText}>
            好的, 我会再接再厉的!
        </Button>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
    zIndex: 10,
  },
  iconContainer: {
    marginTop: -70,
    marginBottom: 10,
  },
  moneyBag: {
    fontSize: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
    marginBottom: 24,
    lineHeight: 22,
  },
  confirmButton: {
    width: '100%',
    paddingVertical: 8,
    backgroundColor: 'black',
    borderRadius: 30,
  },
  confirmButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 20,
  },
});