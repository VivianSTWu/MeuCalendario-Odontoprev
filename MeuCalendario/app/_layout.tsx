import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import "../global.css";
import { StatusBar } from 'expo-status-bar';
import { Slot, useRouter, useSegments } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';

const RootLayout = () => {
    const router = useRouter();
    const segments = useSegments();

    // Oculta TODO o header em login e appOdonto
    const ocultarHeader = ['login', 'appOdonto'].includes(segments[0] || '');

    return (
        <SafeAreaView className='h-full bg-white'>
            {!ocultarHeader && (
                <View className='h-28 pb-3 mb-5 flex bg-blue-700 justify-end items-center relative'>
                    <TouchableOpacity className="absolute left-4 bottom-3" onPress={() => router.back()}>
                        <ChevronLeft size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-2xl">Meu Calendário</Text>
                </View>
            )}

            <Slot />
        </SafeAreaView>
    );
};

export default RootLayout;
