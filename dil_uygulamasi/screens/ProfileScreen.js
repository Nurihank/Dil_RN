import { ScrollView, Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressBars from '../component/ProgressBars'; // ProgressBars olarak import edildi
import { Calendar } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen() {

    const [userId, setUserId] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null); // Başlangıçta null olarak ayarlandı
    const [markedDates, setMarkedDates] = useState({}); // State for marked dates

    const handleDayPress = (day) => {
        console.log(day.dateString);
    };

    const setMarkedDatesApi = async() => { /* günlük giriş yaptığımız günleri takvimde set etmek için  */
        const response = await api.get("/kullanici/GunlukGiris",{
            params:{ 
                KullaniciID: userId
            }
        })
        const data = response.data.message
        const marked = data.reduce((acc, item) => {
            const localDate = new Date(item.Tarih); // Tarihi Date objesine çevir
            localDate.setDate(localDate.getDate() + 1); // UTC farkını düzelt

            const dateKey = localDate.toISOString().split('T')[0]; // YYYY-MM-DD formatına getir
            acc[dateKey] = {
                marked: true,
                dotColor: 'green', 
            };
            return acc;
        }, {});
        setMarkedDates(marked);
        console.log(response.data.message)

    }
    // Kullanıcı bilgilerini al
    const getUserInfo = async () => {
        const id = await AsyncStorage.getItem("id");
        setUserId(id);
        try {
            const accessToken = await AsyncStorage.getItem("accessToken");
            if (!accessToken) {
                throw new Error("Access token not found");
            }
            const response = await api.get("/kullanici/KullaniciBilgileri", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                params: {
                    id: id
                },
            });
            console.log("gelen kullanıcı = " + response)
            setUser(response.data.user[0]);
            setLoading(false);

        } catch (error) {
            handleTokenError(error);
        }
    };

    const handleTokenError = async (error) => {
        console.log("gelen hata = " + error.response.data.message)
        if (error.response && error.response.data.message === "Token süresi dolmuş") {
            await refreshAccessToken();
        } else {

            setUser(null);
        }
    };

    const refreshAccessToken = async () => {
        try {
            let refreshToken = await AsyncStorage.getItem("refreshToken");
            console.log(refreshToken)
            refreshToken = refreshToken.replace(/^"|"$/g, '');
            console.log(refreshToken)
            if (!refreshToken) {
                throw new Error("Refresh token not found");
            }
            const response = await api.put('/kullanici/NewAccessToken', {
                id: userId,
                refreshToken: refreshToken
            });
            await AsyncStorage.setItem('accessToken', response.data.accessToken);
            getUserInfo();
        } catch (error) {
            console.log("access Token alırken hata = " + error.response.data.message)
            setUser(null);
        }
    };

    // useFocusEffect ile ekran odaklandığında veri yenileme
    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                await getUserInfo();
                await setMarkedDatesApi()
            }
            fetchData()
        }, [userId])
    );

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            {loading ? (
                <ActivityIndicator style={styles.loadingContainer} size="large" color="#0000ff" />
            ) : userId && user ? ( // userId ve user kontrolü eklendi
                <>
                    <View style={styles.profileImageContainer}>
                        <Image
                            source={require("../assets/profile-default.jpg")}
                            style={styles.imageStyle}
                        />
                    </View>
                    <Text style={styles.username}>{user.kullaniciAdi}</Text>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoTitle}>Meslek</Text>
                        <Text style={styles.infoText}>{user.meslek}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoTitle}>Ana Dili</Text>
                        <Text style={styles.infoText}>{user.dil}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoTitle}>Öğrendiğin Dil</Text>
                        <Text style={styles.infoText}>{user.OgrenilecekDil} Öğreniyor</Text>
                    </View>
                    <ProgressBars />
                    <Calendar
                        onDayPress={handleDayPress}
                        markedDates={markedDates}
                        style={styles.calendar}
                    />
                </>
            ) : (
                <Text style={styles.errorText}>Kullanıcı bilgileri bulunamadı veya hata oluştu.</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    profileImageContainer: {
        alignItems: 'center',
        marginVertical: 30,
    },
    imageStyle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    username: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    infoContainer: {
        marginBottom: 15,
    },
    infoTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    infoText: {
        fontSize: 18,
        color: '#333',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
    },
    errorText: {
        textAlign: 'center',
        fontSize: 18,
        color: 'red',
    },
    calendar: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'gray',
        marginTop: 25
    },
    selectedDateText: {
        marginTop: 20,
        fontSize: 18,
        marginBottom: 65
    },
});
