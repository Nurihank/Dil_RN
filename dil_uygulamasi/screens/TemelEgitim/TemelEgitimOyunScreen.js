import { Animated, StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { useNavigation } from '@react-navigation/native';
import { Modal } from 'react-native-paper';
import * as Speech from 'expo-speech';

export default function TemelEgitimOyunScreen(route) {
    const [kelimeler, setKelimeler] = useState([]);
    const [anaKelime, setAnaKelime] = useState(null);
    const [anaKelimeler, setAnaKelimeler] = useState(null);
    const [seciliCevap, setSeciliCevap] = useState(null);
    const [soruIndex, setSoruIndex] = useState(0);
    const [cevapDurumu, setCevapDurumu] = useState()
    const [yanlisKelimeler, setYanlisKelimeler] = useState([]);
    const [devamEtButton, setDevamEtButton] = useState(false)
    const [oyunBasariliBittiModal, setOyunBasariliBittiModal] = useState(false)
    const [oyunBasarisizBittiModal, setOyunBasarisizBittiModal] = useState(false)
    const [oyunDurdu, setOyunDurdu] = useState(false)
    const [bolumBittiMi, setBolumBittiMi] = useState(false)
    const [secili, setSecili] = useState(null)

    const navigation = useNavigation()


    const digerSoru = () => {
        setCevapDurumu(null)
        setSeciliCevap(null)
        setSecili(null)
        setDevamEtButton(false)
        setSoruIndex(soruIndex + 1);

        if (soruIndex >= 2) {
            setBolumBittiMi(true)
        } else {
            setSoruIndex(soruIndex + 1);
            const data = kelimeler;
            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }
            const karisikKelimeler = shuffleArray([...data])
            setKelimeler(karisikKelimeler)
        }
    }

    const yanlisKelimeleriKaydetme = (kelimeler) => {
        console.log(kelimeler)
        kelimeler.forEach(kelime => {
            const kaydet = async () => {
                const response = await api.post("/kullanici/yanlisBilinenKelime", {
                    KelimeID: kelime.id,
                    KullaniciID: route.route.params.UserID,
                    TemelMi: 1
                })
                console.log(response.data.message)
            }
            console.log(kelime)
            kaydet()
        });
    }

    const BolumBitti = async (GectiMi) => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;

        const response = await api.post("/kullanici/OynananTemelOyun", {
            KullaniciID: route.route.params.UserID,
            BolumID: route.route.params.BolumID,
            KategoriID: route.route.params.KategoriID,
            Date: formattedDate,
            GectiMi: GectiMi
        })
    }

    const kelimeleriGetir = async () => {
        const response = await api.get("/kullanici/temelKelimeler", {
            params: {
                AnaDilID: route.route.params.AnaDilID,
                HangiDilID: route.route.params.HangiDilID,
                BolumID: route.route.params.BolumID
            }
        });
        const data = response.data.message;
        setAnaKelimeler(data);
        if (data && data.length > 0) {
            setAnaKelime(data[0]);
        }
        const karisikKelimeler = response.data.message.sort(() => Math.random() - 0.5);
        setKelimeler(karisikKelimeler);
    };

    const speakWord = (kelime) => {
        const options = {
            rate: 0.50,  // Adjust the speed (0.75 is slower than normal, where 1.0 is the default speed)
            pitch: 1.1,  // Adjust the pitch (1.0 is the default pitch)

            language: 'en',  // You can set the language here (e.g., 'en' for English)

            onStart: () => console.log("Speech started"),

            onDone: () => console.log("Speech finished"),
        }
        Speech.speak(kelime.value, options)
    }

    useEffect(() => {
        kelimeleriGetir();
    }, []);

    useEffect(() => {
        if (anaKelimeler && anaKelimeler.length > 0) {
            setAnaKelime(anaKelimeler[soruIndex]);
        }
    }, [soruIndex, kelimeler])

    const cevapDogruMu = (cevap) => {
        setSecili(true)
        if (anaKelime.value === cevap.value) {
            setCevapDurumu('correct');
            speakWord(cevap)
            if (soruIndex >= 2) {
                digerSoru();
            } else {
                setDevamEtButton(true);
            }
        } else {
            if (cevap) {
                console.log(anaKelime)
                setYanlisKelimeler(prevYanlisKelimeler => [...prevYanlisKelimeler, anaKelime])
                setCevapDurumu('incorrect');
            }
            if (soruIndex >= 2) {
                digerSoru();
            } else {
                setDevamEtButton(true);
            }
        }
        setSeciliCevap(cevap);
    };

    useEffect(() => {
        if (bolumBittiMi) {
            yanlisKelimeleriKaydetme(yanlisKelimeler)
            console.log(yanlisKelimeler.length)
            if (yanlisKelimeler.length > 1) {
                BolumBitti(false)
                setOyunBasarisizBittiModal(true)
            } else {
                BolumBitti(true)
                setOyunBasariliBittiModal(true)
            }
        }
    }, [bolumBittiMi, yanlisKelimeler])

    useEffect(() => {
        if (seciliCevap) {
            cevapDogruMu(seciliCevap)
        }
    }, [seciliCevap])

    const renderItem = ({ item }) => {
        const isSelected = item === seciliCevap
        const isCorrect = isSelected && item === anaKelime;
        const isIncorrect = isSelected && item != anaKelime;
        return (
            <TouchableOpacity
                onPress={() => setSeciliCevap(item)}
                style={[
                    styles.answerItem,
                    isCorrect && styles.correctAnswer,
                    isIncorrect && styles.wrongAnswer
                ]}
            >
                <Text style={styles.answerText}>{item.value}</Text>
            </TouchableOpacity>
        );
    }

    const SozlugeKelimeEkleme = async (KelimeID) => {
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;

        const response = await api.post("/kullanici/temelSozluk", {
            KullaniciID: route.route.params.UserID,
            KelimeID: KelimeID,
            Date: formattedDate
        })

        alert(response.data.message)
    }
    return (
        <View style={styles.container}>
            {anaKelime ? (
                <>
                    <View>
                        <TouchableOpacity onPress={() => setOyunDurdu(true)}>
                            <Image source={require("../../assets/pause-button.png")} style={{ height: 40, width: 40, marginTop: 10 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={styles.title}>
                            Yeni bir kelime öğrenelim
                        </Text>
                        <Text style={styles.word}>"{anaKelime.ceviri}"</Text>
                        <TouchableOpacity onPress={() => SozlugeKelimeEkleme(anaKelime.id)}>
                            <Text style={styles.addToDictionaryText}>Sözlüğe Ekle</Text>
                        </TouchableOpacity>
                        <Image source={{ uri: anaKelime.Image }} style={styles.image} />
                    </View>
                    <View style={styles.microphoneContainer}>

                        <TouchableOpacity onPress={() => speakWord(anaKelime)}>
                            <Image source={require("../../assets/microphone.png")} style={styles.microphoneIcon} />
                        </TouchableOpacity>

                    </View>
                    <View style={styles.contentContainer}>
                        <FlatList
                            data={kelimeler}
                            renderItem={renderItem}
                            style={styles.optionsContainer}
                        />
                        {devamEtButton ? (
                            <View>
                                <TouchableOpacity onPress={() => digerSoru()} style={styles.nextButtonContainer}>
                                    <Text style={styles.successText}>Devam Et </Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            null
                        )}
                    </View>

                </>

            ) : (
                <Text style={styles.loadingText}>Yükleniyor...</Text>
            )}


            <Modal /* oyun basarili bitti modal*/
                visible={oyunBasariliBittiModal}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Bölümü Başarıyla Tamamladın</Text>
                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={() => navigation.navigate("Bottom")} style={styles.button}>
                                <Text style={styles.buttonText}>Ana Sayfaya Dön</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.retryButton]} onPress={() => navigation.replace("TemelEgitimOyun", { BolumID: route.route.params.BolumID, AnaDilID: route.route.params.AnaDilID, HangiDilID: route.route.params.HangiDilID, KategoriID: route.route.params.KategoriID, UserID: route.route.params.UserID })}>
                                <Text style={styles.buttonText}>Tekrar Oyna</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal /* Bölüm Basarisiz olunca */
                visible={oyunBasarisizBittiModal}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Maalesef Bölümü Tamamlayamadın</Text>
                        <Text style={styles.modalDescription}>Yanlış Kelimeler:</Text>

                        <FlatList
                            data={yanlisKelimeler}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.incorrectWordItem}>
                                    <Text style={styles.incorrectWordText}>{item.ceviri}</Text>
                                </View>
                            )}
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate("Bottom")}
                                style={[styles.button, styles.homeButton]}
                            >
                                <Text style={styles.buttonText}>Ana Sayfaya Dön</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.retryButton]} onPress={() => navigation.replace("TemelEgitimOyun", { BolumID: route.route.params.BolumID, AnaDilID: route.route.params.AnaDilID, HangiDilID: route.route.params.HangiDilID, KategoriID: route.route.params.KategoriID, UserID: route.route.params.UserID })}>
                                <Text style={styles.buttonText}>Tekrar Oyna</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal /* oyun durduma modal */
                visible={oyunDurdu}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>⏸️ Oyun Durdu</Text>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => setOyunDurdu(!oyunDurdu)}
                        >
                            <Text style={styles.buttonText}>▶️ Devam Et</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: '#FF4C4C' }]}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.buttonText}>❌ Çıkış Yap</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View >
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#e0f7fa',
        justifyContent: 'center',

    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',

    },
    title: {
        fontSize: 23,
        fontWeight: 'bold',
        color: '#006064',
        textAlign: 'center',
        marginBottom: 10,
    },
    image: {
        width: 225,
        height: 225,
        alignSelf: 'center',
        marginVertical: 15,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#b2ebf2',
    },
    optionsContainer: {
        marginTop: 20,
        paddingBottom: 20,
    },
    addToDictionaryText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#006064', // Choose the color that suits your design
    },
    answerItem: {
        backgroundColor: '#ffffff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#b2ebf2',
    },
    answerText: {
        fontSize: 18,
        color: '#004d40',
        fontWeight: '600',
    },
    correctAnswer: {
        backgroundColor: '#81c784',
        borderColor: '#388e3c',
    },
    wrongAnswer: {
        backgroundColor: '#e57373',
        borderColor: '#d32f2f',
    },
    nextButtonContainer: {
        alignItems: 'center',

    },
    nextButtonImage: {
        height: 70,
        width: 70,
        marginTop: 10,
    },
    successText: {
        fontSize: 18,
        color: '#006064',
        fontWeight: 'bold',
    },
    loadingText: {
        fontSize: 18,
        color: '#006064',
        textAlign: 'center',
    },
    word: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FF5722', // Örneğin kırmızı renk
        marginBottom: 15,
        textAlign: 'center',
    },
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 5, // Adding shadow effect for iOS
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 10 }, // Shadow offset
        shadowOpacity: 0.25, // Shadow opacity
        shadowRadius: 3.5, // Shadow blur radius
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalDescription: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
        textAlign: 'center',
    },
    incorrectWordItem: {
        backgroundColor: '#f8d7da',
        borderRadius: 5,
        marginBottom: 10,
        padding: 10,
        width: '100%',
    },
    incorrectWordText: {
        color: '#721c24',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalActions: {
        justifyContent: 'space-evenly',
        width: '100%',
        alignItems: 'center',
        height: ""
    },
    button: {
        backgroundColor: '#4CAF50', // Green button color
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 20,
        width: "60%",

    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    microphoneContainer: {
        alignItems: 'flex-end', // Align to the right side
        marginTop: -40,
        marginBottom: 20,
    },
    microphoneIcon: {
        height: 40,
        width: 40,
    },
});


