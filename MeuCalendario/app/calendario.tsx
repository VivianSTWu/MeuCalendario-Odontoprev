import React from "react";
import { View, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";

const Calendario = () => {

  const eventos = [
    { date: "2025-03-18", title: "Consulta Dentária" },
    { date: "2025-03-20", title: "Consulta de Rotina" },
  ];

  // Obtém a data atual no formato YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

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
          borderRadius: 10,
        },
        text: {
          color: "white",
        },
      },
    };

    return markedDates;
  };

  return (
    <ScrollView className="flex-1 px-6 bg-white">
      <View>
        <Calendar
          current={today}
          markingType={"custom"} 
          markedDates={getMarkedDates()} 
        />
      </View>
    </ScrollView>
  );
};

export default Calendario;
