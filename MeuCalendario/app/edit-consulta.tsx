import React, { useEffect, useState } from 'react';
import { Modal, Platform, TouchableOpacity, View, Text, ScrollView, TextInput, Alert } from 'react-native';
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
    const carregarDados = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await api.get(`/evento/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const evento = res.data;
        setDate(new Date(evento.dt_evento));
        setTempDate(new Date(evento.dt_evento));

        if (evento.consulta) {
          setProfissional(evento.consulta.profissional || '');
          setLocal(evento.consulta.local_consulta || '');
          const hora = evento.consulta.horario_consulta?.substring(0, 5) || '12:00';
          const [h, m] = hora.split(':').map(Number);
          const horario = new Date();
          horario.setHours(h, m, 0);
          setTime(horario);
        }
      } catch (err) {
        Alert.alert("Erro", "Não foi possível carregar os dados da consulta.");
      }
    };

    carregarDados();
  }, [id]);

  const confirmDate = () => {
    setDate(tempDate);
    setShowDatePicker(false);
  };

  const atualizarConsulta = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      await api.patch(`/evento/${id}`, {
        dt_evento: date.toISOString().split('T')[0],
        profissional,
        local,
        horario: time.toTimeString().substring(0, 5)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert("Sucesso", "Consulta atualizada.");
      router.replace('/calendario');
    } catch (err) {
      Alert.alert("Erro", "Erro ao atualizar a consulta.");
    }
  };

  const excluirConsulta = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await api.delete(`/evento/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert("Sucesso", "Consulta excluída.");
      router.replace('/calendario');
    } catch (err) {
      Alert.alert("Erro", "Erro ao excluir a consulta.");
    }
  };

  return (
    <ScrollView className="flex-1 pl-6 pr-10 bg-white">
      <Text className="title">Consulta com dentista</Text>

      <Text className='font-semibold text-xl ml-2 mt-2'>Data</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} className="flex-row items-center p-2">
        <View className="flex-row items-center bg-slate-100 w-full p-4">
          <Calendar size={24} color="black" />
          <Text className="ml-2 text-lg">{date.toLocaleDateString("pt-BR")}</Text>
        </View>
      </TouchableOpacity>

      <Text className='font-semibold text-xl ml-2 mt-2'>Horário</Text>
      <TouchableOpacity onPress={() => setShowTimePicker(true)} className="flex-row items-center p-2">
        <View className="flex-row items-center bg-slate-100 w-full p-4">
          <Text className="ml-2 text-lg">
            {time.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </TouchableOpacity>

      <Text className='font-semibold text-xl ml-2 mt-2'>Profissional</Text>
      <TextInput
        value={profissional}
        onChangeText={setProfissional}
        placeholder="Digite o nome do profissional"
        className="bg-slate-100 w-full p-4 text-lg"
      />

      <Text className='font-semibold text-xl ml-2 mt-2'>Local</Text>
      <TextInput
        value={local}
        onChangeText={setLocal}
        placeholder="Digite o local da consulta"
        className="bg-slate-100 w-full p-4 text-lg"
      />

      {showDatePicker && (
        <Modal transparent animationType="fade">
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-4 rounded-lg">
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={(e, date) => setTempDate(date)}
                locale="pt-BR"
              />
              <TouchableOpacity onPress={confirmDate} className="mt-4 p-4 bg-blue-500 rounded-lg">
                <Text className="text-white text-center text-lg">OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {showTimePicker && (
        <Modal transparent animationType="fade">
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-4 rounded-lg">
              <DateTimePicker
                value={time}
                mode="time"
                display="spinner"
                onChange={(e, t) => setTime(t)}
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
