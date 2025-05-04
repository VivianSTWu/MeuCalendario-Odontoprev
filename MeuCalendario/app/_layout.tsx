import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import "../global.css";
import { StatusBar } from 'expo-status-bar';
import { Slot, useRouter, useSegments, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';

const RootLayout = () => {
    const router = useRouter();
    const segments = useSegments();
    const pathname = usePathname();

    const isHiddenHeader = pathname === "/login" || pathname === "/appOdonto";
    const isCalendario = pathname === "/calendario";

    return (
        <SafeAreaView className='h-full bg-white'>
            {!isHiddenHeader && (
                <View className='h-28 pb-3 mb-5 flex bg-blue-700 justify-end items-center relative'>
                    <TouchableOpacity
                        className="absolute left-4 bottom-3"
                        onPress={() => {
                            if (isCalendario) {
                                router.replace("/appOdonto");
                            } else {
                                router.back();
                            }
                        }}
                    >
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
