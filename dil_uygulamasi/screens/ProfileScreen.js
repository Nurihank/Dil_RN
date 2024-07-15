import { Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import api from '../api/api'
import UserModel from '../model/ModelUser';

export default function ProfileScreen() {
    const [userId, setUserId] = useState(undefined); // Başlangıçta undefined olarak ayarla
    const [loading, setLoading] = useState(true); // Ekle: Yükleniyor durumu
    const [user, setUser] = useState(undefined); // Başlangıçta undefined olarak ayarla
    const fetchUser = async () => {
        try {
            const currentUser = await UserModel.getCurrentUser();
            if (currentUser && currentUser.length > 0) {
                setUserId(currentUser[0].id); // Eğer kullanıcı varsa, id'yi ayarla
            } else {
                setUserId(null); // Kullanıcı bulunamazsa null olarak ayarla
            }
        } catch (error) {
            console.error("Kullanıcı getirilemedi:", error);
            setUserId(null); // Hata durumunda null olarak ayarla
        }
        setLoading(false); // Kullanıcı getirildikten sonra yüklenmeyi durdur
    };

    const getUserInfo = async () => {
        try {
            const response = await api.get("/kullanici/KullaniciBilgileri", {
                params: {
                    id: userId
                }
            });
            setUser(response.data.user)
            console.log("response = ", response.data.user);
        } catch (error) {
            console.error("Bilgiler getirilemedi:", error);
        }
    }

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
            {userId ? (
                <>
                    <Image
                        source={require("../assets/profiles.png")}
                        style={styles.imageStyle}
                    />
                    <Image
                        source={require("../assets/plus.png")}
                        style={styles.plusImageStyle}
                    />
                </>
            ) : (
                <Text>Kullanıcı bulunamadı</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyle: {
        width: 150,
        height: 150
    },
    plusImageStyle: {
        width: 50,
        height: 50
    }
});
