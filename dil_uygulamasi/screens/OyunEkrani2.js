import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';

export default function OyunEkrani2() {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [dogruMu, setDogruMu] = useState(false);

    const answerWord = [
        {
            id: 1,
            kelime: "Klavye"
        },
        {
            id: 2,
            kelime: "Fare"
        },
        {
            id: 3,
            kelime: "Bilgisayar"
        },
        {
            id: 4,
            kelime: "Telefon"
        },
    ];

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            onPress={() => setSelectedAnswer(item.kelime)} 
            style={[styles.answerItem, 
                selectedAnswer === item.kelime && { backgroundColor: item.kelime === "Bilgisayar" ? 'green' : 'red' }
            ]}
        >
            <Text style={styles.answerText}>{item.kelime}</Text>
        </TouchableOpacity>
    );

    useEffect(() => {
        if (selectedAnswer) {
            setDogruMu(selectedAnswer === "Bilgisayar");
        }
    }, [selectedAnswer]);

    return (
        <View style={styles.container}>
            <View style={styles.askContainer}>
                <Image source={require("../assets/pc.png")} style={{ height: 150, width: 150 }} />
                <Text style={styles.askText}>Computer</Text>
            </View>
            <FlatList
                data={answerWord}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.answerContainer}
                numColumns={2}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f8ff", // Alice Blue
        padding: 20,
    },
    askContainer: {
        marginTop: 50,
        alignItems: "center",
        height: "40%",
        backgroundColor: "#ffe4e1", // Misty Rose
        justifyContent: "center",
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    askText: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#333",
    },
    answerContainer: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    answerItem: {
        margin: 10,
        padding: 20,
        backgroundColor: '#87cefa', // Light Sky Blue
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    answerText: {
        fontSize: 20,
        color: 'white',
    }
});
