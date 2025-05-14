import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        router.replace('/appOdonto');
      } else {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  const handleLogin = async () => {
  try {
    const response = await axios.post('http://192.168.0.17:8080/auth/login', {
      email: email,
      password: senha,
    });

    const token = response.data;
    await AsyncStorage.setItem('token', token);

    // Requisição para buscar dados do cliente logado
    const clienteResponse = await axios.get(`http://192.168.0.17:8080/clientes`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const clientes = clienteResponse.data;
    const clienteLogado = clientes.find((c) => c.email === email);

    if (!clienteLogado) {
      Alert.alert('Erro', 'Cliente não encontrado após login.');
      return;
    }

    await AsyncStorage.setItem('usuario', JSON.stringify({
      email: clienteLogado.email,
      id_cliente: clienteLogado.id_cliente,
    }));

    router.replace('/appOdonto');
  } catch (error) {
  console.log("Erro ao logar:", error.message); // veja a mensagem principal
  console.log("Detalhes:", error);              // veja todos os detalhes
  Alert.alert('Erro', 'E-mail ou senha inválidos');
}

};


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 32,
    alignSelf: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Login;
