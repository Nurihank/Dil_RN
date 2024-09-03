import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OyunEkrani2(props) {
    const [soru, setSoru] = useState(0);
    const [kelimeler, setKelimeler] = useState([]);
    const [anaKelime, setAnaKelime] = useState(null);
    const [anakelimeler, setAnaKelimeler] = useState([]);
    const [devamEtButton, setDevamEtButton] = useState(false);
    const [yanlisKelimeler, setYanlisKelimeler] = useState([]);
    const [seciliSik, setSeciliSik] = useState(null);
    const [cevapDurumu, setCevapDurumu] = useState(null);
    const [userId, setUserId] = useState(null);

    const navigation = useNavigation();

    const getUserID = async () => {
        const id = await AsyncStorage.getItem("id");
        setUserId(id);
      };

    const DigerSoru = async (yanlisKelime) => {
        if (yanlisKelime) {
            setYanlisKelimeler(prev => [...prev, yanlisKelime]);
        }

        if (soru >= 2) { 
            Alert.alert(
                "Tebrikler!",
                "Testi bitirdin.",
                [
                  {
                    text: "Devam Et", 
                    onPress: () => {
                        navigation.navigate("Bottom");
                    },
                    style: "default"
                  }
                ]
            ); 
        }
        
        setSoru(soru + 1); 
        setDevamEtButton(false); 
        setSeciliSik(null); 
        setCevapDurumu(null); 
        const data = kelimeler;

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
    }

    useEffect(() => {
        if (soru >= 2) {
            console.log("Yanlış Kelimeler:", yanlisKelimeler); // Yanlış kelimeleri burada yazdırın
        }
    }, [yanlisKelimeler]);

    const TekrarDene = ()=>{
        setAnaKelime(anakelimeler[soru])
        setDevamEtButton(false); 
        setSeciliSik(null); 
        setCevapDurumu(null); 
        const data = kelimeler;

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
    }

    const KelimeleriGetir = async () => {
        try {
            const response = await api.get("/kullanici/oyun", {
                params: {
                    BolumID: props.route.params.id
                }
            });

            const data = response.data;
            setAnaKelimeler(response.data)
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
                setSoru(0); 
            }
                
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const SozlugeEkle = async(Kelime) => {
        console.log(Kelime.AnaKelimeID);
        console.log(userId)

        const response = await api.post("/kullanici/SozlugeKelimeEkleme",{
            KullaniciID:userId,
            AnaKelimeID:Kelime.AnaKelimeID
        })
        Alert.alert(response.data.message)
    }

    const CevapDogruMu = (cevap) => {
        if (cevap === anaKelime.value) {
            if (soru >= 2) { 
                Alert.alert(
                    "Tebrikler!",
                    "Testi bitirdin.",
                    [
                      {
                        text: "Devam Et", 
                        onPress: () => DigerSoru(),
                        style: "default"
                      }
                    ]
                ); 
            } else {
                setDevamEtButton(true);
            }
            setCevapDurumu('correct'); 
        } else {
            Alert.alert(
                "Yanlış Cevap!",
                "Lütfen cevabınızı kontrol edin.",
                [
                    {
                        text: "Tekrar Dene", 
                        onPress: () => TekrarDene(),
                        style: "default"
                    },
                    {
                        text: "Devam Et", 
                        onPress: () => DigerSoru(anaKelime.value),
                        style: "default"
                    }
                ]
            );
            setCevapDurumu('incorrect'); 
        }
        setSeciliSik(cevap); 
    };

    useFocusEffect(
        React.useCallback(() => {
            KelimeleriGetir();
            getUserID()
        }, [props.route.params.id])
    );

    useEffect(() => {
        if (kelimeler.length > 0 && soru < kelimeler.length) {
            setAnaKelime(anakelimeler[soru]); 
        }
    }, [soru, kelimeler]);

    const renderItem = ({ item }) => {
        const isSelected = item.value === seciliSik;
        const isCorrect = isSelected && cevapDurumu === 'correct';
        const isIncorrect = isSelected && cevapDurumu === 'incorrect';
        return (
            <TouchableOpacity 
                onPress={() => CevapDogruMu(item.value)} 
                style={[ 
                    styles.answerItem, 
                    isCorrect && styles.correctAnswer, 
                    isIncorrect && styles.incorrectAnswer
                ]}
            >
                <Text style={styles.answerText}>{item.ceviri}</Text>
            </TouchableOpacity>
        );
    };

    return ( 
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.questionCount}>{soru + 1}/3</Text>
                <TouchableOpacity onPress={() => SozlugeEkle(anaKelime)}>
                    <Text style={styles.title}>Sözlüğe Ekle</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.askContainer}>
                <Image source={require("../assets/question.png")} style={styles.image} />  
                {anaKelime && <Text style={styles.askText}>{anaKelime.value}</Text>}
            </View>
            <FlatList
                data={kelimeler}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.answerContainer}
                numColumns={2}
            />
            {devamEtButton 
                ?
                <TouchableOpacity onPress={() => DigerSoru()}>
                    <Image source={require("../assets/nextButton.png")} style={styles.nextButton}/>
                </TouchableOpacity>
                : 
                null
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e0f7fa", // Light Cyan
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    questionCount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#00796b', // Teal
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#00796b', // Teal
    },
    askContainer: {
        marginTop: 20,
        alignItems: "center",
        height: "40%",
        backgroundColor: "#ffffff", // White
        justifyContent: "center",
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
        flexDirection: "row"
    },
    image: {
        height: 120,
        width: 120,
        marginHorizontal: 10,
    },
    askText: {
        fontSize: 32,
        fontWeight: "700",
        color: "#000000", // Black
    },
    answerContainer: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    answerItem: {
        margin: 10,
        padding: 15,
        backgroundColor: '#00bcd4', // Cyan
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        width: '40%',
        alignItems: 'center',
    },
    answerText: {
        fontSize: 18,
        color: '#ffffff', // White
    },
    correctAnswer: {
        backgroundColor: '#4caf50', // Green
    },
    incorrectAnswer: {
        backgroundColor: '#f44336', // Red
    },
    nextButton: {
        height: 75,
        width: 75,
        left: 275,
        bottom: 25
    }
});
