import React, { useState } from 'react'
import { Modal, Platform, TouchableOpacity, View, Text, ScrollView } from 'react-native'
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar } from "lucide-react-native"; // Ícone de calendário

function EditConsulta() {
    const [date, setDate] = useState(new Date());
    const [tempDate, setTempDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const twoYearsLater = new Date();
    twoYearsLater.setFullYear(twoYearsLater.getFullYear() + 2);

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
                                value={Platform.OS === "ios" ? tempDate : date}
                                mode="date"
                                display="spinner"
                                onChange={onChange}
                                minimumDate={oneYearAgo}
                                maximumDate={twoYearsLater}
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

export default EditConsulta