import { Alert, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; // FontAwesome kullanarak ikonlar ekliyoruz
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserModel from '../model/ModelUser';
import auth from '@react-native-firebase/auth';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';

 //android = 134181693185-gga5vjrt5lirsb5jjoamjs6nq2mstusa.apps.googleusercontent.com
// web = 134181693185-c2dpu39ja1fiumfg3hfcdpk68vpfd7np.apps.googleusercontent.com
//ios = 134181693185-c1t5u85i2hi5jd4412ptud3c1j72pm5n.apps.googleusercontent.com
export default function SigninScreen() { 
   
    const webClientId = "134181693185-c2dpu39ja1fiumfg3hfcdpk68vpfd7np.apps.googleusercontent.com"
    const androidClientId = "134181693185-gga5vjrt5lirsb5jjoamjs6nq2mstusa.apps.googleusercontent.com"
    const iosClientId = "134181693185-c1t5u85i2hi5jd4412ptud3c1j72pm5n.apps.googleusercontent.com"

    const config = {
        webClientId,
        iosClientId,
        androidClientId
    }
    const [request, response, promptAsync] = Google.useAuthRequest(config)

    const handleToken = ()=>{
        if(response?.type === "success"){
            const {authentication} = response
            const token = authentication?.accessToken
            console.log("token = "+token)
        }
    }
    useEffect(()=>{
        handleToken()
    },[response])
    

    const [kullaniciAdi, setKullaniciAdi] = useState("");
    const [sifre, setSifre] = useState("");
    const navigation = useNavigation();

    const handleSignin = async () => {
        try {
            console.log("sad")
            const response = await api.get("/kullanici/signin", {
                params: {
                    kullaniciAdi: kullaniciAdi,
                    sifre: sifre
                }
            });
            console.log("sad")

            console.log(response.data)
            if (response.data.status === "SUCCES") {
                await AsyncStorage.setItem('accessToken', JSON.stringify(response.data.accessToken));
                await AsyncStorage.setItem('refreshToken', JSON.stringify(response.data.refreshToken));

                await AsyncStorage.setItem('id', JSON.stringify(response.data.id));

                await UserModel.setUser(response.data.id);
                navigation.navigate("Welcome");
            } else if (response.data.status === "FAILED") {
                Alert.alert(response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSignup = () => {
        navigation.navigate("Signup");
    };
 
    const handleForgotPassword = ()=>{
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
                    placeholder='Kullanıcı Adı Girin'
                    value={kullaniciAdi}
                    onChangeText={(text) => setKullaniciAdi(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Şifre Girin'
                    secureTextEntry
                    value={sifre}
                    onChangeText={(text) => setSifre(text)}
                />
            </View>
            <TouchableOpacity onPress={() => promptAsync()} style={styles.forgotContainer}>
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
