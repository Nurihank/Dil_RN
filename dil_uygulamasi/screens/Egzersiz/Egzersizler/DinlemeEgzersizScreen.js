import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Modal } from 'react-native';
import LottieView from 'lottie-react-native';
import * as Speech from 'expo-speech';
import api from '../../../api/api';
import UserModel from '../../../model/ModelUser';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function DinlemeEgzersizScreen(route) {
    const animationRef = useRef(null);
    const [anaDilID, setAnaDilID] = useState();
    const [hangiDilID, setHangiDilID] = useState();
    const [meslekID, setMeslekID] = useState();
    const [Kelimeler, setKelimeler] = useState([]);
    const [anaKelime, setAnaKelime] = useState(null);
    const [soruIndex, setSoruIndex] = useState(0);
    const [siklar, setSiklar] = useState([])
    const [secili, setSecili] = useState(false)
    const [dogruCevaplar, setDogruCevaplar] = useState([])
    const [yanlisCevaplar, setYanlisCevaplar] = useState([])
    const [oyunDurdu, setOyunDurdu] = useState(false)

    const navigation = useNavigation()

    const [secilenKelime, setSecilenKelime] = useState(null)
    const getUserInfo = async () => {
        const user = await UserModel.currentUser;
        setMeslekID(user[0].MeslekID);
        setHangiDilID(user[0].DilID);
        setAnaDilID(user[0].SectigiDilID);
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

    const Soru = () => {
        console.log(route.route.params.egzersizId)
        console.log(soruIndex)
        if (soruIndex < 7) {
            setSoruIndex(soruIndex + 1)
            const anaKelime = Kelimeler[soruIndex]; // Ana kelimeyi belirle

            // Ana kelimeyi hariç tutarak rastgele 6 yanlış şık seç
            let yanlisSiklar = Kelimeler
                .filter(kelime => kelime !== anaKelime) // Ana kelime hariç
                .sort(() => Math.random() - 0.5) // Rastgele sıralama
                .slice(0, 8);

            // Ana kelimeyi ekleyip şıkları karıştır
            let siklar = [...yanlisSiklar, anaKelime].sort(() => Math.random() - 0.5);
            console.log(siklar)
            setAnaKelime(anaKelime);
            setSiklar(siklar);
        } else {
            GunlukGorevTamamlama()
            OyunBitti()
            console.log(dogruCevaplar)
            console.log(yanlisCevaplar)

        }
    };

    const OyunBitti = async () => {

        for (const kelime of dogruCevaplar) {
            try {
                const response = await api.post("/kullanici/Egzersiz", {
                    KullaniciID: route.route.params.id,
                    TemelMi: route.route.params.egzersizTuru,
                    EgzersizID: route.route.params.egzersizId,
                    KelimeID: kelime.id,
                    DogruMu: 1 // Doğru cevap olduğu için 1
                });
                console.log(response.data.message);
            } catch (error) {
                console.error("Doğru cevap gönderilirken hata oluştu:", error);
            }
        }

        // Yanlış cevaplanan kelimeleri gönder
        for (const kelime of yanlisCevaplar) {
            try {
                const response = await api.post("/kullanici/Egzersiz", {
                    KullaniciID: route.route.params.id,
                    TemelMi: route.route.params.egzersizTuru,
                    EgzersizID: route.route.params.egzersizId,
                    KelimeID: kelime.id,
                    DogruMu: 0 // Yanlış cevap olduğu için 0
                });
                console.log(response.data.message);
            } catch (error) {
                console.error("Yanlış cevap gönderilirken hata oluştu:", error);
            }
        }
        navigation.navigate("Egzersiz")
    }
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
        //  alert("Başarılı gunluk egzersiz")
    }

    const DogruMu = (kelime) => {
        setSecilenKelime(kelime)
        setSecili(true)
        if (kelime.Value == anaKelime.Value) {
            console.log("dogru")
            setDogruCevaplar((prev) => [...prev, kelime]); // Doğruysa diziye ekle
        } else {
            console.log("yanlis")
            setYanlisCevaplar((prev) => [...prev, kelime])
        }
    }

    const DevamEt = () => {
        setSecilenKelime(null)
        setSecili(false)
        Soru()
    }

    useFocusEffect(
        useCallback(() => {
            getUserInfo();
        }, [])
    );

    useEffect(() => {
        if (anaDilID && hangiDilID && meslekID) {
            KelimeleriGetir();
        }
    }, [anaDilID, hangiDilID, meslekID]);

    useEffect(() => {
        if (Kelimeler.length > 0) {
            Soru()
        }
    }, [Kelimeler]);

    const KelimeyiSeslendirme = () => {
        if (anaKelime) {
            speakWord(anaKelime.Value);
            if (animationRef.current) {
                animationRef.current.play();
            }
        }
    };

    const shuffleArray = (array) => {
        return [...array].sort(() => Math.random() - 0.5);
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
        <View style={styles.container}>
            <View>
                <TouchableOpacity onPress={() => setOyunDurdu(true)}>
                    <Image source={require("../../../assets/pause-button.png")} style={{ height: 40, width: 40, marginTop: 10 }} />
                </TouchableOpacity>
            </View>
            <Text>{soruIndex} / 7</Text>
            <TouchableOpacity onPress={KelimeyiSeslendirme} style={styles.animationContainer}>
                <LottieView
                    source={require('../../../assets/animasyon/sound.json')}
                    loop={false}
                    style={styles.animation}
                />
            </TouchableOpacity>

            <View style={styles.secilenKelimeContainer}>

                <View>
                    {secilenKelime ?
                        <Text style={{ color: "white", fontSize: 30, fontWeight: "bold" }}>
                            {secilenKelime?.Value}
                        </Text>
                        :
                        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>Duyduğun Kelimeyi Seç</Text>
                    }

                </View>

            </View>
            {/* FlatList ile 2'şerli şıkları göster */}
            <FlatList
                data={siklar}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}
                columnWrapperStyle={styles.row} // Satırları hizala
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.sik}
                        onPress={() => !secili && DogruMu(item)} // Şık seçildiyse tıklamayı engelle
                        disabled={secili} // Şık seçildikten sonra butonlar disabled olacak
                    >
                        <Text style={styles.sikText}>{item.Value}</Text>
                    </TouchableOpacity>
                )}
            />
            {
                secilenKelime ?
                    <View>
                        <TouchableOpacity onPress={() => DevamEt()}>
                            <Image source={require("../../../assets/devam.png")} style={{ height: 75, width: 75, marginBottom: 170, marginLeft: 250 }} />
                        </TouchableOpacity>
                    </View>
                    :
                    null
            }
            <Modal
                visible={oyunDurdu}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>⏸️ Oyun Durdu</Text>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={()=>setOyunDurdu(!oyunDurdu)} // Devam etme fonksiyonunu buraya ekleyebilirsin
                        >
                            <Text style={styles.buttonText}>▶️ Devam Et</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: '#FF4C4C' }]}
                            onPress={()=>navigation.goBack()} // Çıkış fonksiyonunu buraya ekleyebilirsin
                        >
                            <Text style={styles.buttonText}>❌ Çıkış Yap</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>

    ) : null;


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f8f8',
        marginTop: 100
    },
    animationContainer: {
        marginBottom: 20
    },
    animation: {
        width: 150,
        height: 150,
    },
    anaKelime: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
    },
    sik: {
        flex: 1,
        margin: 5,
        paddingVertical: 15,
        borderRadius: 10,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3, // Android gölge efekti
        shadowColor: '#000', // iOS gölge efekti
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    sikText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    secilenKelimeContainer: {
        width: 250,
        height: 70,
        backgroundColor: "red",
        marginBottom: 20,
        alignItems: "center",
        justifyContent: "center"
    }, modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Şeffaf arka plan efekti
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5, // Android için gölge efekti
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    button: {
        width: '100%',
        paddingVertical: 12,
        backgroundColor: '#4CAF50', // Yeşil devam et butonu
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
