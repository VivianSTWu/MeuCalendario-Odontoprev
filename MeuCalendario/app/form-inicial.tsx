import { useState } from "react";
import { View, Text, TouchableOpacity, Platform, Modal, ScrollView } from "react-native";
import { Calendar } from "lucide-react-native"; // Ícone de calendário
import DateTimePicker from "@react-native-community/datetimepicker";
import { Link } from "expo-router";

const doencas = [
  { id: 1, text: "Diabetes" },
  { id: 2, text: "Osteoporose" },
  { id: 3, text: "Doenças Cardiovasculares" },
  { id: 4, text: "Doenças autoimunes (como Lúpus e Síndrome de Sjögren)" },
  { id: 5, text: "HIV/AIDS" },
  { id: 6, text: "Câncer de boca" },
];

const aparelhos = [
  { id: 7, text: "Aparelho dental/ortodôntico" },
  { id: 8, text: "Protetor bucal (usado em esportes ou em casos de bruxismo)" },
];

const escovaOptions = [
  { id: 9, text: "Há 1 mês" },
  { id: 10, text: "Há 2 meses" },
  { id: 11, text: "Há 3 meses ou mais" },
  { id: 12, text: "Não me lembro" },
];

const FormInicial = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const [selectedRadio, setSelectedRadio] = useState<number | null>(null);
  const [date, setDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const toggleCheckbox = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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

      <Text className="form-question mt-10">
        Você possui alguma dessas doenças? Selecione todas que se aplicam. *
      </Text>
      {doencas.map((q) => (
        <TouchableOpacity
          key={q.id}
          onPress={() => toggleCheckbox(q.id)}
          className="flex-row items-start mb-1 py-1.5"
        >
          <View
            className={`w-6 h-6 border-2 rounded-md ${
              selected.includes(q.id) ? "bg-blue-500 border-blue-500" : "border-gray-500"
            }`}
          />
          <Text className="ml-2 text-lg">{q.text}</Text>
        </TouchableOpacity>
      ))}

      <Text className="form-question mt-10">
        Você utiliza algum dos aparelhos abaixo? Se sim, por favor selecione os que se aplicam.
      </Text>
      {aparelhos.map((q) => (
        <TouchableOpacity
          key={q.id}
          onPress={() => toggleCheckbox(q.id)}
          className="flex-row items-start mb-1 py-1.5"
        >
          <View
            className={`w-6 h-6 border-2 rounded-md ${
              selected.includes(q.id) ? "bg-blue-500 border-blue-500" : "border-gray-500"
            }`}
          />
          <Text className="ml-2 text-lg">{q.text}</Text>
        </TouchableOpacity>
      ))}

      <Text className="form-question mt-10">Última pergunta: quando você começou a utilizar a escova de dentes que está usando atualmente?</Text>
      {escovaOptions.map((q) => (
        <TouchableOpacity
          key={q.id}
          onPress={() => setSelectedRadio(q.id)}
          className="flex-row items-center mb-1 py-1.5"
        >
          <View
            className={`w-6 h-6 border-2 rounded-full ${
              selectedRadio === q.id ? "bg-blue-500 border-blue-500" : "border-gray-500"
            }`}
          />
          <Text className="ml-2 text-lg">{q.text}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity className="mt-6 p-4 bg-blue-600 rounded-lg items-center">
        <Link href={"/calendario"} className='color-white text-xl'>Enviar</Link>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default FormInicial;
