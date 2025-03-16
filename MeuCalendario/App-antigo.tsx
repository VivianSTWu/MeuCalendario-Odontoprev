import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headertext}>Meu Calendário</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.bodyText}>Para usar esta ferramenta, precisamos que você nos informe algumas coisinhas, tudo bem?</Text>
        <Text style={styles.bodyText}>Você só vai precisar preencher isto uma vez.</Text>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    backgroundColor: '#255ecf',
    width: '100%',
    height: '15%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  headertext: {
    color: 'white',
    fontSize: 20,
  },
  bodyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  body: {
    width: '80%',
    height: '60%',
  },
});
