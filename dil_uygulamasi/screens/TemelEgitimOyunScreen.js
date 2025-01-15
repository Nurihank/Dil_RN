import { StyleSheet, Text, View, TouchableOpacity, Alert, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigation } from '@react-navigation/native';

export default function TemelEgitimOyunScreen(route) {
    const [kelimeler, setKelimeler] = useState([]);
    const [anaKelime, setAnaKelime] = useState(null);
    const [anaKelimeler, setAnaKelimeler] = useState(null);
    const [seciliCevap, setSeciliCevap] = useState(null);
    const [soruIndex, setSoruIndex] = useState(0);
    const [cevapDurumu, setCevapDurumu] = useState()
    const [yanlisKelimeler, setYanlisKelimeler] = useState([]);
    const [devamEtButton, setDevamEtButton] = useState(false)
    const navigation = useNavigation()

    const digerSoru = (yanlisKelime) => {
        let yeniYanlisKelimeler = yanlisKelimeler;
        if (yanlisKelime) {
            yeniYanlisKelimeler = [...yanlisKelimeler, yanlisKelime];
            setYanlisKelimeler(yeniYanlisKelimeler);
        }
        setCevapDurumu(null)
        setSeciliCevap(null)
        setDevamEtButton(false)
        setSoruIndex(soruIndex + 1);

        if (soruIndex >= 2) {
            alert("oyun bitti")
            console.log("yanlış kelimeler = " + yanlisKelimeler)
            navigation.replace("Bottom")
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

    useEffect(() => {
        kelimeleriGetir();
    }, []);

    useEffect(() => {
        if (anaKelimeler && anaKelimeler.length > 0) {
            setAnaKelime(anaKelimeler[soruIndex]);
        }
    }, [soruIndex, kelimeler])

    const cevapDogruMu = (cevap) => {
        if (anaKelime.value === cevap.value) {
            setCevapDurumu('correct');
            if (soruIndex >= 2) {
                digerSoru();
            } else {
                setDevamEtButton(true);
            }
        } else {
            setCevapDurumu('incorrect');
            digerSoru(anaKelime);
        }
        setSeciliCevap(cevap);
    };

    const renderItem = ({ item }) => {
        const isSelected = item === seciliCevap
        const isCorrect = isSelected && cevapDurumu === 'correct';
        const isIncorrect = isSelected && cevapDurumu === 'incorrect';
        return (
            <TouchableOpacity
                onPress={() => cevapDogruMu(item)}
                style={[
                    styles.answerItem,
                    isCorrect && styles.correctAnswer,
                    isIncorrect && styles.wrongAnswer
                ]}
            >
                <Text style={styles.answerText}>{item.ceviri}</Text>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            {anaKelime ? (
                <>
                    <Text style={styles.title}>Kelime = {anaKelime.ceviri}</Text>
                    <Text style={styles.subtitle}>Doğru cevabı seçin:</Text>

                    <View style={styles.optionsContainer}>
                        <FlatList
                            data={kelimeler}
                            renderItem={renderItem}
                        />

                    </View>
                    {devamEtButton ? <TouchableOpacity onPress={() => digerSoru()}>
                        <Text>devam et</Text>
                    </TouchableOpacity> : null}
                </>
            ) : (
                <Text>Yükleniyor...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8', // Lighter background for better contrast
        justifyContent: 'center', // Centers content vertically
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center', // Center-align title
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 15,
        color: '#666',
        textAlign: 'center', // Center-align subtitle
    },
    optionsContainer: {
        marginTop: 30,
        paddingBottom: 20, // Padding at the bottom to prevent overflow
    },
    answerItem: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginBottom: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000', // Shadow effect for better visual separation
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // For Android shadow effect
    },
    answerText: {
        fontSize: 18,
        color: '#333',
        fontWeight: '600', // Slightly bolder text for better readability
    },
    correctAnswer: {
        backgroundColor: '#28a745', // Green color for correct answer
        borderColor: '#2d8d41', // Darker green border for better contrast
        borderWidth: 2,
    },
    wrongAnswer: {
        backgroundColor: '#dc3545', // Red color for incorrect answer
        borderColor: '#c82333', // Darker red border for better contrast
        borderWidth: 2,
    },
    continueButton: {
        backgroundColor: '#007bff', // Blue color for the continue button
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
    },
    continueButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
});
