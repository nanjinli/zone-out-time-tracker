import { TimerProvider } from '@/contexts/TimerContext';
import { auth } from '@/firebaseConfig';
import { Stack, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';

console.log('App layout loaded');
console.log('Firebase config loaded');

function AuthGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('Firebase auth state changed:', firebaseUser ? 'logged in' : 'logged out');
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []); // Remove router from dependencies

  useEffect(() => {
    if (isLoading) return; // Don't navigate while loading

    const inAuthGroup = segments[0] === '(tabs)' || segments[0] === 'timer' || segments[0] === 'saveSession' || segments[0] === 'success';
    const inAuthScreen = segments[0] === 'auth';

    if (!user && !inAuthScreen) {
      // User is not authenticated and not on auth screen, redirect to auth
      console.log('Redirecting to auth screen');
      router.replace('/auth');
    } else if (user && inAuthScreen) {
      // User is authenticated and on auth screen, redirect to home
      console.log('Redirecting to home screen');
      router.replace('/');
    }
  }, [user, isLoading, segments, router]);

  console.log('AuthGate render, user:', user, 'isLoading:', isLoading);
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#34C759" />
      </View>
    );
  }

  // Always render children so /auth can show
  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <PaperProvider>
      <TimerProvider>
        <AuthGate>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="timer" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="saveSession" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="success" options={{ presentation: 'transparentModal', headerShown: false }} />
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="testauth" options={{ headerShown: true }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="(modals)" options={{ headerShown: false, presentation: 'modal' }} />
          </Stack>
        </AuthGate>
      </TimerProvider>
    </PaperProvider>
  );
}