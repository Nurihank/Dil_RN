import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';

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

        let yeniYanlisKelimeler = yanlisKelimeler;
        if (yanlisKelime) {
            yeniYanlisKelimeler = [...yanlisKelimeler, yanlisKelime];
            setYanlisKelimeler(yeniYanlisKelimeler);  // Yanlış kelimeleri güncelle
        }

        if (soru >= 2) { 
            console.log(yeniYanlisKelimeler); // Yeni yanlış kelimeler listesini göster
            if(yeniYanlisKelimeler.length > 1){
                Alert.alert(
                    "Maalesef!",
                    "Bölümü Geçemediniz.",
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
            }else{
                Alert.alert(
                    "Tebrikler!",
                    "Bölümü Başarıyla Geçtiniz",
                    [
                      {
                        text: "Devam Et", 
                        onPress: () => {
                            BolumBasariylaBitti();
                        },
                        style: "default"
                      }
                    ]
                ); 
            }
        }
        else{
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
        
    }

    const BolumBasariylaBitti = async()=>{
        await api.post("/kullanici/GecilenBolumlerEkle",{
            KullaniciID:userId,
            BolumID:props.route.params.id
        })
       
        const response = await api.post("/kullanici/GecilenBolumler",{
            KullaniciID:userId,
            SezonID:props.route.params.SezonID
        })
        console.log(response.data.message)
        
        navigation.navigate("Bottom");
    }


    useEffect(() => { //en son bittiğinde göstermesi için yaptım
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
                DigerSoru() 
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
                <TouchableOpacity onPress={()=>speakWord(anaKelime.value)}>
                    <Image source={require("../assets/microphone.png")} style={{height:40,width:40}}/>

                </TouchableOpacity>
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
        backgroundColor: "#f5f5f5", // Light Gray
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    questionCount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0288d1', // Darker Blue
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0288d1', // Darker Blue
        textTransform: 'uppercase',
    },
    askContainer: {
        marginTop: 20,
        alignItems: "center",
        height: "40%",
        backgroundColor: "#ffffff", // White
        justifyContent: "center",
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
        flexDirection: "row"
    },
    image: {
        height: 120,
        width: 120,
        marginHorizontal: 10,
        resizeMode: 'contain',
    },
    askText: {
        fontSize: 34,
        fontWeight: "700",
        color: "#333333", // Dark Gray
        textAlign: 'center',
        marginHorizontal: 10,
    },
    answerContainer: {
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    answerItem: {
        margin: 10,
        padding: 15,
        backgroundColor: '#80d8ff', // Lighter Blue
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
        width: '45%',
        alignItems: 'center',
    },
    answerText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff', // White
    },
    correctAnswer: {
        backgroundColor: '#66bb6a', // Green
        shadowColor: "#388e3c",
    },
    incorrectAnswer: {
        backgroundColor: '#ef5350', // Red
        shadowColor: "#d32f2f",
    },
    nextButton: {
        height: 70,
        width: 70,
        alignSelf: 'flex-end',
        marginTop: 20,
    }
});

