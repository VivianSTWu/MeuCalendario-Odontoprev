// components/authWrapper.tsx
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  children: React.ReactNode;
};

const AuthWrapper = ({ children }: Props) => {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    const verificarLogin = async () => {
      const usuario = await AsyncStorage.getItem('usuario');
      if (!usuario) {
        router.replace('/login');
      } else {
        setAutenticado(true);
      }
      setCarregando(false);
    };
    verificarLogin();
  }, []);

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return <>{autenticado ? children : null}</>;
};

export default AuthWrapper;
