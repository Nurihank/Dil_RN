import { Alert, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { Button, ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons'; // İkonlar için
import FontAwesome from '@expo/vector-icons/FontAwesome';
export default function OyunEkrani2(props) {
    const [soru, setSoru] = useState(0);
    const [kelimeler, setKelimeler] = useState([]);
    const [anaKelime, setAnaKelime] = useState("");
    const [anakelimeler, setAnaKelimeler] = useState([]);
    const [devamEtButton, setDevamEtButton] = useState(false);
    const [yanlisKelimeler, setYanlisKelimeler] = useState([]);
    const [dogruKelimeler, setDogruKelimeler] = useState([]);
    const [dogruYüzdesi, setDogruYüzdesi] = useState(1);
    const [seciliSik, setSeciliSik] = useState(null);
    const [cevapDurumu, setCevapDurumu] = useState(null);
    const [userId, setUserId] = useState(null);
    const [sozlugeEkliMi, setSozlugeEkliMi] = useState({});
    const [soruAlertModal, setSoruAlertModal] = useState(false);
    const [basarisizOyunSonuAlertModal, setBasarisizOyunSonuAlertModal] = useState(false);
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
            if (yeniYanlisKelimeler.length > 1) {
                setBasarisizOyunSonuAlertModal(true)
            } else {
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
        else {
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

    const BolumBasariylaBitti = async () => {
        const response = await api.post("/kullanici/GecilenBolumlerEkle", {
            KullaniciID: userId,
            BolumID: props.route.params.BolumID
        })
        if (response.data.message == "succes") {
            const sezonunBittiMi = await api.get("/kullanici/SezonBittiMiKontrol", {
                params: {
                    KullaniciID: userId,
                    SezonID: props.route.params.SezonID
                }
            })
            if (sezonunBittiMi.data.sezonBittiMi) {
                const sezonEkle = await api.post("/kullanici/GecilenSezonEkle", {
                    KullaniciID: userId,
                    SezonID: props.route.params.SezonID
                })
                console.log("sezon ekleme işi = " + sezonEkle.data)

            }
            console.log("sezon bitti mi  = " + sezonunBittiMi.data.sezonBittiMi)
            navigation.replace("HomeScreen");
        }
        //önceden oynadıysa ve leveli  geçtiyse buraya girecek
        navigation.replace("HomeScreen")
    }


    useEffect(() => { //en son bittiğinde göstermesi için yaptım
        if (soru >= 2) {
            console.log("Yanlış Kelimeler:", yanlisKelimeler); // Yanlış kelimeleri burada yazdırın
            console.log("Dogru Kelimeler:", dogruKelimeler); // dogru kelimeleri burada yazdırın
        }
    }, [yanlisKelimeler, dogruKelimeler]);


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

    const SozlugeEkle = async (Kelime) => {

        const response = await api.post("/kullanici/SozlugeKelimeEkleme", {
            KullaniciID: userId,
            AnaKelimeID: Kelime.AnaKelimeID
        })
        Alert.alert(response.data.message)
    }

   
   
    const CevapDogruMu = (cevap) => {

        let yeniDogruKelimeler = dogruKelimeler
        if (cevap.value === anaKelime.value) {
            setDogruYüzdesi(dogruYüzdesi + 33)
            if (cevap) {
                yeniDogruKelimeler = [...dogruKelimeler, cevap];
                setDogruKelimeler(yeniDogruKelimeler);  // Yanlış kelimeleri güncelle
            }
            console.log(yeniDogruKelimeler)
            if (soru >= 2) {
                DigerSoru()
            } else {
                setDevamEtButton(true); //eğer son soru değilse devam et buttonu aktif oluyo
            }
            setCevapDurumu('correct');  //bu da işaretlediğin cevabın rengini gösteriyor
        } else {
            setSoruAlertModal(true)
            setCevapDurumu('incorrect'); //bu da işaretlediğin cevabın rengini gösteriyor
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
        const isSelected = item === seciliSik;
        const isCorrect = isSelected && cevapDurumu === 'correct';
        const isIncorrect = isSelected && cevapDurumu === 'incorrect';
        return (
            <TouchableOpacity
                onPress={() => CevapDogruMu(item)}
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
    useEffect(() => {
        const checkSozlugeEkliMi = async () => {
            let statusMap = {};
            for (let item of yanlisKelimeler) {
                const response = await api.get("/kullanici/SozlugeEkliMi", {
                    params: {
                        KullaniciID: userId,
                        KelimeID: item.AnaKelimeID
                    }
                });
                statusMap[item.AnaKelimeID] = response.data;
            }
            setSozlugeEkliMi(statusMap); //{"10": false, "9": true} bu şekilde ekliyor önemli
        };

        checkSozlugeEkliMi();
    }, [yanlisKelimeler]);
    return (
        <View style={styles.container}>
            <View style={styles.progressBarContainer}>
                <ProgressBar progress={dogruYüzdesi / 100} style={styles.progressBar} />
                <View style={styles.progressMarker} />
            </View>

            <View style={styles.askContainer}>
                <Image source={require("../assets/question.png")} style={styles.image} />
                {anaKelime && <Text style={styles.askText}>{anaKelime.value}</Text>}
                <TouchableOpacity onPress={() => speakWord(anaKelime.value)}>
                    <Image source={require("../assets/microphone.png")} style={{ height: 40, width: 40 }} />
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
                    <Image source={require("../assets/nextButton.png")} style={styles.nextButton} />
                </TouchableOpacity>
                : null
            }
            <Modal /* kelimeyi bilemeyince */
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
                            <TouchableOpacity style={styles.alertButton} onPress={() => DigerSoru(anaKelime)}>
                                <Text style={styles.buttonText}>Devam Et</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.alertButton} onPress={() => SozlugeEkle(anaKelime)}>
                                <Text style={styles.buttonText}>Sözlüğe Ekle</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </Modal>

            <Modal  /* bölüm basarisiz olunca */
                visible={basarisizOyunSonuAlertModal}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.alertText}>Maalesef Bölümü Geçemediniz!</Text>

                        <TouchableOpacity style={styles.button} onPress={() => navigation.replace("HomeScreen")}>
                            <Icon name="home" size={24} color="#fff" style={styles.icon} />
                            <Text style={styles.buttonText}>Ana Sayfaya Dön</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={()=> navigation.replace("OyunEkrani2")}>
                            <Icon name="refresh" size={24} color="#fff" style={styles.icon} />
                            <Text style={styles.buttonText}>Tekrar Dene</Text>
                        </TouchableOpacity>

                        {yanlisKelimeler.length > 0 && (
                            <View>
                                <Text>
                                    Yanlis Kelimeler
                                </Text>
                                <FlatList
                                    data={yanlisKelimeler}
                                    keyExtractor={(item) => item.AnaKelimeID.toString()}
                                    renderItem={({ item }) => {
                                        const isEkli = sozlugeEkliMi[item.AnaKelimeID];
                                        return (
                                            <View style={styles.listItem}>
                                                {isEkli ? (
                                                    <View style={{ flexDirection: "row" }}>
                                                        <Icon name="close-circle" size={20} color="#e74c3c" style={styles.listIcon} />
                                                        <Text style={styles.listText}>{item.value}</Text>
                                                            <FontAwesome name="check-circle" size={24} color="black" />                                                       
                                                    </View>
                                                ) : (
                                                    <View style={{ flexDirection: "row" }}>
                                                        <Icon name="close-circle" size={20} color="#e74c3c" style={styles.listIcon} />
                                                        <Text style={styles.listText}>{item.value}</Text>
                                                        <TouchableOpacity onPress={()=>SozlugeEkle(item)}>
                                                                <FontAwesome name="plus" size={24} color="green" />
                                                        </TouchableOpacity>
                                                    </View>
                                                )}
                                            </View>
                                        );
                                    }}
                                />
                            </View>

                        )}

                        {dogruKelimeler.length > 0 && (
                            <View>
                                <Text>
                                    Doğru kelimeler
                                </Text>
                                <FlatList
                                    data={dogruKelimeler}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <View style={styles.listItem}>
                                            <Icon name="checkmark-circle" size={20} color="#2ecc71" style={styles.listIcon} />
                                            <Text style={styles.listText}>{item.value}</Text>
                                        </View>
                                    )}
                                />
                            </View>

                        )}
                        <ProgressBar progress={dogruYüzdesi / 100} style={[styles.progressBar, { marginTop: 15 }]} />
                        <Text>%{dogruYüzdesi} başarılı</Text>
                    </View>

                </View>

            </Modal>
        </View>

    );

}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center', // Modal'ı dikeyde ortalamak için
        alignItems: 'center', // Modal'ı yatayda ortalamak için
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Arka planın karartılması
        padding: 20, // İçerik kenar boşluğu
    },
    modalContent: {
        width: '90%', // Ekranın %90'ı kadar genişlik
        backgroundColor: 'white', // Beyaz arka plan
        borderRadius: 15, // Köşeleri yuvarlat
        padding: 25, // İçerik etrafında boşluk
        shadowColor: '#000', // Gölge rengi
        shadowOffset: { width: 0, height: 4 }, // Gölge konumu
        shadowOpacity: 0.25, // Gölge opaklığı
        shadowRadius: 4, // Gölge yayılma oranı
        elevation: 8, // Android için gölge
    },
    alertText: {
        fontSize: 20, // Yazı boyutu
        fontWeight: 'bold', // Kalın yazı
        color: '#333', // Yazı rengi
        marginBottom: 20, // Başlık ile butonlar arası boşluk
        textAlign: 'center', // Ortalanmış başlık
    },
    button: {
        flexDirection: 'row', // İkon ve yazı yan yana
        alignItems: 'center', // Dikeyde ortalanmış içerik
        backgroundColor: '#2980b9', // Mavi buton arka planı
        padding: 12, // İçerik etrafında boşluk
        borderRadius: 8, // Köşeleri yuvarlat
        marginVertical: 10, // Butonlar arasında dikey boşluk
        width: '100%', // Butonun genişliği ekranı kaplasın
        justifyContent: 'center', // İkon ve yazı ortalanmış olsun
    },
    buttonText: {
        color: '#fff', // Beyaz yazı rengi
        fontSize: 16, // Yazı boyutu
        fontWeight: 'bold', // Kalın yazı
        marginLeft: 10, // İkon ile yazı arasında boşluk
    },
    icon: {
        marginRight: 10, // İkonun yazıdan boşluk bırakması
    },
    listItem: {
        flexDirection: 'row', // Yan yana içerik
        alignItems: 'center', // Dikeyde ortalanmış içerik
        padding: 10, // İçerik etrafında boşluk
        marginVertical: 5, // Her bir liste elemanı arasında dikey boşluk
        backgroundColor: '#ecf0f1', // Hafif gri arka plan
        borderRadius: 8, // Köşeleri yuvarlat
        width: '100%', // Liste elemanlarının genişliği ekranı kaplasın
    },
    listText: {
        fontSize: 16, // Yazı boyutu
        marginLeft: 10, // İkon ile yazı arasında boşluk
        color: '#333', // Yazı rengi
    },
    listIcon: {
        marginRight: 10, // İkonun yazıdan boşluk bırakması
    },
    container: {
        flex: 1,
        backgroundColor: "#ecf0f1", // Daha açık bir arka plan rengi
        padding: 20,
    },
    progressBarContainer: {
        marginTop: 35,
        marginBottom: 20,
    },
    progressMarker: {
        position: 'absolute',
        top: 0,
        left: '50%',
        width: 5,
        height: '55%',
        backgroundColor: 'red',
        borderRadius: 50,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#e74c3c', // Koyu kırmızı
        textTransform: 'uppercase',
    },
    askContainer: {
        marginTop: 20,
        alignItems: "center",
        height: "40%",
        backgroundColor: "#ffffff",
        justifyContent: "center",
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
        flexDirection: "row",
        position: 'relative',
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
        color: "#333333",
        textAlign: 'center',
        marginHorizontal: 10,
    },
    sozlukButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#2ecc71', // Yeşil arka plan
        padding: 10,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 8,
    },
    answerContainer: {
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    answerItem: {
        margin: 10,
        padding: 15,
        backgroundColor: '#3498db', // Daha canlı mavi
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 8,
        width: '45%',
        alignItems: 'center',
    },
    answerText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
    },
    correctAnswer: {
        backgroundColor: '#27ae60', // Canlı yeşil
        shadowColor: "#2ecc71",
    },
    incorrectAnswer: {
        backgroundColor: '#c0392b', // Canlı kırmızı
        shadowColor: "#e74c3c",
    },
    nextButton: {
        height: 70,
        width: 70,
        alignSelf: 'flex-end',
        marginTop: 20,
    },
    progressBar: {
        width: '100%',
        height: 25,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#2980b9',
        marginBottom: 20,
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 8,
    },
    alertButtonGroup: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    alertButton: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#2980b9',
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

