import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { auth } from '../firebaseConfig';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.replace('/');
    } catch (e: any) {
      setError(e.message || '登录/注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Text style={styles.title}>{isLogin ? '登录' : '注册'}</Text>
          <TextInput
            label="邮箱"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
          />
          <TextInput
            label="密码"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
            textContentType="password"
            autoComplete="password"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button
            mode="contained"
            onPress={handleAuth}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            {isLogin ? '登录' : '注册'}
          </Button>
          <Button
            mode="text"
            onPress={() => setIsLogin(!isLogin)}
            style={styles.toggleButton}
            disabled={loading}
          >
            {isLogin ? '没有账号？注册' : '已有账号？登录'}
          </Button>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: '#34C759',
  },
  toggleButton: {
    marginTop: 16,
  },
  error: {
    color: 'red',
    marginBottom: 8,
    textAlign: 'center',
  },
}); 