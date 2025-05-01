import { Link } from "expo-router";
import { Plus, FilePenLine, PenIcon } from "lucide-react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import React, { useState, useMemo, } from "react";
import { Text, View, ScrollView, FlatList, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";

const Calendario = () => {
  const eventos = [
    { date: "2025-06-20", title: "Consulta com dentista" },
    { date: "2025-05-15", title: "Consulta com dentista" },
    { date: "2025-06-10", title: "Troca de escova de dente" },
    { date: "2025-06-12", title: "Troca de protetor bucal" },
    { date: "2025-05-20", title: "Troca de escova de dente" },
    { date: "2025-07-30", title: "Troca de aparelho dental" },
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

    // Ordenar eventos dentro de cada mês por data crescente
    Object.keys(eventosAgrupados).forEach((mesAno) => {
      eventosAgrupados[mesAno].sort((a, b) => new Date(a.date) - new Date(b.date));
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

  const renderItem = ({ item }) => {
    // Verificando o que está sendo coletado
    console.log("Item do evento:", item);

    return (
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
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };


  return (
    <View className="flex-col">
      <View className="flex-row justify-between items-center px-6 py-4">
        <Text className="title">Calendário</Text>
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
      <View>
        <ScrollView className="flex mt-6 px-6 bg-white">

          {eventosPorMes.mesesOrdenados.map((chave) => {
            const [ano, mes] = chave.split("-");
            const eventosMes = eventosPorMes.eventosAgrupados[chave];

            // Exibe somente meses com eventos ou o mês atual, mesmo sem eventos
            if (eventosMes.length > 0 || chave === `${anoAtual}-${mesAtual}`) {
              return (
                <View key={chave}>
                  <Text className={`${chave === `${anoAtual}-${mesAtual}` ? "text-4xl text-blue-700 text-start pl-2 font-bold" : "mt-9 text-2xl font-bold text-blue-500 text-start pl-2"}`}>
                    {mesesEmPortugues[mes]} {ano !== anoAtualSistema ? ano : ""}
                  </Text>
                  <View className="mt-4">
                    {eventosMes.length > 0 ? (
                      <FlatList
                        data={eventosMes}
                        renderItem={({ item }) => (
                          <Link href={`/edit-consulta`} asChild>
                            <TouchableOpacity>
                              <View className="flex flex-row py-2">
                                <View className="basis-1/4 p-2 flex justify-center items-center">
                                  <Text className="text-blue-900 font-bold text-4xl">
                                    {parseInt(item.date.split("-")[2], 10)}
                                  </Text>
                                </View>
                                <View className="basis-3/4 pl-5 flex justify-center">
                                  <Text className="text-black text-lg">{item.title}</Text>
                                </View>
                                <View className="basis-1/5 flex justify-center items-center">
                                <Icon name="pencil" size={24} color="blue" />
                                </View>
                              </View>
                            </TouchableOpacity>
                          </Link>
                        )}
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
    </View>
  );
};

export default Calendario;
