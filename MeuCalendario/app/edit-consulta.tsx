import React, { useState, useEffect } from 'react';
import {
    Modal,
    Platform,
    TouchableOpacity,
    View,
    Text,
    ScrollView,
    TextInput,
    Alert,
} from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar } from "lucide-react-native";
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

function EditConsulta() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [date, setDate] = useState(new Date());
    const [tempDate, setTempDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [time, setTime] = useState(() => {
        const defaultTime = new Date();
        defaultTime.setHours(12);
        defaultTime.setMinutes(0);
        return defaultTime;
    });
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [profissional, setProfissional] = useState('');
    const [local, setLocal] = useState('');

    useEffect(() => {
        const carregarConsulta = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const res = await api.get(`/evento/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const evento = res.data;
                setDate(new Date(evento.dt_evento));
                setTempDate(new Date(evento.dt_evento));
                console.log("Evento:", res.data);
                console.log("Consulta:", res.data.consulta);


                if (evento.consulta) {
                    if (evento.consulta.horario_consulta) {
                        const [h, m] = evento.consulta.horario_consulta.split(":");
                        const horario = new Date();
                        horario.setHours(parseInt(h));
                        horario.setMinutes(parseInt(m));
                        setTime(horario);
                    }
                    setProfissional(evento.consulta.profissional || '');
                    setLocal(evento.consulta.local ||evento.consulta.local_consulta || '');
                }
            } catch (err) {
                Alert.alert("Erro", "Erro ao carregar dados da consulta.");
            }
        };

        if (id) carregarConsulta();
    }, [id]);

    const onDateChange = (event, selectedDate) => {
        if (selectedDate) {
            setTempDate(selectedDate);
        }
    };

    const confirmDate = () => {
        setDate(tempDate);
        setShowDatePicker(false);
    };

    const excluirConsulta = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            await api.delete(`/evento/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Alert.alert("Sucesso", "Consulta excluída.");
            router.replace('/calendario');
        } catch (err) {
            Alert.alert("Erro", "Erro ao excluir a consulta.");
        }
    };

    const atualizarConsulta = async () => {
        try {
            const token = await AsyncStorage.getItem('token');

            const hora = time.getHours().toString().padStart(2, "0");
            const minuto = time.getMinutes().toString().padStart(2, "0");
            const horarioFormatado = `${hora}:${minuto}`;

            const payload = {
                tipo_evento: "CONSULTA",
                desc_evento: "Consulta com dentista",
                dt_evento: date.toISOString().split("T")[0],
                profissional,
                local_consulta: local,
                horario_consulta: horarioFormatado
            };
            console.log("Payload:", payload);

            await api.patch(`/evento/${id}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            Alert.alert("Sucesso", "Consulta atualizada.");
            router.replace('/calendario');
        } catch (err) {
            Alert.alert("Erro", "Erro ao atualizar a consulta.");
        }
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
                        {time.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
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
                        onChangeText={setProfissional}
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

            {/* DateTimePickers Android */}
            {showDatePicker && Platform.OS === "android" && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        if (selectedDate) {
                            setDate(selectedDate);
                        }
                        setShowDatePicker(false);
                    }}
                    locale="pt-BR"
                />
            )}

            {showTimePicker && Platform.OS === "android" && (
                <DateTimePicker
                    value={time}
                    mode="time"
                    display="default"
                    onChange={(event, selectedTime) => {
                        if (selectedTime) {
                            setTime(selectedTime);
                        }
                        setShowTimePicker(false);
                    }}
                    locale="pt-BR"
                />
            )}

            {/* Date Picker iOS */}
            {showDatePicker && Platform.OS === "ios" && (
                <Modal transparent={true} animationType="fade">
                    <View className="flex-1 justify-center items-center bg-black/50">
                        <View className="bg-white p-4 rounded-lg">
                            <DateTimePicker
                                value={tempDate}
                                mode="date"
                                display="spinner"
                                onChange={onDateChange}
                                locale="pt-BR"
                            />
                            <TouchableOpacity onPress={confirmDate} className="mt-4 p-4 bg-blue-500 rounded-lg">
                                <Text className="text-white text-center text-lg">OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}

            {/* Time Picker iOS */}
            {showTimePicker && Platform.OS === "ios" && (
                <Modal transparent={true} animationType="fade">
                    <View className="flex-1 justify-center items-center bg-black/50">
                        <View className="bg-white p-4 rounded-lg">
                            <DateTimePicker
                                value={time}
                                mode="time"
                                display="spinner"
                                onChange={(event, selectedTime) => {
                                    if (selectedTime) {
                                        setTime(selectedTime);
                                    }
                                }}
                                locale="pt-BR"
                            />
                            <TouchableOpacity onPress={() => setShowTimePicker(false)} className="mt-4 p-2 bg-blue-500 rounded-lg">
                                <Text className="text-white text-center text-lg">OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}

            <View className='flex flex-row gap-3 justify-between'>
                <TouchableOpacity onPress={excluirConsulta} className="mt-6 p-4 bg-red-600 rounded-lg items-center w-1/2">
                    <Text className='text-white text-xl'>Excluir</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={atualizarConsulta} className="mt-6 p-4 bg-blue-600 rounded-lg items-center w-1/2">
                    <Text className='text-white text-xl'>Atualizar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

export default EditConsulta;
