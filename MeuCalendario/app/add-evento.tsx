import { View, Text, ScrollView, TouchableOpacity, Modal, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Link, useLocalSearchParams } from 'expo-router';

const AddEvento = () => {
  const { dataSelecionada } = useLocalSearchParams();

  const [date, setDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState<number | null>(null);

  const tipoEntrada = [
    { id: 13, text: "Consulta com dentista" },
    { id: 14, text: "Troca de protetor bucal" },
    { id: 15, text: "Troca de escova de dentes" },
  ];

  useEffect(() => {
    if (dataSelecionada) {
      const [ano, mes, dia] = dataSelecionada.split("-");
      const novaData = new Date(Number(ano), Number(mes) - 1, Number(dia));
      setDate(novaData);
      setTempDate(novaData);
    }
  }, [dataSelecionada]);

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
      <Text className="title">Adicione uma nova entrada</Text>

      {tipoEntrada.map((q) => (
        <TouchableOpacity
          key={q.id}
          onPress={() => setSelectedRadio(q.id)}
          className="flex-row items-center mb-1 mt-4 py-1.5"
        >
          <View className="w-6 h-6 border-2 rounded-full border-stone-600 items-center justify-center">
            {selectedRadio === q.id && (
              <View className="w-3 h-3 rounded-full bg-blue-500" />
            )}
          </View>
          <Text className="ml-2 text-lg">{q.text}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        onPress={() => setShow(true)}
        className="flex-row items-center justify-between p-2 border-b border-black mt-4"
      >
        <View className="flex-row items-center">
          <Calendar size={24} color="black" />
          <Text className="ml-2 text-lg">{date.toLocaleDateString("pt-BR")}</Text>
        </View>
      </TouchableOpacity>

      {show && Platform.OS === "android" && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
          maximumDate={twoYearsLater}
          minimumDate={oneYearAgo}
          locale="pt-BR"
        />
      )}

      {show && Platform.OS === "ios" && (
        <Modal transparent={true} animationType="fade">
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-4 rounded-lg">
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={onChange}
                minimumDate={oneYearAgo}
                maximumDate={twoYearsLater}
                locale="pt-BR"
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

      <Link href="/calendario" asChild>
        <TouchableOpacity className="mt-6 p-4 bg-blue-600 rounded-lg items-center">
          <Text className="text-white text-xl">Adicionar</Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
};

export default AddEvento;
