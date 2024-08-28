import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import AntDesign from '@expo/vector-icons/AntDesign';

const { width: screenWidth } = Dimensions.get('window');

export default function EgitimScreen(props) {
    const [kelimeler, setKelimeler] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0); // Track the current word index
    const [dil, setDil] = useState(false);

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

    useEffect(() => {
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

            <TouchableOpacity style={styles.addButton}>
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
        backgroundColor: '#f5f5f5',
        padding: 20,
        position: 'relative', // Make sure the container is relative to use absolute positioning inside it
    },
    wordContainer: {
        width: screenWidth * 0.8,
        height: 200,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        elevation: 4,
        marginBottom: 20,
    },
    wordText: {
        fontSize: 24,
        color: '#333',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: screenWidth * 0.8,
    },
    navigationButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
    },
    languageButton: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        elevation: 2,
    },
});
