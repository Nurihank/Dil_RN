import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function OyunEkrani2(props) {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [kelimeler, setKelimeler] = useState([]);
    const [anaKelime, setAnaKelime] = useState([]);
    const KelimeleriGetir = async () => {
        try {
            const response = await api.get("/kullanici/oyun", {
                params: {
                    BolumID: props.route.params.id
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
                setAnaKelime(data[0]);
                
                // Diziyi karıştır ve set et
                const shuffledData = shuffleArray([...data]); // Yeni bir kopya oluşturarak karıştır
                setKelimeler(shuffledData);
            }
                
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        KelimeleriGetir();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            onPress={() => setSelectedAnswer(item.value)} 
            style={styles.answerItem}
        >
            <Text style={styles.answerText}>{item.ceviri}</Text>
        </TouchableOpacity>
    );

    useEffect(() => {
        if (selectedAnswer) {
            if (selectedAnswer === anaKelime.value) {
                Alert.alert("Doğru cevap", "Tebrikler!");
            } else {
                Alert.alert("Yanlış cevap", "Tekrar deneyin.");
            }
        }   
    }, [selectedAnswer]);

    return ( 
        <View style={styles.container}>
            <View style={styles.askContainer}>
                <Image source={require("../assets/pc.png")} style={styles.image} />  
                <Text style={styles.askText}>{anaKelime.value}</Text>
            </View>
            <FlatList
                data={kelimeler}
                renderItem={renderItem}
                contentContainerStyle={styles.answerContainer}
                numColumns={2}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e0f7fa", // Light Cyan
        padding: 20,
    },
    askContainer: {
        marginTop: 50,
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
    },
    image: {
        height: 150,
        width: 150,
        marginBottom: 20,
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
    }
});
  