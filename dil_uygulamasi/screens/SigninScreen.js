import { Alert, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; // FontAwesome kullanarak ikonlar ekliyoruz
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserModel from '../model/ModelUser';

export default function SigninScreen() {

    const [eposta, setEposta] = useState("");
    const [sifre, setSifre] = useState("");
    const navigation = useNavigation();

    const TestIDKaydet = async (testId, userId) => {
        console.log("test id = " + testId)
        if (testId) {
            await AsyncStorage.removeItem("testID"); //TESTİD'Yİ GÖNDERDİK SİLEBİLİRİZ
            const response = await api.post("/kullanici/TestIDKaydet", {
                TestID: testId,
                KullaniciID: userId
            })
            console.log(response.data.message)
        } else {
            console.log("Test id yok")
        }
    }

    const handleSignin = async () => {
        const testID = await AsyncStorage.getItem("testID")
        console.log("testID " + testID)
        try {
            const response = await api.post("/kullanici/signin", {
                eposta: eposta,
                sifre: sifre
            });

            if (response.data.status === "SUCCES") {
                await AsyncStorage.setItem('accessToken', JSON.stringify(response.data.accessToken));
                await AsyncStorage.setItem('refreshToken', JSON.stringify(response.data.refreshToken));
                await AsyncStorage.setItem('id', JSON.stringify(response.data.id));
                TestIDKaydet(testID, response.data.id)
                await UserModel.setUser(response.data.id);
                navigation.replace("Welcome");
            } else if (response.data.status === "FAILED") {
                Alert.alert(response.data.message);
            }
        } catch (error) {
            // Hata mesajını ve mevcut error objesini kontrol et
            console.log("API Hatası:", error);
            if (error.response) {
                console.log("Yanıt Hatası:", error.response.data); // Sunucudan gelen hatayı göster
            } else {
                console.log("Hata Mesajı:", error.message); // Hata mesajını göster
            }
        }
    };

    const handleSignup = () => {
        navigation.navigate("Signup");
    };

    const handleForgotPassword = () => {
        navigation.navigate("ForgotPassword")
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.text}>Dil Uygulamasına Hoşgeldiniz</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Eposta Girin'
                    value={eposta}
                    onChangeText={(text) => setEposta(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Şifre Girin'
                    secureTextEntry
                    value={sifre}
                    onChangeText={(text) => setSifre(text)}
                />
            </View>
            <TouchableOpacity onPress={() => handleForgotPassword()} style={styles.forgotContainer}>
                <Text style={styles.forgotText}>Şifremi Unuttum</Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleSignin}>
                    <Text style={styles.buttonText}>GİRİŞ YAP</Text>
                    <FontAwesome name="sign-in" size={24} color="#fff" style={styles.buttonIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSignup} style={styles.buttonOutline}>
                    <Text style={styles.buttonOutlineText}>KAYIT OL</Text>
                    <FontAwesome name="user-plus" size={24} color="#007BFF" style={styles.buttonOutlineIcon} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f8ff',
        padding: 20,
    },
    textContainer: {
        marginBottom: 30,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    forgotContainer: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotText: {
        fontSize: 16,
        color: '#007BFF',
        fontWeight: 'bold',
    },
    buttonContainer: {
        width: '100%',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
    },
    buttonIcon: {
        marginLeft: 5,
    },
    buttonOutline: {
        borderColor: '#007BFF',
        borderWidth: 2,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonOutlineText: {
        color: '#007BFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
    },
    buttonOutlineIcon: {
        color: '#007BFF',
        marginLeft: 5,
    },
});
