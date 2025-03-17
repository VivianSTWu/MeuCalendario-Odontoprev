import { CalendarCogIcon } from "lucide-react-native";
import React, { useState } from "react";
import { View, Text } from "react-native";
import { Calendar } from "react-native-calendars";

const Calendario = () => {
  // Simulando alguns eventos
  const eventos = [
    { date: "2025-03-18", title: "Consulta Dentária" },
    { date: "2025-03-20", title: "Consulta de Rotina" },
  ];

  // Função para gerar as datas com eventos
  const getMarkedDates = () => {
    let markedDates = {};
    eventos.forEach((evento) => {
      markedDates[evento.date] = {
        marked: true,
        dotColor: "red", // cor do ponto para o evento
        activeOpacity: 0,
      };
    });
    return markedDates;
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Calendário de Eventos</Text>
      
      <Calendar
        // Exibe o calendário
        current={new Date().toISOString().split("T")[0]} // Data atual
        markedDates={{
          ...getMarkedDates(),
          [new Date().toISOString().split("T")[0]]: { 
            selected: true, 
            selectedColor: "blue", 
            selectedTextColor: "white",
          },
        }}
        markingType={"simple"}
      />
    </View>
  );
};

export default Calendario;
