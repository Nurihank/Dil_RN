import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    Modal,
    TextInput,
    TouchableOpacity,
} from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import api from "../api/api";

export default function TestScreen() {
    const [modalVisible, setModalVisible] = useState(true);
    const [name, setName] = useState("");
    const [meslekler, setMeslekler] = useState([]);
    const [meslekID, setMeslekID] = useState(null);
    const [diller, setDiller] = useState([]);
    const [dilID, setDilID] = useState(null);
    const [dillerL, setDillerL] = useState([]);
    const [dilIDL, setDilIDL] = useState(null);

    useEffect(() => {
        const MeslekleriGetir = async () => {
            try {
                const response = await api.get("/kullanici/meslek");
                if (response.data.result && Array.isArray(response.data.result)) {
                    const formattedData = response.data.result.map(meslek => ({
                        label: meslek.meslek, // API'deki meslek adı alanı
                        value: meslek.idMeslek, // API'deki meslek ID alanı
                    }));
                    setMeslekler(formattedData);
                }
            } catch (error) {
                console.error("Meslekleri getirirken hata oluştu:", error);
            }
        };
        const DilleriGetir = async () => {
            try {
                const response = await api.get("/kullanici/dil");
                console.log(response.data.result)

                if (response.data.result && Array.isArray(response.data.result)) {
                    const formattedDataL = response.data.result.map(dil => ({
                        label: dil.LocalName, // API'deki meslek adı alanı
                        value: dil.DilID, // API'deki meslek ID alanı
                    }));
                    setDillerL(formattedDataL);

                    const formattedData = response.data.result.map(dil => ({
                        label: dil.DilAdi, // API'deki meslek adı alanı
                        value: dil.DilID, // API'deki meslek ID alanı
                    }));
                    setDiller(formattedData[0]);
                }
            } catch (error) {
                console.error("Meslekleri getirirken hata oluştu:", error);
            }
        }
        DilleriGetir()
        MeslekleriGetir();
    }, []);

    const placeholder = {
        label: 'Meslek Seç',
        value: null,
    };
    const placeholderD = {
        label: 'Dil Seç',
        value: null,
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>TestScreen</Text>

            {/* Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Size nasıl hitap edelim?</Text>

                        {/* İsim Girişi */}
                        <TextInput
                            style={styles.input}
                            placeholder="İsminizi giriniz"
                            value={name}
                            onChangeText={setName}
                        />

                        {/* Meslek Seçimi */}
                        <Text style={styles.label}>Mesleğinizi seçin:</Text>
                        <RNPickerSelect
                            placeholder={placeholder}
                            items={meslekler}
                            onValueChange={(value) => setMeslekID(value)}
                            value={meslekID}
                            style={pickerSelectStyles}
                        />
                        <Text style={styles.label}>Ana Dilinizi seçin:</Text>
                        <RNPickerSelect
                            placeholder={placeholderD}
                            items={dillerL}
                            onValueChange={(value) => setDilIDL(value)}
                            value={dilIDL}
                            style={pickerSelectStyles}
                        />
                        <Text style={styles.label}>Öğrenmek İstediğiniz Dili seçin:</Text>
                        <RNPickerSelect
                            placeholder={placeholderD}
                            items={diller}
                            onValueChange={(value) => setDilID(value)}
                            value={dilID}
                            style={pickerSelectStyles}
                        />
                        {/* Buton */}
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Teste Hazırım</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        width: "80%",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        alignSelf: "flex-start",
        marginBottom: 5,
    },
    picker: {
        width: "100%",
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#007bff",
        padding: 12,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#bdc3c7', // Gri border
        borderRadius: 8,
        backgroundColor: '#ffffff',
        fontSize: 16,
        color: '#333',
        elevation: 2, // Yükselti eklemek için
    },
    inputAndroid: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#bdc3c7',
        borderRadius: 8,
        backgroundColor: '#ffffff',
        fontSize: 16,
        color: '#333',
    },
});