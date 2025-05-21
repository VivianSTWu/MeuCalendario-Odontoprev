import React, { useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Alert
} from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar } from "lucide-react-native";
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

function EditTroca() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [date, setDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await api.get(`/evento/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const evento = res.data;
        const data = new Date(evento.dt_evento);
        setDate(data);
        setTempDate(data);
      } catch (err) {
        Alert.alert("Erro", "Não foi possível carregar os dados da troca.");
      }
    };

    carregarDados();
  }, [id]);

  const confirmDate = () => {
    setDate(tempDate);
    setShowDatePicker(false);
  };

  const atualizarEvento = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      await api.patch(`/evento/${id}`, {
        dt_evento: date.toISOString().split('T')[0]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert("Sucesso", "Data de troca atualizada.");
      router.replace('/calendario');
    } catch (err) {
      Alert.alert("Erro", "Erro ao atualizar a troca.");
    }
  };

  const excluirEvento = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await api.delete(`/evento/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert("Sucesso", "Evento excluído.");
      router.replace('/calendario');
    } catch (err) {
      Alert.alert("Erro", "Erro ao excluir o evento.");
    }
  };

  return (
    <ScrollView className="flex-1 pl-6 pr-10 bg-white">
      <Text className="title">Troca de escova de dentes</Text>

      <Text className='font-semibold text-xl ml-2 mt-2'>Data</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} className="flex-row items-center p-2">
        <View className="flex-row items-center bg-slate-100 w-full p-2">
          <Calendar size={24} color="black" />
          <Text className="ml-2 text-lg">{date.toLocaleDateString("pt-BR")}</Text>
        </View>
      </TouchableOpacity>

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

      {showDatePicker && Platform.OS === "ios" && (
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

      <View className='flex flex-row gap-3 justify-between'>
        <TouchableOpacity onPress={excluirEvento} className="mt-6 p-4 bg-red-600 rounded-lg items-center w-1/2">
          <Text className='text-white text-xl'>Excluir</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={atualizarEvento} className="mt-6 p-4 bg-blue-600 rounded-lg items-center w-1/2">
          <Text className='text-white text-xl'>Atualizar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default EditTroca;
