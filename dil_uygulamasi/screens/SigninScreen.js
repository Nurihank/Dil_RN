import { Button, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import FontAwesome, { SolidIcons, RegularIcons, BrandIcons } from 'react-native-fontawesome';
import api from "../api/api"




export default function SigninScreen() {
   
    const [kullaniciAdi, setKullaniciAdi] = useState("")
    const [sifre, setSifre] = useState("")

    const [result, setResult] = useState("")

    const navigation = useNavigation()

    const handleSignin = async()=>{
        console.log("asdas")
        try {
            const response = await api.get("/signin",{
                params:{
                    kullaniciAdi:kullaniciAdi,
                    sifre:sifre
                }
            })
            setResult(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSignup = async ()=>{
        const sigUpScreen = ()=>navigation.navigate("Signup")
        sigUpScreen() 
    }
   

    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.text}>Dil Uygulamasına Hoşgeldiniz</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput style={styles.input}
                    placeholder='Kullanici Adi Girin'
                    value={kullaniciAdi}
                    onChangeText={(text) => setKullaniciAdi(text)}
                />
                <TextInput style={styles.input}
                    placeholder='Şifre Girin'
                    value={sifre}
                    onChangeText={(text) => setSifre(text)}
                />
            </View>
            <View>
                <TouchableOpacity style={styles.forgotContainer}>
                    <Text style={{ fontWeight : "bold", fontSize: 15 }}>Şifremi Unuttum</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => handleSignin()}>
                    <Text style={{ color: "#191970", fontSize: 20, fontWeight: "bold" }}>GİRİŞ YAP</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={()=>handleSignup()}
                    style={styles.button}>
                    <Text style={{ color: "#191970", fontSize: 20, fontWeight: "bold" }}>KAYIT OL</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>

    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#e0ffff",
        height: "100%",
    },
    textContainer: {
        backgroundColor: "#87cefa",
        margin: 10,
        padding: 10,
        borderRadius: 20,
        //  marginBottom:100
    },
    text: {
        fontSize: 20,
        fontWeight: "bold"
    },
    inputContainer: {
        width: "75%",

    },
    input: {
        marginVertical: 10,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 20
    },
    forgotContainer: {
        marginTop: 12,
        marginLeft: 180
    },
    buttonContainer: {
        width: "50%",
        marginTop: 10
    },
    button: {
        borderRadius: 25,
        alignItems: "center",
        backgroundColor: "#faf0e6",
        marginVertical: 10,
        padding: 15
    }
})