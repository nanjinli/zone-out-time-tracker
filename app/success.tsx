import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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

  const handleDismiss = () => {
    router.dismiss();
  };

  return (
    <Animated.View style={[styles.container, overlayStyle]}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <Text style={styles.moneyBag}>💰</Text>
            </View>
          </View>
          
          <Text style={styles.title}>你赚了{earnedAmount.toFixed(2)}元!</Text>
          <Text style={styles.subtitle}>
            呦嘿,你刚才摸鱼净赚这么多!
          </Text>
          <Text style={styles.subtitle2}>
            继续加油吧,打工仔!
          </Text>
          
          <Pressable 
            onPress={handleDismiss} 
            style={styles.confirmButton}
          >
            <Text style={styles.confirmButtonText}>我会再接再厉的!</Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  iconContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F7F2EF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moneyBag: {
    fontSize: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  subtitle2: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 32,
    lineHeight: 22,
  },
  confirmButton: {
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
  confirmButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
    textAlignVertical: 'center',
  },
});