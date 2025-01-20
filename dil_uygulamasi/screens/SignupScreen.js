import { Alert, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; // FontAwesome kullanarak ikonlar ekliyoruz
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserModel from '../model/ModelUser';

export default function SignupScreen() {
    const [kullaniciAdi, setKullaniciAdi] = useState("");
    const [email, setEmail] = useState("");
    const [sifre, setSifre] = useState("");
    const navigation = useNavigation();

    const handleSignup = async () => {
        try {
            const response = await api.post("/kullanici/signup", {
                kullaniciAdi: kullaniciAdi,
                eposta: email,
                sifre: sifre
            });
            if (response.data.status === "SUCCES") {
                Alert.alert(response.data.message);
                const responseSignin = await api.post("/kullanici/signin", {
                    eposta: email,
                    sifre: sifre
                });
                if (responseSignin.data.status === "SUCCES") {
                    UserModel.setUser(responseSignin.data.id);
                    await AsyncStorage.setItem('accessToken', JSON.stringify(responseSignin.data.accessToken));
                    await AsyncStorage.setItem('refreshToken', JSON.stringify(responseSignin.data.refreshToken));
                    await AsyncStorage.setItem("id", JSON.stringify(responseSignin.data.id))
                    navigation.navigate("SecimEkrani", { id: responseSignin.data.id });
                } else if (responseSignin.data.status === "FAILED") {
                    Alert.alert(responseSignin.data.message);
                }
            } else if (response.data.status === "FAILED") {
                alert(response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.text}>Dil Uygulamasına Hoşgeldiniz</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Kullanıcı Adı Girin'
                    value={kullaniciAdi}
                    onChangeText={(text) => setKullaniciAdi(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder='E-posta Girin'
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    keyboardType='email-address'
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.input}
                    placeholder='Şifre Girin'
                    secureTextEntry
                    value={sifre}
                    onChangeText={(text) => setSifre(text)}
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleSignup} style={styles.button}>
                    <Text style={styles.buttonText}>KAYIT OL</Text>
                    <FontAwesome name="user-plus" size={24} color="#fff" style={styles.buttonIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Signin")} style={[styles.button, styles.secondaryButton]}>
                    <Text style={[styles.buttonText, { color: '#00796b' }]}>GİRİŞ EKRANINA GERİ DÖN</Text>
                    <FontAwesome name="sign-in" size={24} color="#00796b" style={styles.buttonIcon} />
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
        backgroundColor: '#e0ffff',
        padding: 20,
    },
    textContainer: {
        backgroundColor: '#87cefa',
        padding: 20,
        borderRadius: 20,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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
        marginBottom: 15,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#00796b',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    secondaryButton: {
        backgroundColor: '#faf0e6',
        borderColor: '#00796b',
        borderWidth: 2,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
    },
    buttonIcon: {
        marginLeft: 10,
    },
});
