import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import LottieView from 'lottie-react-native';
import * as Speech from 'expo-speech';
import api from '../../../api/api';
import UserModel from '../../../model/ModelUser';
import { useFocusEffect } from '@react-navigation/native';
import { GestureHandlerRootView, Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from "react-native-reanimated";

export default function DinlemeEgzersizScreen(route) {
    const animationRef = useRef(null);
    const [anaDilID, setAnaDilID] = useState();
    const [hangiDilID, setHangiDilID] = useState();
    const [meslekID, setMeslekID] = useState();
    const [Kelimeler, setKelimeler] = useState([]);
    const [anaKelime, setAnaKelime] = useState(null);
    const [secilenKelimeler, setSecilenKelimeler] = useState([]);
    const [secilenKelime, setSecilenKelime] = useState(null);
    const dropZoneY = useSharedValue(0);
    const dropZoneHeight = useSharedValue(0);

    const getUserInfo = async () => {
        const user = await UserModel.currentUser;
        setMeslekID(user[0].MeslekID);
        setHangiDilID(user[0].DilID);
        setAnaDilID(user[0].SectigiDilID);
    };

    const GunlukGorevTamamlama = async () => { /* normalde oyun başarılı oulunca kaydetcek */
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;

        const response = await api.post("/kullanici/GunlukGorevEgzersiz", {
            KullaniciID: route.route.params.id,
            Date: formattedDate
        })
        console.log(response.data.message)
        alert("Başarılı gunluk egzersiz")
    }

    useFocusEffect(
        useCallback(() => {
            getUserInfo();
        }, [])
    );

    useEffect(() => {
        if (anaDilID && hangiDilID && meslekID) {
            KelimeleriGetir();
            GunlukGorevTamamlama()
        }
    }, [anaDilID, hangiDilID, meslekID]);

    useEffect(() => {
        if (Kelimeler.length > 0) {
            AnaKelimeSec(Kelimeler);
        }
    }, [Kelimeler]);

    const KelimeyiSeslendirme = () => {
        if (anaKelime) {
            speakWord(anaKelime.Ceviri);
            if (animationRef.current) {
                animationRef.current.play();
            }
        }
    };

    const shuffleArray = (array) => {
        return [...array].sort(() => Math.random() - 0.5);
    };

    const KelimeleriGetir = async () => {
        try {
            const response = await api.get("/kullanici/dinlemeEgzersizi", {
                params: {
                    KullaniciID: route.route.params.id,
                    temelMi: route.route.params.egzersizTuru,
                    AnaDilID: anaDilID,
                    HangiDilID: hangiDilID,
                    MeslekID: meslekID
                }
            });

            if (response.data.message) {
                const karisikKelimeler = shuffleArray(response.data.message);
                setKelimeler(karisikKelimeler);
            }
        } catch (error) {
            console.error("Kelimeler alınırken hata oluştu:", error);
        }
    };

    const AnaKelimeSec = (kelimeler) => {
        if (kelimeler.length === 0) return;

        let anaKelime = kelimeler[Math.floor(Math.random() * kelimeler.length)];
        setAnaKelime(anaKelime);

        let secilenKelimeler = new Set([anaKelime]);
        while (secilenKelimeler.size < 8) {
            let rastgeleKelime = kelimeler[Math.floor(Math.random() * kelimeler.length)];
            secilenKelimeler.add(rastgeleKelime);
        }

        setSecilenKelimeler([...secilenKelimeler]);
    };

    const speakWord = (kelime) => {
        const options = {
            rate: 0.5,
            pitch: 1.1,
            language: 'en',
            onStart: () => console.log("Seslendirme başladı"),
            onDone: () => console.log("Seslendirme tamamlandı"),
        };
        Speech.speak(kelime, options);
    };

    return anaKelime ? (
        <GestureHandlerRootView style={styles.container}>
            {/* Ses Butonu */}
            <TouchableOpacity onPress={KelimeyiSeslendirme} style={styles.animationContainer}>
                <LottieView
                    source={require('../../../assets/animasyon/sound.json')}
                    loop={false}
                    style={styles.animation}
                />
            </TouchableOpacity>

            {/* Ana Kelime */}
            <Text style={styles.anaKelime}>{anaKelime?.Ceviri}</Text>

            {/* Hedef Bırakma Alanı */}
            <View
                style={styles.dropZone}
                onLayout={(event) => {
                    const { y, height } = event.nativeEvent.layout;
                    dropZoneY.value = y;
                    dropZoneHeight.value = height;
                }}
            >
                <Text style={styles.dropZoneText}>
                    {secilenKelime ? `Seçilen: ${secilenKelime}` : "Kelimeyi buraya bırak"}
                </Text>
            </View>

            {/* Sürüklenebilir Kelimeler */}
            <View style={styles.kelimelerContainer}>
                {secilenKelimeler.map((kelime, index) => (
                    <DraggableWord
                        key={index}
                        kelime={kelime}
                        setSecilenKelime={setSecilenKelime}
                        dropZoneY={dropZoneY}
                        dropZoneHeight={dropZoneHeight}
                    />
                ))}
            </View>
        </GestureHandlerRootView>
    ) : null;
}
const DraggableWord = ({ kelime, setSecilenKelime, dropZoneY, dropZoneHeight }) => {
    const translateY = useSharedValue(0);
    const translateX = useSharedValue(0);
    const isDropped = useSharedValue(false); // Kelimenin bırakıldığını takip et

    const gesture = Gesture.Pan()
        .onUpdate((event) => {
            if (!isDropped.value) {
                translateX.value = event.translationX;
                translateY.value = event.translationY;
            }
        })
        .onEnd((event) => {
            const droppedY = event.absoluteY; // Kelimenin bırakıldığı yerin Y konumu
            const dropZoneBottom = dropZoneY.value + dropZoneHeight.value; // Bırakma alanının alt sınırı
            const dropZoneTop = dropZoneY.value; // Bırakma alanının üst sınırı
            const dropZoneCenterX = event.absoluteX; // X koordinatını almak için event.absoluteX kullandık
            const deneme = event.absoluteX; // Kelimenin bırakıldığı yerin Y konumu
            console.log(deneme)
            console.log(droppedY)

            // Eğer bırakma alanı içinde bırakılmışsa
            if (droppedY >= dropZoneTop && droppedY <= dropZoneBottom) {
                runOnJS(setSecilenKelime)(kelime.Ceviri); // Kelimeyi set et
                isDropped.value = true; // Kelime bırakıld

                const kelimeWidth = 20;  // Kelimenin genişliği (istenilen boyut)
                const kelimeHeight = 12; // Kelimenin yüksekliği (istenilen boyut)

                // Başlangıçta kelimeyi sıfır noktasına yerleştir
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);

                // Sıfır noktasından animasyonla yeni koordinatlara yerleştir
                translateX.value = withSpring(100);
                translateY.value = withSpring(100);
            } else {
                // Eğer bırakma alanına gelmezse geri dön
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    }));

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.kelimeItem, animatedStyle]}>
                <Text style={styles.kelimeText}>{kelime.Ceviri}</Text>
            </Animated.View>
        </GestureDetector>
    );
};






const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f8f8f8'
    },
    animationContainer: {
        marginBottom: 20
    },
    animation: {
        width: 150,
        height: 150,
    },
    anaKelime: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#333'
    },
    dropZone: {
        width: "80%",
        height: 100,
        backgroundColor: "#dcdcdc",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginBottom: 40,
    },
    dropZoneText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    kelimelerContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
        marginVertical: 20,
    },
    kelimeItem: {
        width: "30%",
        height: 70,
        padding: 10,
        margin: 5,
        backgroundColor: '#ffcc00',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    kelimeText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#444'
    },
});