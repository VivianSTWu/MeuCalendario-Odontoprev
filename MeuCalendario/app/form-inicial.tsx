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
  { id: 8, text: "Cáries" },
  { id: 9, text: "Gengivite" },
  { id: 10, text: "Periodontite" },
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

const mapIdParaTexto = {
  1: "Diabetes",
  2: "Osteoporose",
  3: "Doenças Cardiovasculares",
  4: "Doenças autoimunes (como Lúpus e Síndrome de Sjögren)",
  5: "HIV/AIDS",
  6: "Câncer de boca",
  7: "Hipertensão",
  8: "Cáries",
  9: "Gengivite",
  10: "Periodontite"
};

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
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('usuario');
      const parsed = userData ? JSON.parse(userData) : null;

      if (!token || !parsed?.id_cliente) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const idCliente = parsed.id_cliente;
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Adiciona doenças
      for (const idDoenca of selected) {
        if (idDoenca <= 7) {
          await api.post(`/cliente/${idCliente}/add-doenca/${idDoenca}`, {}, { headers });
        }
      }

      // 2. Evento: Consulta
      const consultaPayload = {
        tipo_evento: "CONSULTA",
        desc_evento: "Consulta Odontológica",
        dt_evento: date.toISOString().split("T")[0],
        fk_cliente: { id_cliente: idCliente }
      };
      await api.post(`/evento`, consultaPayload, { headers });

      // 3. Evento: Troca de escova
      const escovaMap = { 9: 1, 10: 2, 11: 3, 12: 4 };
      const meses = escovaMap[selectedRadio] || 3;
      const dataTroca = new Date();
      dataTroca.setMonth(dataTroca.getMonth() - meses);
      const trocaPayload = {
        tipo_evento: "TROCA",
        desc_evento: "Troca de escova de dentes",
        dt_evento: dataTroca.toISOString().split("T")[0],
        fk_cliente: { id_cliente: idCliente }
      };
      await api.post(`/evento`, trocaPayload, { headers });

      // 4. Calcular próxima consulta
      const doencasSelecionadas = selected.map(id => mapIdParaTexto[id]).filter(Boolean);
      const calculoResponse = await api.post("/calculo-consulta", {
        dataUltimaConsulta: date.toISOString().split("T")[0],
        doencas: doencasSelecionadas
      }, { headers });

      const dataProximaConsulta = calculoResponse.data?.dataProximaConsulta;
      if (dataProximaConsulta) {
        const eventoRecomendado = {
          tipo_evento: "RECOMENDACAO",
          desc_evento: "(Recomendação) Agende sua próxima consulta",
          dt_evento: dataProximaConsulta,
          fk_cliente: { id_cliente: idCliente }
        };
        console.log("Evento recomendado:", eventoRecomendado);
        await api.post(`/evento`, eventoRecomendado, { headers });

        await AsyncStorage.setItem("proximaConsulta", dataProximaConsulta);
      }


      // 5. Marcar formulário como preenchido
      await api.post(`/cliente/form/fill/${idCliente}`, {}, { headers });
      await AsyncStorage.mergeItem('usuario', JSON.stringify({ form: true }));

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
