import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import React, { useState, useMemo, useEffect } from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

LocaleConfig.locales['pt'] = {
  monthNames: [
    'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
  ],
  monthNamesShort: [
    'Jan','Fev','Mar','Abr','Mai','Jun',
    'Jul','Ago','Set','Out','Nov','Dez'
  ],
  dayNames: [
    'Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'
  ],
  dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt';

const Calendario = () => {
  const router = useRouter();
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const carregarEventos = async () => {
      const token = await AsyncStorage.getItem("token");
      const usuarioStr = await AsyncStorage.getItem("usuario");
      const usuario = JSON.parse(usuarioStr);

      try {
        const res = await api.get(`/cliente/${usuario.id_cliente}/eventos`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const eventosConvertidos = res.data.map(ev => ({
          id_evento: ev.id_evento,
          tipo_evento: ev.tipo_evento,
          date: ev.dt_evento,
          title: ev.desc_evento,
        }));

        setEventos(eventosConvertidos);
      } catch (err) {
        console.error("Erro ao carregar eventos:", err);
      }
    };

    carregarEventos();
  }, []);

  const today = new Date().toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).split("/").reverse().join("-");

  const anoAtualSistema = today.split("-")[0];
  const [mesAtual, setMesAtual] = useState(today.split("-")[1]);
  const [anoAtual, setAnoAtual] = useState(today.split("-")[0]);

  const mesesEmPortugues = {
    "01": "Janeiro", "02": "Fevereiro", "03": "Março", "04": "Abril",
    "05": "Maio", "06": "Junho", "07": "Julho", "08": "Agosto",
    "09": "Setembro", "10": "Outubro", "11": "Novembro", "12": "Dezembro",
  };

  const handleMonthChange = (month) => {
    const mes = month.month.toString().padStart(2, "0");
    setMesAtual(mes);
    setAnoAtual(month.year.toString());
  };

  const handleDayPress = (day) => {
    router.push({ pathname: "/add-evento", params: { dataSelecionada: day.dateString } });
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

  const eventosPorMes = useMemo(() => {
    const eventosAgrupados = {};
    eventos.forEach((evento) => {
      const [ano, mes] = evento.date.split("-");
      const chave = `${ano}-${mes}`;
      if (!eventosAgrupados[chave]) eventosAgrupados[chave] = [];
      eventosAgrupados[chave].push(evento);
    });

    const mesesOrdenados = gerarListaMesesFuturos();
    const chaveMesAtual = `${anoAtual}-${mesAtual}`;
    if (!eventosAgrupados[chaveMesAtual]) eventosAgrupados[chaveMesAtual] = [];
    if (!mesesOrdenados.includes(chaveMesAtual)) mesesOrdenados.unshift(chaveMesAtual);
    mesesOrdenados.forEach((mesAno) => {
      if (!eventosAgrupados[mesAno]) eventosAgrupados[mesAno] = [];
    });
    Object.keys(eventosAgrupados).forEach((mesAno) => {
      eventosAgrupados[mesAno].sort((a, b) => new Date(a.date) - new Date(b.date));
    });
    return { eventosAgrupados, mesesOrdenados };
  }, [eventos, mesAtual, anoAtual]);

  const getMarkedDates = () => {
    let markedDates = {};
    eventos.forEach((evento) => {
      markedDates[evento.date] = {
        customStyles: {
          container: { borderWidth: 1, borderColor: "orange", borderRadius: 10 },
          text: { color: "black" },
        },
      };
    });
    markedDates[today] = {
      customStyles: {
        container: { backgroundColor: "blue", borderRadius: 5 },
        text: { color: "white" },
      },
    };
    return markedDates;
  };

  return (
    <View className="flex-col flex-1">
      <View className="flex-row justify-between items-center px-6 py-4">
        <Text className="title">Calendário</Text>
        <TouchableOpacity onPress={() => router.push("/add-evento") }>
          <Plus size={24} color="blue" />
        </TouchableOpacity>
      </View>

      <View className="px-6">
        <Calendar
          current={today}
          markingType={"custom"}
          markedDates={getMarkedDates()}
          onDayPress={handleDayPress}
          onMonthChange={handleMonthChange}
          monthFormat={"MMMM yyyy"}
          firstDay={0}
          hideExtraDays={true}
        />
      </View>

      <ScrollView className="flex mt-6 px-6 bg-white flex-1">
        {(() => {
          const chaveMesAtual = `${anoAtual}-${mesAtual}`;
          const eventosMesAtual = eventosPorMes.eventosAgrupados[chaveMesAtual];
          const outrosMeses = eventosPorMes.mesesOrdenados.filter(
            chave => chave !== chaveMesAtual && eventosPorMes.eventosAgrupados[chave].length > 0
          );

          const renderEventos = (lista) => (
            lista.map((item) => (
              <TouchableOpacity
                key={item.id_evento}
                onPress={() => {
                  const rota = item.tipo_evento === "CONSULTA" ? "/edit-consulta" : "/edit-troca";
                  console.log("id_evento:", item.id_evento)
                  router.push({ pathname: rota, params: { id: item.id_evento } });
                }}
              >
                <View className="flex flex-row py-2 items-center border-b border-gray-200">
                  <View className="w-16 items-center">
                    <Text className="text-blue-700 font-bold text-2xl">
                      {parseInt(item.date.split("-")[2], 10)}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base text-black">{item.title}</Text>
                  </View>
                  <View className="px-3">
                    <Icon name="pencil" size={20} color="#007AFF" />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          );

          return (
            <>
              <View key={chaveMesAtual}>
                <Text className="text-4xl text-blue-700 text-start pl-2 font-bold">
                  {mesesEmPortugues[mesAtual]} {anoAtual !== anoAtualSistema ? anoAtual : ""}
                </Text>
                <View className="mt-4">
                  {eventosMesAtual.length > 0 ? (
                    renderEventos(eventosMesAtual)
                  ) : (
                    <Text className="text-center text-gray-500 text-lg">Não há eventos neste mês</Text>
                  )}
                </View>
              </View>

              {outrosMeses.length > 0 && (
                <Text className="text-left text-gray-500 text-sm mt-10">Próximos eventos</Text>
              )}

              {outrosMeses.map((chave) => {
                const [ano, mes] = chave.split("-");
                const eventosMes = eventosPorMes.eventosAgrupados[chave];
                return (
                  <View key={chave}>
                    <Text className="mt-3 text-2xl font-bold text-blue-500 text-start pl-2">
                      {mesesEmPortugues[mes]} {ano !== anoAtualSistema ? ano : ""}
                    </Text>
                    <View className="mt-1 mb-4">
                      {renderEventos(eventosMes)}
                    </View>
                  </View>
                );
              })}
            </>
          );
        })()}
      </ScrollView>
    </View>
  );
};

export default Calendario;
