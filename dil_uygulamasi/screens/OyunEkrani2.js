import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function OyunEkrani2(props) {
    const [soru, setSoru] = useState(0); // Start from 0
    const [kelimeler, setKelimeler] = useState([]);
    const [anaKelime, setAnaKelime] = useState(null);
    const navigation = useNavigation();

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
                const shuffledData = shuffleArray([...data]); // Shuffle the array
                setKelimeler(shuffledData);
                setSoru(0); // Reset the question index
            }
                
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const SozlugeEkle = (Kelime)=>{
        console.log(Kelime)
    }
    const CevapDogruMu = (cevap) => {
        if (cevap === anaKelime.value) {
            Alert.alert("Doğru cevap", "Tebrikler!");
            if (soru >= 2) { 
                Alert.alert(
                    "Tebrikler!",
                    "Testi bitirdin.",
                    [
                      {
                        text: "Devam Et", 
                        onPress: () => navigation.navigate("Bottom"),
                        style: "default"
                      }
                    ]
                  );                
            } else {
                setSoru(soru + 1); 
            }
        } else {
            Alert.alert("Yanlış cevap", "Tekrar deneyin.");
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            KelimeleriGetir();
        }, [props.route.params.id])
    );

    useEffect(() => {
        if (kelimeler.length > 0 && soru < kelimeler.length) {
            setAnaKelime(kelimeler[soru]); 
        }
    }, [soru, kelimeler]);

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            onPress={() => CevapDogruMu(item.value)} 
            style={styles.answerItem}
        >
            <Text style={styles.answerText}>{item.ceviri}</Text>
        </TouchableOpacity>
    );

    return ( 
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.questionCount}>{soru + 1}/3</Text>
                <TouchableOpacity onPress={()=>SozlugeEkle(anaKelime)}>
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
    }
});
