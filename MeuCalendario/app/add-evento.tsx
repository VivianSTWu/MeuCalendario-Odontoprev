import { View, Text, ScrollView, TouchableOpacity, Modal, Platform } from 'react-native'
import React, { useState } from 'react'
import { Calendar } from 'lucide-react-native'
import DateTimePicker from "@react-native-community/datetimepicker";

const AddEvento = () => {
      const [date, setDate] = useState(new Date());
      const [tempDate, setTempDate] = useState(new Date());
      const [show, setShow] = useState(false);

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
      Quando foi a última vez em que foi ao dentista? Caso não saiba a data
      exata, tente informar a data mais próxima possível. *
    </Text>

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
        maximumDate={new Date()}
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
              maximumDate={new Date()}
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
    </ScrollView>
  )
}

export default AddEvento