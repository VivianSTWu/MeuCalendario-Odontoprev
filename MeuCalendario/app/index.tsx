import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';


const Index = () => {
    return (
        <View className='flex container px-6 justify-end items-center'>
            <View>
                <Text className='pb-6 text-xl text-center mt-5'>Para usar esta ferramenta, precisamos que você nos informe algumas coisinhas, tudo bem?</Text>
                <Text className='pb-6 text-xl text-center'>Você só vai precisar preencher isto uma vez.</Text>
            </View>
            <Link href={"/form-inicial"} asChild>
                <TouchableOpacity className='flex bg-blue-700 py-4 px-4 rounded-md w-auto justify-end items-center mt-8' onPress={() => { }}>
                    <Text className='color-white text-xl'>Vamos lá!</Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
};

export default Index