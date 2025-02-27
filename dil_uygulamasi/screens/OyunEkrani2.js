import { Alert, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { Button, ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons'; // İkonlar için
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FlashMessage, { showMessage } from 'react-native-flash-message';

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
    const [userId, setUserId] = useState(null);
    const [sozlugeEkliMi, setSozlugeEkliMi] = useState({});
    const [basarisizOyunSonuAlertModal, setBasarisizOyunSonuAlertModal] = useState(false);
    const [basariliOyunSonuAlertModal, setBasariliOyunSonuAlertModal] = useState(false);
    const [sozlugeEkleResponse, setSozlugeEkleResponse] = useState("");
    const [secili, setSecili] = useState(false)
    const [oyunDurdu, setOyunDurdu] = useState(false)
    const navigation = useNavigation();
    const [cevap, setCevap] = useState(null)
    const [bolumBittiMi,setBolumBittiMi] =useState(false)

    const getUserID = async () => {
        const id = await AsyncStorage.getItem("id");
        setUserId(id);
    };

    const yanlisKelimeleriKaydetme = (kelimeler) => {
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;

        kelimeler.forEach(kelime => {
            const kaydet = async () => {
                const response = await api.post("/kullanici/yanlisBilinenKelime", {
                    KelimeID: kelime.AnaKelimeID,
                    KullaniciID: userId,
                    TemelMi: 0,
                    Date: formattedDate
                })
            }
            console.log(kelime)
            kaydet()
        });
    }

    const DigerSoru = async () => {
        setSeciliSik(null);
        setSecili(null)
       
        if (soru >= 2) {

            if (yanlisKelimeler.length > 1) {
                BolumBitti(0)
                setBasarisizOyunSonuAlertModal(true)
            } else {
                BolumBitti(1)
                setBasariliOyunSonuAlertModal(true)
            }
        }
        else {
            setSoru(soru + 1);
            setDevamEtButton(false);
            setSeciliSik(null);
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

    const BolumBitti = async (GectiMi) => {
        const currentDate = new Date();
        
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        
        const response = await api.post("/kullanici/OynananOyun", {
            KullaniciID: userId,
            BolumID: props.route.params.BolumID,
            Date: formattedDate,
            GectiMi: GectiMi
        })
        if (response.data.message == "succes") {
            setBolumBittiMi(true)
            console.log(yanlisKelimeler.length)
            const sezonunBittiMi = await api.get("/kullanici/SezonBittiMiKontrol", {
                params: {
                    KullaniciID: userId,
                    SezonID: props.route.params.SezonID
                }
            })
            if (sezonunBittiMi.data.sezonBittiMi) {
                const sezonEkle = await api.post("/kullanici/GecilenSezonEkle", {
                    KullaniciID: userId,
                    SezonID: props.route.params.SezonID,
                    Date: formattedDate
                })
                if (sezonEkle.data.message == "succes") {
                    const seviyeBittiMiKontrol = await api.get("/kullanici/SeviyeBittiMiKontrol", {
                        params: {
                            KullaniciID: userId,
                            SeviyeID: props.route.params.SeviyeID
                        }
                    })
                    if (seviyeBittiMiKontrol.data.seviyeBittiMi) {
                        const seviyeEkle = await api.post("/kullanici/GecilenSeviyeEkle", {
                            KullaniciID: userId,
                            SeviyeID: props.route.params.SeviyeID,
                            Date: formattedDate
                        })
                    }
                }
            }
        }else{
            console.log(yanlisKelimeler.length)
        }
    }

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
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;

        const response = await api.post("/kullanici/SozlugeKelimeEkleme", {
            KullaniciID: userId,
            AnaKelimeID: Kelime.AnaKelimeID,
            Date: formattedDate
        })

        showToast(response.data.message)
        setSozlugeEkleResponse(response.data.message)
    }
    const showToast = (message) => {
        showMessage({
            message: 'Heyyy !!',
            description: message,
            type: 'danger', // success, danger, warning, info
            position: 'top', // Mesaj pozisyonu
            floating: true, // Sağ üst köşe için floating kullanılmalı
            duration: 3000, // Mesajın görünme süresi (ms)
            style: {
                borderRadius: 10, // Köşe yuvarlama
                marginTop: 20, // Ekranın üstünden boşluk
                marginHorizontal: 10, // Yanlardan boşluk
            },
            textStyle: {
                textAlign: 'center', // Metni ortalama
            },
        });
    };
    const CevapDogruMu = (cevap) => {
        setSecili(true)
        setDevamEtButton(true)
        let yeniDogruKelimeler = dogruKelimeler;    

        if (cevap.value === anaKelime.value) {
            console.log("doğru")
            setDogruYüzdesi(dogruYüzdesi + 33)
            setCevap(true)
            if (cevap) {
                yeniDogruKelimeler = [...dogruKelimeler, anaKelime];
                setDogruKelimeler(yeniDogruKelimeler);  // Yanlış kelimeleri güncelle
            }
            if (soru >= 2) {
                DigerSoru()
            } else {
                setDevamEtButton(true); //eğer son soru değilse devam et buttonu aktif oluyo
            }
        } else {
            setYanlisKelimeler(prevYanlisKelimeler =>[...prevYanlisKelimeler, anaKelime] );
            setCevap(false)
            if (cevap) {
                if (soru >= 2) {
                    DigerSoru(); 
                } else {
                    setDevamEtButton(true);
                }
            }
            
            
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
        const isCorrect =  secili && item === anaKelime ; // Doğru cevabı sadece seçim yapıldıysa göster
        const isIncorrect = isSelected && item !== anaKelime; // Yanlış şık seçildiyse kırmızı yap
    
        return (
            <TouchableOpacity
                onPress={() => CevapDogruMu(item)}
                disabled={secili} // Şık seçildikten sonra butonlar devre dışı olacak
                style={[
                    styles.answerItem,
                    isCorrect && styles.correctAnswer, // Doğru şık sadece seçim sonrası yeşil olacak
                    isIncorrect && styles.incorrectAnswer // Yanlış seçilen şık kırmızı olacak
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
  
        if(bolumBittiMi){
            yanlisKelimeleriKaydetme(yanlisKelimeler)
        }
    }, [yanlisKelimeler,bolumBittiMi]);

    return (
        <View style={styles.container}>
            <FlashMessage position="top" />
            <View>
                <TouchableOpacity onPress={() => setOyunDurdu(true)}>
                    <Image source={require("../assets/pause-button.png")} style={{ height: 40, width: 40, marginTop: 10 }} />
                </TouchableOpacity>
            </View>
            <View style={styles.progressBarContainer}>
                <ProgressBar progress={dogruYüzdesi / 100} style={styles.progressBar} />
                <View style={styles.progressMarker} />
            </View>

            <View style={styles.askContainer}>
                <Text style={{ right: 140, bottom: 37, fontSize: 25, color: "gray", fontWeight: "bold" }}>{soru + 1} / 3</Text>
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
                ? 
                <View>
                <TouchableOpacity 
                onPress={() => DigerSoru()} 
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: cevap == true ? "green" : cevap == false ? "red" :null, 
                    padding: 15,
                    alignItems: "center",
                    borderRadius:15
                }}
            >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>DEVAM ET</Text>
            </TouchableOpacity>
                </View>
                : null
            }

            <Modal
                visible={oyunDurdu}
                transparent={true}
                animationType="slide">

                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={{
                            fontSize: 27,
                            fontWeight: 'bold',
                            color: '#FF4C4C', // Kırmızı renk (Dikkat çekici)
                            textAlign: 'center',
                         
                        }}>Oyunu Durdurdun</Text>
                        <View style={styles.alertButtonGroup}>
                            <TouchableOpacity style={styles.alertButton} onPress={() => setOyunDurdu(!oyunDurdu)}>
                                <Text style={styles.buttonText}>Devam Et</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.alertButton} onPress={() => navigation.replace("OyunEkrani", { BolumID: props.route.params.BolumID, SezonID: props.route.params.SezonID, SeviyeID: props.route.params.SeviyeID })}>
                                <Text style={styles.buttonText}>Bölümü Tekrarla</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.alertButton} onPress={() => navigation.goBack()}>
                                <Text style={styles.buttonText}>Çıkış Yap</Text>
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

                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Bottom")}
                        >
                            <Icon name="home" size={24} color="#fff" style={styles.icon} />
                            <Text style={styles.buttonText}>Ana Sayfaya Dön</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={() => navigation.replace("OyunEkrani", { BolumID: props.route.params.BolumID, SezonID: props.route.params.SezonID, SeviyeID: props.route.params.SeviyeID })}>
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
                                                        <TouchableOpacity onPress={() => SozlugeEkle(item)}>
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
                        <ProgressBar progress={dogruYüzdesi / 100} style={[styles.progressBar, { marginTop: 15 }]} />
                        <Text>%{dogruYüzdesi} başarılı</Text>
                    </View>

                </View>
            </Modal>
            <Modal   /* Bölüm basarili olunca */
                visible={basariliOyunSonuAlertModal}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.alertText}>
                            Tebriklerler Başarılısın
                        </Text>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Bottom")}                        >
                            <Icon name="home" size={24} color="#fff" style={styles.icon} />
                            <Text style={styles.buttonText}>Devam Et</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.replace("OyunEkrani", { BolumID: props.route.params.BolumID, SezonID: props.route.params.SezonID, SeviyeID: props.route.params.SeviyeID })}>
                            <Icon name="refresh" size={24} color="#fff" style={styles.icon} />
                            <Text style={styles.buttonText}>Tekrar Oyna</Text>
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
                                                        <TouchableOpacity onPress={() => SozlugeEkle(item)}>
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
                        <ProgressBar progress={dogruYüzdesi / 100} style={[styles.progressBar, { marginTop: 15 }]} />
                        <Text>%{dogruYüzdesi} başarılı  </Text>
                        <Text>Tebrik Ederim</Text>

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
        flexDirection: "column",  // İkon ve metin dikey hizalama
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
        maxWidth: '90%', // Ekranda taşmayı önlemek için genişlik sınırı
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

