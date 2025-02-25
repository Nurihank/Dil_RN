import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert, Image, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { ProgressBar } from 'react-native-paper';
import UserModel from '../model/ModelUser';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

export default function EgitimScreen(props) {
    const [kelimeler, setKelimeler] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0); // Track the current word index
    const [dil, setDil] = useState(false);
    const [userId, setUserId] = useState(null);
    const [yuzde, setYuzde] = useState(0)
    const [meslekID, setMeslekID] = useState();
    const [HangiDilID, setHangiDilID] = useState();
    const [AnaDilID, setAnaDilID] = useState();
    const [egitimBitti, setEgitimBitti] = useState(false);

    const navigation = useNavigation()
    const yuzdeHesaplama = () => {
        if (kelimeler.length === 0) {
            return;
        }
        const yuzdeHesabi = (currentIndex + 1) / kelimeler.length;
        setYuzde((yuzdeHesabi * 100).toFixed(0));
    };


    const setUserID = async () => {
        const id = await AsyncStorage.getItem("id");
        setUserId(id);
    };

    const getUserInfo = async () => {
        const user = await UserModel.currentUser;
        setMeslekID(user[0].MeslekID);
        setHangiDilID(user[0].DilID);
        setAnaDilID(user[0].SectigiDilID)
    };

    const speakWord = (word) => {
        const options = {
            rate: 0.40,  // Adjust the speed (0.75 is slower than normal, where 1.0 is the default speed)
            pitch: 1.0,  // Adjust the pitch (1.0 is the default pitch)
            language: 'en',  // You can set the language here (e.g., 'en' for English) 
            onStart: () => console.log("Speech started"),
            onDone: () => console.log("Speech finished"),
        }
        Speech.speak(word, options)
    }

    const KelimeleriGetir = async () => {
        try {
            const response = await api.get("/kullanici/Egitim", {
                params: {
                    SeviyeID: props.route.params.id,
                    MeslekID: meslekID,
                    AnaDilID: AnaDilID,
                    HangiDilID: HangiDilID
                }
            });
            const data = response.data;

            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }

            if (data.length > 0) {
                const shuffledData = shuffleArray([...data]);
                setKelimeler(shuffledData);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const SozlugeEkle = async (AnaKelimeID) => {
        try {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;

            const response = await api.post("/kullanici/SozlugeKelimeEkleme", {
                KullaniciID: userId,
                AnaKelimeID: AnaKelimeID,
                Date: formattedDate
            });

            showMessage({
                message: response.data.message, // API'den gelen mesaj
                type: "success", // Başarı mesajı (hata olursa "danger" yapabilirsin)
                duration: 3000, // Mesajın ekranda kalma süresi (ms)
                icon: "success",
                style: {
                    borderRadius: 10, // Köşe yuvarlama
                    marginTop: 20, // Ekranın üstünden boşluk
                    marginHorizontal: 10, // Yanlardan boşluk
                },
            });

        } catch (error) {
            console.error("Hata:", error);

            showMessage({
                message: "Bir hata oluştu! Lütfen tekrar deneyin.",
                type: "danger",
                duration: 3000,
                icon: "danger"
            });
        }
    };

    useEffect(() => {
        KelimeleriGetir();
    }, [userId])

    useEffect(() => {
        setUserID()
        getUserInfo()
    }, []);

    useEffect(() => {
        if (kelimeler.length > 0) {
            yuzdeHesaplama();
        }
    }, [kelimeler, currentIndex]);


    const nextWord = () => {
        if (yuzde >= 100) {
            setEgitimBitti(true)
        } else{
            if (currentIndex < kelimeler.length - 1) {
                setCurrentIndex(currentIndex + 1);
            }
        }
           
        

    };

    const previousWord = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };
    return (
        <View style={styles.container}>
            
            <TouchableOpacity style={styles.backButton} onPress={() => props.navigation.goBack()}>
                <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <FlashMessage position="top" />
            <Text>%{yuzde} TAMAMLADIN</Text>
            <ProgressBar progress={yuzde / 100} width={230}
                height={50} />



            {kelimeler.length > 0 && (
                <View style={styles.wordContainer}>
                    <Text style={styles.wordText}>
                        {dil ? kelimeler[currentIndex].Ceviri : kelimeler[currentIndex].Value}
                    </Text>
                    <TouchableOpacity onPress={() => speakWord(kelimeler[currentIndex].Value)}>
                        <Image source={require("../assets/microphone.png")} style={{ height: 40, width: 40 }} />
                    </TouchableOpacity>
                </View>

            )}

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={previousWord} style={styles.navigationButton} disabled={currentIndex === 0}>
                    <Text style={styles.buttonText}>◀️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setDil(!dil)} style={styles.languageButton}>
                    <Image source={require("../assets/repeat.png")} style={{ height: 50, width: 50 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={nextWord} style={styles.navigationButton}>
                    <Text style={styles.buttonText}>▶️</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={() => SozlugeEkle(kelimeler[currentIndex].AnaKelimelerID)}>
                <Text style={styles.addButtonText}>Sözlüğe Ekle</Text>
            </TouchableOpacity>
            <Modal visible={egitimBitti} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Eğitim Bitti</Text>

                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Ana Sayfaya Dön</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.replace("Egitim", { id: props.route.params.id })}
                            style={[styles.modalButton, styles.repeatButton]}
                        >
                            <Text style={styles.modalButtonText}>Eğitimi Tekrarla</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E0EAFC', // Gradient için geçici renk
        padding: 20,
    },
    wordContainer: {
        width: screenWidth * 0.8,
        height: 200,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15, // Daha yuvarlak köşeler
        elevation: 8, // Daha belirgin gölge
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        marginBottom: 20,
    },
    wordText: {
        fontSize: 28, // Daha büyük yazı
        color: '#2C3E50', // Daha belirgin yazı rengi
        fontWeight: 'bold', // Kalın yazı
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: screenWidth * 0.8,
    },
    navigationButton: {
        backgroundColor: '#3498DB', // Daha canlı bir mavi
        padding: 15,
        borderRadius: 10, // Daha yuvarlak köşeler
    },
    languageButton: {
        backgroundColor: '#1ABC9C', // Daha canlı bir yeşil
        padding: 15,
        borderRadius: 10, // Daha yuvarlak köşeler
    },
    buttonText: {
        color: '#fff',
        fontSize: 18, // Daha büyük yazı
        fontWeight: '600', // Yazıyı kalınlaştır
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#E74C3C', // Kırmızı buton
        padding: 15,
        borderRadius: 50, // Yuvarlak buton
        elevation: 8, // Daha belirgin gölge
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18, // Daha büyük yazı
        fontWeight: 'bold', // Kalın yazı
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10, // Daha yuvarlak köşeler
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    }, modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Yarı saydam arka plan
    },
    modalContent: {
        width: "80%",
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // Android için gölge efekti
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
    },
    modalButton: {
        width: "100%",
        paddingVertical: 12,
        backgroundColor: "#3498db",
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    repeatButton: {
        backgroundColor: "#2ecc71", // Yeşil buton (Eğitimi Tekrarla)
    },
    modalButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

