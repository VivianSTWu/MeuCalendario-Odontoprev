import React, { useState, useEffect } from 'react';
import { Modal, Platform, TouchableOpacity, View, Text, ScrollView } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar } from "lucide-react-native"; // Ícone de calendário
import { Link, useRouter } from 'expo-router'; // Importar o hook useRouter

function EditConsulta() {
    const [date, setDate] = useState(new Date());
    const [tempDate, setTempDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const twoYearsLater = new Date();
    twoYearsLater.setFullYear(twoYearsLater.getFullYear() + 2);

    const onChange = (event, selectedDate) => {
        if (Platform.OS === "android") {
            if (selectedDate) setDate(selectedDate);
            setShow(false);
        } else {
            setTempDate(selectedDate || tempDate);
        }
    };

    const confirmDate = () => {
        setDate(tempDate);
        setShow(false);
    };

    return (
        <ScrollView className="flex-1 pl-6 pr-10 bg-white">
            <Text className="form-question">
                Consulta com dentista
            </Text>

            <Text className='font-semibold text-xl ml-2 mt-2'>Data</Text>

            <TouchableOpacity
                onPress={() => setShow(true)}
                className="flex-row items-center justify-between p-2 "
            >
                <View className="flex-row items-center bg-slate-100 w-full p-2">
                    <Calendar size={24} color="black" />
                    <Text className="ml-2 text-lg">{date.toLocaleDateString("pt-BR")}</Text>
                </View>
            </TouchableOpacity>

            <Text className='font-semibold text-xl ml-2 mt-2'>Horário</Text>

            <TouchableOpacity
                onPress={() => setShow(true)}
                className="flex-row items-center justify-between p-2 "
            >
                <View className="flex-row items-center bg-slate-100 w-full p-2">
                    <Text className="ml-2 text-lg"></Text>
                </View>
            </TouchableOpacity>

            <Text className='font-semibold text-xl ml-2 mt-2'>Profissional</Text>

            <TouchableOpacity
                onPress={() => setShow(true)}
                className="flex-row items-center justify-between p-2 "
            >
                <View className="flex-row items-center bg-slate-100 w-full p-2">
                    <Text className="ml-2 text-lg">Dr. Mariana da Silva</Text>
                </View>
            </TouchableOpacity>

            <Text className='font-semibold text-xl ml-2 mt-2'>Local</Text>

            <TouchableOpacity
                onPress={() => setShow(true)}
                className="flex-row items-center justify-between p-2 "
            >
                <View className="flex-row items-center bg-slate-100 w-full p-2">
                    <Text className="ml-2 text-lg">Dr. Mariana da Silva</Text>
                </View>
            </TouchableOpacity>

            {show && Platform.OS === "android" && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChange}
                    maximumDate={new Date()}
                />
            )}

            {show && Platform.OS === "ios" && (
                <Modal transparent={true} animationType="fade">
                    <View className="flex-1 justify-center items-center bg-black/50">
                        <View className="bg-white p-4 rounded-lg">
                            <DateTimePicker
                                value={Platform.OS === "ios" ? tempDate : date}
                                mode="date"
                                display="spinner"
                                onChange={onChange}
                                minimumDate={oneYearAgo}
                                maximumDate={twoYearsLater}
                            />

                            <TouchableOpacity
                                onPress={confirmDate}
                                className="mt-4 p-2 bg-blue-500 rounded-lg"
                            >
                                <Text className="text-white text-center text-lg">OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
            <View className='flex flex-row gap-3 justify-between'>
            <Link href={"/calendario"} asChild>
                <TouchableOpacity className="mt-6 p-4 bg-blue-600 rounded-lg items-center w-1/2">
                    <Text className='color-white text-xl'>Excluir</Text>
                </TouchableOpacity>
            </Link>
            <Link href={"/calendario"} asChild>
                <TouchableOpacity className="mt-6 p-4 bg-blue-600 rounded-lg items-center w-1/2">
                    <Text className='color-white text-xl'>Atualizar</Text>
                </TouchableOpacity>
            </Link>
            </View>
        </ScrollView>
    );
}

export default EditConsulta;
