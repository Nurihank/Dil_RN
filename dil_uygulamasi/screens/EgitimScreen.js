import { FlatList, StyleSheet, Text, View, Dimensions, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import api from '../api/api';

const { width: screenWidth } = Dimensions.get('window');

export default function EgitimScreen(props) {
    const [kelimeler, setKelimeler] = useState([]);
    const [dil, setDil] = useState(false);

    const KelimeleriGetir = async () => {
        console.log(props.route.params.id);
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
                console.log(shuffledData)
                setKelimeler(shuffledData);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        KelimeleriGetir();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.textContainer}>
                <TouchableOpacity>
                    <Text style={styles.cardText}>{dil ? item.Ceviri : item.Value}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => setDil(!dil)}>
                    <Text style={styles.toggleText}>
                        {dil ? 'Öğrenmek İstedigin Dilde Gör' : 'Kendi Dilinde Gör'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addButton}>
                    <Image
                        source={require('../assets/dictionary.png')} // Update the path to your icon
                        style={styles.icon}
                    />
                    <Text style={styles.addText}>Sözlüğe Ekle</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={kelimeler}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flatListContent}
                snapToAlignment="center" 
                snapToInterval={screenWidth * 0.8 + 20} // Item width + margin
                decelerationRate="fast" 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5'
    },
    card: {
        width: screenWidth * 0.8, // Adjust the width of each card
        height: 200,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginHorizontal: 10, // Horizontal margin between cards
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        position: 'relative'
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardText: {
        fontSize: 18,
        color: '#333'
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    toggleText: {
        fontSize: 14,
        color: '#007BFF',
        marginRight: 10
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 5
    },
    addText: {
        fontSize: 14,
        color: '#007BFF'
    },
    flatListContent: {
        alignItems: 'center', // Centers the content vertically
    }
});
