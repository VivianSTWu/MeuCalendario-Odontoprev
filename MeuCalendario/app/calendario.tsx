import { Link } from "expo-router";
import { Plus } from "lucide-react-native";
import React, { useState, useMemo } from "react";
import { Text, View, ScrollView, FlatList, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";

const Calendario = () => {
  const eventos = [
    { date: "2025-03-06", title: "Consulta Dentária" },
    { date: "2025-04-20", title: "Consulta de Rotina" },
    { date: "2025-03-15", title: "Aniversário de João" },
    { date: "2025-04-10", title: "Reunião de Trabalho" },
    { date: "2025-03-30", title: "Jantar com Amigos" },
    { date: "2024-12-25", title: "Natal" },
  ];

  const today = new Date().toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .split("/")
    .reverse()
    .join("-"); // Converte para o formato YYYY-MM-DD

  const anoAtualSistema = today.split("-")[0];
  const [mesAtual, setMesAtual] = useState(today.split("-")[1]);
  const [anoAtual, setAnoAtual] = useState(today.split("-")[0]);

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

  const handleMonthChange = (month) => {
    const mes = month.month.toString().padStart(2, "0");
    setMesAtual(mes);
    setAnoAtual(month.year.toString());
  };

  const gerarListaMesesFuturos = () => {
    let mesesFuturos = [];
    const dataAtual = new Date();

    for (let i = 0; i < 36; i++) {
      const novoMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + i, 1);
      const ano = novoMes.getFullYear();
      const mes = (novoMes.getMonth() + 1).toString().padStart(2, "0");
      mesesFuturos.push(`${ano}-${mes}`);
    }

    return mesesFuturos;
  };

  // Agrupar eventos por mês e preencher meses sem eventos
  const eventosPorMes = useMemo(() => {
    const eventosAgrupados = {};

    eventos.forEach((evento) => {
      const [ano, mes] = evento.date.split("-");
      const chave = `${ano}-${mes}`;
      if (!eventosAgrupados[chave]) eventosAgrupados[chave] = [];
      eventosAgrupados[chave].push(evento);
    });

    const mesesOrdenados = gerarListaMesesFuturos();
    mesesOrdenados.forEach((mesAno) => {
      if (!eventosAgrupados[mesAno]) {
        eventosAgrupados[mesAno] = [];
      }
    });

    const chaveMesAtual = `${anoAtual}-${mesAtual}`;
    if (mesesOrdenados.includes(chaveMesAtual)) {
      mesesOrdenados.splice(mesesOrdenados.indexOf(chaveMesAtual), 1);
      mesesOrdenados.unshift(chaveMesAtual);
    }

    return { eventosAgrupados, mesesOrdenados };
  }, [eventos, mesAtual, anoAtual]);

  const getMarkedDates = () => {
    let markedDates = {};

    // Marcar todos os eventos, incluindo passados
    eventos.forEach((evento) => {
      markedDates[evento.date] = {
        customStyles: {
          container: { borderWidth: 1, borderColor: "orange", borderRadius: 10 },
          text: { color: "black" },
        },
      };
    });

    // Marcar o dia de hoje
    markedDates[today] = {
      customStyles: {
        container: { backgroundColor: "blue", borderRadius: 5 },
        text: { color: "white" },
      },
    };

    return markedDates;
  };

  const renderItem = ({ item }) => (
    <View className="flex flex-row py-2">
      <View className="basis-1/4 p-2 flex justify-center items-center">
        <Text className="text-blue-900 font-bold text-4xl">
          {parseInt(item.date.split("-")[2], 10)}
        </Text>
      </View>
      <View className="basis-3/4 pl-5 flex justify-center">
        <Text className="text-black text-lg">{item.title}</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-col">
      <View className="flex-row justify-between items-center px-6 py-4">
        <Text className="text-xl font-bold">CALENDÁRIO</Text>
        <Link href={"/add-evento"} asChild>
          <TouchableOpacity>
            <Plus size={24} color="blue" />
          </TouchableOpacity>
        </Link>
      </View>
      <View className="px-6">
        <Calendar
          current={today}
          markingType={"custom"}
          markedDates={getMarkedDates()}
          onMonthChange={handleMonthChange}
          monthFormat={"MMMM yyyy"}
          firstDay={0}
          hideExtraDays={true}
        />
      </View>
      <ScrollView className="flex px-6 bg-white">
        {eventosPorMes.mesesOrdenados.map((chave) => {
          const [ano, mes] = chave.split("-");
          const eventosMes = eventosPorMes.eventosAgrupados[chave];

          // Exibe somente meses com eventos ou o mês atual, mesmo sem eventos
          if (eventosMes.length > 0 || chave === `${anoAtual}-${mesAtual}`) {
            return (
              <View key={chave}>
                <Text className="mt-8 text-3xl font-bold text-blue-700 text-start pl-2">
                  {mesesEmPortugues[mes]} {ano !== anoAtualSistema ? ano : ""}
                </Text>
                <View className="mt-4">
                  {eventosMes.length > 0 ? (
                    <FlatList
                      data={eventosMes}
                      renderItem={renderItem}
                      keyExtractor={(item) => item.date.toString()}
                      scrollEnabled={false}
                    />
                  ) : (
                    <Text className="text-center text-gray-500 text-lg">
                      Não há eventos neste mês
                    </Text>
                  )}
                </View>
              </View>
            );
          }
          return null;
        })}
      </ScrollView>
    </View>
  );
};

export default Calendario;
