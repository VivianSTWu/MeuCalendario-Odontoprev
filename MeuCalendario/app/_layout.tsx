import { View, Text } from 'react-native'
import React from 'react'

import "../global.css";
import { StatusBar } from 'expo-status-bar';
import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
const RootLayout = () => {
    return (
        <SafeAreaView className='h-full bg-white'>
            <View className='h-28 pb-3 mb-8 flex bg-blue-700 h-20 justify-end items-center'>
                <Text className="color-white text-2xl bg-blue-700">Meu Calendário</Text>
            </View>
            <Slot />
        </SafeAreaView>
    )
}

export default RootLayout;