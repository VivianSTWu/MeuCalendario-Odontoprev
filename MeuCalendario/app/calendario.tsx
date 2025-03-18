import React, { useState } from "react";
import { Text, View, ScrollView, FlatList } from "react-native";
import { Calendar } from "react-native-calendars";

const Calendario = () => {
  const eventos = [
    { date: "2025-03-06", title: "Consulta Dentária" },
    { date: "2025-04-20", title: "Consulta de Rotina" },
  ];

  const today = new Date().toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .split("/")
    .reverse()
    .join("-"); // Converte para o formato YYYY-MM-DD
  

  const [mesAtual, setMesAtual] = useState("Março"); // Estado para armazenar o mês atual

  // Mapeamento de meses em português
  const mesesEmPortugues = {
    "01": "Janeiro",
    "02": "Fevereiro",
    "03": "Março",
    "04": "Abril",
    "05": "Maio",
    "06": "Junho",
    "07": "Julho",
    "08": "Agosto",
    "09": "Setembro",
    "10": "Outubro",
    "11": "Novembro",
    "12": "Dezembro",
  };

  // Atualiza o nome do mês quando o usuário navega pelo calendário
  const handleMonthChange = (month) => {
    const mes = month.month.toString().padStart(2, "0"); // Garante que tenha dois dígitos
    setMesAtual(mesesEmPortugues[mes]);
  };

  const getMarkedDates = () => {
    let markedDates = {};
    eventos.forEach((evento) => {
      markedDates[evento.date] = {
        customStyles: {
          container: {
            borderWidth: 1,
            borderColor: "orange",
            borderRadius: 10,
          },
          text: {
            color: "black",
          },
        },
      };
    });

    markedDates[today] = {
      customStyles: {
        container: {
          backgroundColor: "blue",
          borderRadius: 5, // Deixa o marcador do dia atual mais retangular
        },
        text: {
          color: "white",
        },
      },
    };

    return markedDates;
  };

  // Renderiza cada item da lista de eventos
  const renderItem = ({ item }) => (
    <View className="flex flex-row py-2">
      <View className="basis-1/4 p-2 flex justify-center items-center">
        <Text className="text-blue-900 font-bold text-4xl">{parseInt(item.date.split("-")[2], 10)}</Text>
      </View>
      <View className="basis-3/4 pl-5 flex justify-center">
        <Text className="text-black text-lg">{item.title}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 px-6 bg-white">
      

      {/* Calendário */}
      <View>
        <Calendar
          current={today}
          markingType={"custom"}
          markedDates={getMarkedDates()}
          onMonthChange={handleMonthChange} // Atualiza o nome do mês ao navegar
          monthFormat={"MMMM yyyy"} // Formato do mês
          firstDay={0} // Domingo como primeiro dia da semana (padrão brasileiro)
          hideExtraDays={true} // Esconde dias fora do mês atual
        />
      </View>

      {/* Exibir o nome correto do mês */}
      <Text className="mt-8 text-3xl font-bold text-blue-700 text-start pl-2">{mesAtual}</Text>

      {/* Lista de eventos */}
      <View className="mt-4">
        <FlatList
          data={eventos}
          renderItem={renderItem}
          keyExtractor={(item) => item.date.toString()}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
};

export default Calendario;
