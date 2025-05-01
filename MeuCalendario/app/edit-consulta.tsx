import React, { useState } from 'react';
import { Modal, Platform, TouchableOpacity, View, Text, ScrollView, TextInput } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar } from "lucide-react-native";
import { Link } from 'expo-router';

function EditConsulta() {
    const [date, setDate] = useState(new Date());
    const [tempDate, setTempDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [time, setTime] = useState(null);
    const [tempTime, setTempTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [profissional, setProfissional] = useState();
    const [local, setLocal] = useState();

    const onDateChange = (event, selectedDate) => {
        if (selectedDate) {
            setTempDate(selectedDate);
        }
    };

    const onTimeChange = (event, selectedTime) => {
        if (selectedTime) {
            setTempTime(selectedTime);
        }
    };

    const confirmDate = () => {
        setDate(tempDate);
        setShowDatePicker(false);
    };

    const confirmTime = () => {
        setTime(tempTime);
        setShowTimePicker(false);
    };

    return (
        <ScrollView className="flex-1 pl-6 pr-10 bg-white">
            <Text className="title">Consulta com dentista</Text>

            {/* Campo Data */}
            <Text className='font-semibold text-xl ml-2 mt-2'>Data</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} className="flex-row items-center p-2">
                <View className="flex-row items-center bg-slate-100 w-full p-4">
                    <Calendar size={24} color="black" />
                    <Text className="ml-2 text-lg">{date.toLocaleDateString("pt-BR")}</Text>
                </View>
            </TouchableOpacity>

            {/* Campo Horário */}
            <Text className='font-semibold text-xl ml-2 mt-2'>Horário</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)} className="flex-row items-center p-2">
                <View className="flex-row items-center bg-slate-100 w-full p-4">
                    <Text className="ml-2 text-lg">
                        {time ? time.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }) : "12:00"}
                    </Text>
                </View>
            </TouchableOpacity>

            {/* Campo Profissional */}
            <Text className='font-semibold text-xl ml-2 mt-2'>Profissional</Text>
            <TouchableOpacity className="flex-row items-center p-2">
                <View className="bg-slate-100 w-full p-4">
                    <TextInput
                        value={profissional}
                        className="ml-2 text-lg"
                        placeholder="Digite o nome do profissional"
                    />
                </View>
            </TouchableOpacity>

            {/* Campo Local */}
            <Text className='font-semibold text-xl ml-2 mt-2'>Local</Text>
            <TouchableOpacity className="flex-row items-center p-2">
                <View className=" flex bg-slate-100 w-full p-4  justify-center">
                    <TextInput
                        value={local}
                        onChangeText={setLocal}
                        className="ml-2 text-lg align-center"
                        placeholder="Digite o local da consulta"

                    />
                </View>
            </TouchableOpacity>

            {/* DateTimePicker Android */}
            {showDatePicker && Platform.OS === "android" && (
                <DateTimePicker value={date} mode="date" display="default" onChange={(event, selectedDate) => {
                    if (selectedDate) {
                        setDate(selectedDate);
                    }
                    setShowDatePicker(false);
                }} />
            )}

            {showTimePicker && Platform.OS === "android" && (
                <DateTimePicker value={time} mode="time" display="default" onChange={(event, selectedTime) => {
                    if (selectedTime) {
                        setTime(selectedTime);
                    }
                    setShowTimePicker(false);
                }} />
            )}

            {/* DatePicker iOS */}
            {showDatePicker && Platform.OS === "ios" && (
                <Modal transparent={true} animationType="fade">
                    <View className="flex-1 justify-center items-center bg-black/50">
                        <View className="bg-white p-4 rounded-lg">
                            <DateTimePicker value={tempDate} mode="date" display="spinner" onChange={onDateChange} />
                            <TouchableOpacity onPress={confirmDate} className="mt-4 p-4 bg-blue-500 rounded-lg">
                                <Text className="text-white text-center text-lg">OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}

            {/* TimePicker iOS */}
            {showTimePicker && Platform.OS === "ios" && (
                <Modal transparent={true} animationType="fade">
                    <View className="flex-1 justify-center items-center bg-black/50">
                        <View className="bg-white p-4 rounded-lg">
                            <DateTimePicker value={tempTime} mode="time" display="spinner" onChange={onTimeChange} />
                            <TouchableOpacity onPress={confirmTime} className="mt-4 p-2 bg-blue-500 rounded-lg">
                                <Text className="text-white text-center text-lg">OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}


            <View className='flex flex-row gap-3 justify-between'>
                <Link href={"/calendario"} asChild>
                    <TouchableOpacity className="mt-6 p-4 bg-red-600 rounded-lg items-center w-1/2">
                        <Text className='text-white text-xl'>Excluir</Text>
                    </TouchableOpacity>
                </Link>
                <Link href={"/calendario"} asChild>
                    <TouchableOpacity className="mt-6 p-4 bg-blue-600 rounded-lg items-center w-1/2">
                        <Text className='text-white text-xl'>Atualizar</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </ScrollView>
    );
}

export default EditConsulta;
