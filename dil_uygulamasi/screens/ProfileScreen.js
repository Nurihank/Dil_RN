import { ScrollView, Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressBars from '../component/ProgressBars'; // ProgressBars olarak import edildi
import { Calendar } from 'react-native-calendars';

export default function ProfileScreen() {
    const [userId, setUserId] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null); // Başlangıçta null olarak ayarlandı
    const [selectedDate, setSelectedDate] = useState('');
    const [markedDates, setMarkedDates] = useState({}); // State for marked dates

    const handleDayPress = (day) => {
        console.log(day.dateString);
        setSelectedDate(day.dateString);
    };

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

            setUser(response.data.user[0]);
            setLoading(false);

            const takvim = await api.get("/kullanici/Takvim", {
                params: {
                    kullaniciID: id  
                }
            });
     
            const dates = takvim.data.reduce((acc, item) => {
                const date = item.Tarih.split('T')[0]; 
                acc[date] = { 
                    marked: true, 
                    dotColor: 'green', 
                    dotStyle: { borderRadius: 6 } 
                }; 
                return acc;
            }, {});
            setMarkedDates(dates); 

        } catch (error) {
            handleTokenError(error);
        }
    };

    const handleTokenError = async (error) => {
        if (error.response && error.response.data.message === "Token süresi dolmuş") {
            await refreshAccessToken();
        } else {
            console.log("Token hatalı veya süresi dolmuş, kullanıcıyı çıkış yapmaya yönlendir.");
            setUser(null);
        }
    };

    const refreshAccessToken = async () => {
        try {
            const refreshToken = await AsyncStorage.getItem("refreshToken");
            if (!refreshToken) {
                throw new Error("Refresh token not found");
            }

            const response = await api.put('/kullanici/NewAccessToken', {
                id: userId 
            }); 

            console.log("Başarılı cevap:", response.data.accessToken);
            await AsyncStorage.setItem('accessToken', response.data.accessToken);
            getUserInfo(); 
        } catch (error) {
            console.log("Yenileme hatası:", error.response ? error.response.data.message : error.message);
            setUser(null);
        }
    };

    useEffect(() => {
        getUserInfo();
    }, []);

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
                    {selectedDate ? (
                        <Text style={styles.selectedDateText}>Seçilen Tarih: {selectedDate}</Text>
                    ) : (
                        <Text style={styles.selectedDateText}>Tarih Seçin</Text>
                    )}
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
