// app/index.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarLogin = async () => {
      const usuario = await AsyncStorage.getItem('usuario');
      if (usuario) {
        router.replace('/appOdonto');
      } else {
        router.replace('/login');
      }
    };
    verificarLogin();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}
