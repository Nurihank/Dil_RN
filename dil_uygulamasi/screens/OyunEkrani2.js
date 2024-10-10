import { Alert, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { Button, ProgressBar } from 'react-native-paper';

export default function OyunEkrani2(props) {
    const [soru, setSoru] = useState(0);
    const [kelimeler, setKelimeler] = useState([]);
    const [anaKelime, setAnaKelime] = useState("");
    const [anakelimeler, setAnaKelimeler] = useState([]);
    const [devamEtButton, setDevamEtButton] = useState(false);
    const [yanlisKelimeler, setYanlisKelimeler] = useState([]);
    const [dogruYüzdesi,setDogruYüzdesi] = useState(0);
    const [seciliSik, setSeciliSik] = useState(null);
    const [cevapDurumu, setCevapDurumu] = useState(null);
    const [userId, setUserId] = useState(null);
    const [soruAlertModal, setSoruAlertModal] = useState(false);
    const [oyunSonuAlertModal, setOyunSonuAlertModal] = useState(false);
    const [bolumuGectinMi,setBolumuGectinMi] = useState(false)
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
        setSoruAlertModal(false)
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
        const response = await api.post("/kullanici/GecilenBolumlerEkle",{
            KullaniciID:userId,
            BolumID:props.route.params.BolumID
        })
        console.log(response.data.message)
        if(response.data.message == "succes"){

            const sezonunBittiMi = await api.get("/kullanici/SezonBittiMiKontrol",{
                params:{
                    KullaniciID:userId,
                    SezonID:props.route.params.SezonID
                }
            })
            if(sezonunBittiMi.data.sezonBittiMi){
                const sezonEkle = await api.post("/kullanici/GecilenSezonEkle",{
                    KullaniciID:userId,
                    SezonID:props.route.params.SezonID
                })
                console.log("sezon ekleme işi = "+sezonEkle.data)
                
            }
            console.log("sezon bitti mi  = "+sezonunBittiMi.data.sezonBittiMi)

            navigation.replace("HomeScreen");
        }
        //önceden oynadıysa ve leveli  geçtiyse buraya girecek
        navigation.replace("HomeScreen")
    }


    useEffect(() => { //en son bittiğinde göstermesi için yaptım
        if (soru >= 2) {
            console.log("Yanlış Kelimeler:", yanlisKelimeler); // Yanlış kelimeleri burada yazdırın
        }
    }, [yanlisKelimeler]);

    const KelimeleriGetir = async () => {
        try {
            const response = await api.get("/kullanici/oyun", {
                params: {
                    BolumID: props.route.params.BolumID
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
        console.log(anaKelime)
        if (cevap === anaKelime.value) {
            setDogruYüzdesi(dogruYüzdesi+33)
            console.log(dogruYüzdesi)
            if (soru >= 2) { 
                DigerSoru() 
            } else {
                setDevamEtButton(true);
            }
            setCevapDurumu('correct'); 
        } else {
            setSoruAlertModal(true)
            setCevapDurumu('incorrect'); 
        }
        setSeciliSik(cevap); 
    };

    useFocusEffect(
        React.useCallback(() => {
            KelimeleriGetir();
            getUserID()
        }, [props.route.params.BolumID])
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
            <View style={styles.progressBarContainer}>
                <ProgressBar progress={dogruYüzdesi/100} style={styles.progressBar} />
                <View style={styles.progressMarker} />
            </View>
    
            <View style={styles.askContainer}>
                <Image source={require("../assets/question.png")} style={styles.image} />  
                {anaKelime && <Text style={styles.askText}>{anaKelime.value}</Text>}
                <TouchableOpacity onPress={()=>speakWord(anaKelime.value)}>
                    <Image source={require("../assets/microphone.png")} style={{height:40,width:40}}/>
                </TouchableOpacity>
                    <TouchableOpacity onPress={() => SozlugeEkle(anaKelime)} style={styles.sozlukButton}>
                    <Text style={styles.title}>Sözlüğe Ekle</Text>
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
                ? <TouchableOpacity onPress={() => DigerSoru()}>
                    <Image source={require("../assets/nextButton.png")} style={styles.nextButton}/>
                  </TouchableOpacity>
                : null
            }
            <Modal
                visible={soruAlertModal}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                <View>
                    <Text>
                        Yanlış Cevap
                    </Text>
                    <Text>
                        {anaKelime.value}   kelimesi    {anaKelime.ceviri} demek

                    </Text>
                </View>                      
                    <View style={styles.alertButtonGroup}>
                    <TouchableOpacity style={styles.alertButton} onPress={() => DigerSoru(anaKelime.value)}>
                        <Text style={styles.buttonText}>Devam Et</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.alertButton} onPress={() => SozlugeEkle(anaKelime)}>
                        <Text style={styles.buttonText}>Sözlüğe Ekle</Text>
                    </TouchableOpacity>
                    
                    </View>
                </View>
                </View>
            </Modal>
        </View>
    );
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5", // Light Gray
        padding: 20,
    },
    progressBarContainer:{
        marginTop:35
    },
    progressMarker: {
        position: 'absolute',
        top: 0,
        left: '65%', // Progresyon yüzde 35'te olduğu için işareti buraya yerleştiriyoruz
        width: 5, // İşaretin genişliği
        height: '55%', // İşaretin barın yüksekliğine eşit olması için
        backgroundColor: 'red', // İşaretin rengi
        borderRadius:100
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red', // Darker Blue
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
        flexDirection: "row",
        position: 'relative', // Bu gerekli, çünkü sözlük butonunu sağ üstte konumlandıracağız
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
    sozlukButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#0288d1', // Blue background for button
        padding: 10,
        borderRadius: 8,
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
    },
    progressBar: {
        width: '100%',
        height: 25, // Barın yüksekliği
        borderRadius: 10, // Barın köşelerini yuvarlatmak için
        borderWidth: 2, // Çizgi kalınlığı
        borderColor: '#0288d1', // Çizgi rengi
        marginBottom: 20, // ProgressBar ile askContainer arası boşluk
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 8,
      },
      alertButtonGroup: {
        flexDirection: 'column',
        justifyContent: 'space-between',
      },
      alertButton: {
        marginTop: 12,
        padding: 10,
        backgroundColor: '#0288d1', // Buton arka plan rengi
        borderRadius: 8,
        alignItems: 'center',
      },
      buttonText: {
        color: 'white', // Yazı rengi
        fontSize: 16,
        fontWeight: 'bold',
      },
});
