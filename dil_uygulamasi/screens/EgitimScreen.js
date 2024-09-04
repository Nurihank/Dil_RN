import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';

const { width: screenWidth } = Dimensions.get('window');

export default function EgitimScreen(props) {
    const [kelimeler, setKelimeler] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0); // Track the current word index
    const [dil, setDil] = useState(false);
    const [userId, setUserId] = useState(null);

    const setUserID = async () => {
        const id = await AsyncStorage.getItem("id");
        setUserId(id);
    };
    const speakWord = (word) => {
        const options = {
                rate: 0.50,  // Adjust the speed (0.75 is slower than normal, where 1.0 is the default speed)
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
                    SeviyeID: props.route.params.id
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
    const SozlugeEkle = async(AnaKelimeID)=>{
        console.log(userId)
        console.log(AnaKelimeID)
        const response = await api.post("/kullanici/SozlugeKelimeEkleme",{
            KullaniciID:userId,
            AnaKelimeID:AnaKelimeID
        })
        console.log(response.data)
    }
    useEffect(() => {
        setUserID()
        KelimeleriGetir();
    }, []);

    const nextWord = () => {
        if (currentIndex < kelimeler.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const previousWord = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };
    console.log()
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => props.navigation.goBack()}>
                <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>

            {kelimeler.length > 0 && (
                <View style={styles.wordContainer}>
                    <Text style={styles.wordText}>
                        {dil ? kelimeler[currentIndex].Ceviri : kelimeler[currentIndex].Value}
                    </Text>
                    <TouchableOpacity onPress={() => speakWord(kelimeler[currentIndex].Value)}>
                        <Image source={require("../assets/microphone.png")} style={{height:40,width:40}}/>
                </TouchableOpacity>
                    </View>
                
            )}

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={previousWord} style={styles.navigationButton} disabled={currentIndex === 0}>
                    <Text style={styles.buttonText}>◀️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setDil(!dil)} style={styles.languageButton}>
                    <Text style={styles.buttonText}>
                        {dil ? 'Öğrenmek İstedigin Dilde Gör' : 'Kendi Dilinde Gör'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={nextWord} style={styles.navigationButton} disabled={currentIndex === kelimeler.length - 1}>
                    <Text style={styles.buttonText}>▶️</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={()=>SozlugeEkle(kelimeler[currentIndex].AnaKelimelerID)}>
                <Text style={styles.addButtonText}>Sözlüğe Ekle</Text>
            </TouchableOpacity>
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
    },
});

