import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { Calendar } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "../services/api";

const doencas = [
  { id: 1, text: "Diabetes" },
  { id: 2, text: "Osteoporose" },
  { id: 3, text: "Doenças Cardiovasculares" },
  { id: 4, text: "Doenças autoimunes (como Lúpus e Síndrome de Sjögren)" },
  { id: 5, text: "HIV/AIDS" },
  { id: 6, text: "Câncer de boca" },
  { id: 7, text: "Hipertensão" },
];

const escovaOptions = [
  { id: 9, text: "Há 1 mês" },
  { id: 10, text: "Há 2 meses" },
  { id: 11, text: "Há 3 meses ou mais" },
  { id: 12, text: "Não me lembro" },
];

const FormInicial = () => {
  const router = useRouter();
  const [selected, setSelected] = useState<number[]>([]);
  const [selectedRadio, setSelectedRadio] = useState<number | null>(null);
  const [date, setDate] = useState<Date | null>(null);
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

  const handleSubmit = async () => {
    if (!date) {
      Alert.alert("Campo obrigatório", "Por favor, selecione a data da última visita ao dentista.");
      return;
    }

    if (selectedRadio === null) {
      Alert.alert("Campo obrigatório", "Por favor, selecione uma opção sobre a escova de dentes.");
      return;
    }

    try {
      console.log("Iniciando submissão do formulário...");
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('usuario');
      const parsed = userData ? JSON.parse(userData) : null;

      if (!token || !parsed?.id_cliente) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const idCliente = parsed.id_cliente;
      const headers = { Authorization: `Bearer ${token}` };
      console.log("Token:", token);

      console.log("Etapa 1: Adicionando doenças...");
      for (const idDoenca of selected) {
        if (idDoenca <= 7) {
          console.log(`POST /cliente/${idCliente}/add-doenca/${idDoenca}`);
          await api.post(`/cliente/${idCliente}/add-doenca/${idDoenca}`, {}, { headers });
        }
      }

      const consultaPayload = {
        tipo_evento: "CONSULTA",
        desc_evento: "Consulta Odontológica",
        dt_evento: date.toISOString().split("T")[0],
        fk_cliente: { id_cliente: idCliente }
      };
      console.log("Etapa 2: Criando evento de consulta...");
      console.log("Payload:", consultaPayload);
      await api.post(`/evento`, consultaPayload, { headers });

      const escovaMap = {
        9: 1,  // Há 1 mês
        10: 2, // Há 2 meses
        11: 3, // Há 3 meses ou mais
        12: 4  // Não me lembro
      };
      const meses = escovaMap[selectedRadio] || 3;
      const dataTroca = new Date();
      dataTroca.setMonth(dataTroca.getMonth() - meses); // ✅ subtrai para o passado

      const trocaPayload = {
        tipo_evento: "TROCA",
        desc_evento: "Troca de escova de dentes",
        dt_evento: dataTroca.toISOString().split("T")[0],
        fk_cliente: { id_cliente: idCliente }
      };
      console.log("Etapa 3: Criando evento de troca de escova...");
      console.log("Payload:", trocaPayload);
      await api.post(`/evento`, trocaPayload, { headers });

      console.log("Etapa final: Atualizando status do formulário...");
      await api.post(`/cliente/form/fill/${idCliente}`, {}, { headers });

      console.log("Formulário enviado com sucesso!");
      router.push("/calendario");
    } catch (err) {
      console.error("Erro ao enviar formulário:", err);
      Alert.alert("Erro", "Falha ao enviar as informações.");
    }
  };

  return (
    <ScrollView className="flex-1 pl-6 pr-10 bg-white">
      <Text className="form-question">
        Quando foi a última vez em que foi ao dentista? Caso não saiba a data exata, tente informar a data mais próxima possível. *
      </Text>

      <TouchableOpacity
        onPress={() => setShow(true)}
        className="flex-row items-center justify-between p-2 border-b border-black mt-4"
      >
        <View className="flex-row items-center">
          <Calendar size={24} color="black" />
          <Text className="ml-2 text-lg">{date ? date.toLocaleDateString("pt-BR") : "Selecione a data"}</Text>
        </View>
      </TouchableOpacity>

      {show && Platform.OS === "android" && (
        <DateTimePicker
          value={date || new Date()}
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
        Você possui alguma dessas doenças? Selecione todas que se aplicam.
      </Text>
      {doencas.map((q) => (
        <TouchableOpacity
          key={q.id}
          onPress={() => toggleCheckbox(q.id)}
          className="flex-row items-start mb-1 py-1.5"
        >
          <View
            className={`w-6 h-6 border-2 rounded-md ${selected.includes(q.id) ? "bg-blue-500 border-blue-500" : "border-gray-500"}`}
          />
          <Text className="ml-2 text-lg">{q.text}</Text>
        </TouchableOpacity>
      ))}

      <Text className="form-question mt-10">
        Última pergunta: quando você começou a utilizar a escova de dentes que está usando atualmente? *
      </Text>
      {escovaOptions.map((q) => (
        <TouchableOpacity
          key={q.id}
          onPress={() => setSelectedRadio(q.id)}
          className="flex-row items-center mb-1 py-1.5"
        >
          <View
            className={`w-6 h-6 border-2 rounded-full ${selectedRadio === q.id ? "bg-blue-500 border-blue-500" : "border-gray-500"}`}
          />
          <Text className="ml-2 text-lg">{q.text}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity onPress={handleSubmit} className="mt-6 p-4 bg-blue-600 rounded-lg items-center">
        <Text className='color-white text-xl'>Enviar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default FormInicial;
