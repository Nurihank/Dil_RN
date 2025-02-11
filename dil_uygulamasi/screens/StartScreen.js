import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StartScreen({ navigation }) {
    const [pressed, setPressed] = useState(false);

    useEffect(()=>{
        AsyncStorage.clear()
    },[])
    return (
        <View style={styles.container}>

            <TouchableOpacity
                style={[styles.titleContainer, pressed && styles.titlePressed]}
                onPress={() => {
                    setPressed(true);
                    setTimeout(() => setPressed(false), 200); // Renk animasyonu için
                    navigation.navigate("TestScreen"); // Test ekranına yönlendirme
                }}
            >
                <Text style={styles.title}>Mesleki Dil Yeterlilik Testi</Text>
                <Text style={styles.subtitle}>(Başlamak için dokunun)</Text>
            </TouchableOpacity>

            <Image source={require("../assets/office.png")} style={styles.image} />

            <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("Signin")}>
                <Text style={styles.buttonText}>Giriş Yap</Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Hesabın yok mu?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                    <Text style={styles.signupLink}> Kayıt Ol</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    titleContainer: {
        backgroundColor: "#007bff",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: "center",
        width: "90%",
    },
    titlePressed: {
        backgroundColor: "#0056b3", // Basınca renk değişimi
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        color: "#ddd",
        marginTop: 5,
    },
    image: {
        height: 250,
        width: 250,
        marginBottom: 20,
    },
    loginButton: {
        backgroundColor: "#007bff",
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    signupContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    signupText: {
        fontSize: 16,
        color: "#666",
    },
    signupLink: {
        fontSize: 16,
        color: "#007bff",
        fontWeight: "bold",
    },
});
