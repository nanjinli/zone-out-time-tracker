import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { auth } from '../firebaseConfig';

export default function TestAuth() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('TestAuth onAuthStateChanged:', user);
    });
    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Testing Firebase Auth...</Text>
    </View>
  );
} 