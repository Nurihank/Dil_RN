import { Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import UserModel from '../model/ModelUser';

export default function ProfileScreen() {
    const [userId, setUserId] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        try {
            const currentUser = await UserModel.getCurrentUser();
            if (currentUser && currentUser.length > 0) {
                setUserId(currentUser[0].id);
            } else {
                setUserId(null);
            }
        } catch (error) {
            console.error("Kullanıcı getirilemedi:", error);
            setUserId(null);
        }
        setLoading(false);
    };

    const getUserInfo = async () => {
        try {
            const response = await api.get("/kullanici/KullaniciBilgileri", {
                params: {
                    id: userId
                }
            });
            if (response.data && response.data.user) {
                setUser(response.data.user[0]); // Kullanıcı verisini güncelle
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Bilgiler getirilemedi:", error);
            setUser(null);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (userId !== undefined) {
            getUserInfo();
        }
    }, [userId]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {user ? (
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
                </>
            ) : (
                <Text style={styles.errorText}>Kullanıcı bulunamadı</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
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
});
