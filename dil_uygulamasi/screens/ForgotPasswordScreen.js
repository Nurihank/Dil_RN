import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../api/api';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');

    const handleSubmit = async () => {
        const response = await api.get("/kullanici/forgetPasswordCode", {
            params: {
                email: email
            }
        })
        console.log(response.data)
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Şifremi Unuttum</Text>
            <View style={styles.inputContainer}>
                
                <TextInput
                    style={styles.input}
                    placeholder="E-posta"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>ŞİFREMİ SIFIRLA</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f8ff', // açık mavi tonu
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
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
        borderColor: '#ccc',
        borderWidth: 1,
    },
    button: {
        backgroundColor: '#00796b', // teal
        padding: 15,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
