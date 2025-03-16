import { View, Text } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar';


const Index = () => {
    return (
        <View>
              <View>
                <Text style={{color:"#fff"}}>Meu Calendário</Text>
              </View>
              <View>
                <Text style={{color:"#fff"}}>Para usar esta ferramenta, precisamos que você nos informe algumas coisinhas, tudo bem?</Text>
                <Text>Você só vai precisar preencher isto uma vez.</Text>
              </View>
            <StatusBar style="auto" />
        </View>
    );
};

export default Index