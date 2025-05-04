import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppOdonto = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('usuario');
    router.replace('/login');
  };

  const verificarFormulario = async () => {
    // Aqui você simularia a requisição para saber se o formulário já foi preenchido
    const resposta = true; // simulado: `true` ou `false` da API
    if (resposta) {
      router.push('/calendario');
    } else {
      router.push('/form-inicial');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')} // coloque seu logo aqui
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Aplicativo da Odontoprev</Text>

      <TouchableOpacity style={styles.button} onPress={verificarFormulario}>
        <Text style={styles.buttonText}>Meu Calendário</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout}>
        <Text className='text-red-600'>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AppOdonto;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 80,
    marginBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
