import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppOdonto = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace('/login');
  };

  const verificarFormulario = async () => {
    try {
      const userData = await AsyncStorage.getItem('usuario');
      const parsed = userData ? JSON.parse(userData) : null;

      console.log("Dados do usuário:", parsed);

      if (!parsed || parsed.form === undefined) {
        Alert.alert("Erro", "Sessão inválida. Faça login novamente.");
        router.replace('/login');
        return;
      }

      if (parsed.form === true) {
        console.log("Form preenchido, redirecionando para /calendario");
        router.push('/calendario');
      } else {
        console.log("Form não preenchido, redirecionando para /intro");
        router.push('/intro');
      }
    } catch (error) {
      console.error("Erro ao verificar formulário:", error);
      Alert.alert("Erro", "Não foi possível verificar o status do formulário.");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Aplicativo da Odontoprev</Text>

      <TouchableOpacity style={styles.button} onPress={verificarFormulario}>
        <Text style={styles.buttonText}>Meu Calendário</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout}>
        <Text style={{ color: 'red' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AppOdonto;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 150,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 60,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
    width: '50%',
    height: '20%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
