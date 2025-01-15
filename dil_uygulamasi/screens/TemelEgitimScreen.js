import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserModel from '../model/ModelUser';
import api from '../api/api';

export default function TemelEgitimScreen() {
    const navigation = useNavigation();
    const [userId, setUserId] = useState();
    const [HangiDilID, setHangiDilID] = useState();
    const [AnaDilID, setAnaDilID] = useState();
    const [temelKategoriler, setTemelKategoriler] = useState([]);
    const [kategoriBolumleri, setKategoriBolumleri] = useState({}); // Bölümleri kategorilere göre saklamak için
    const setUserID = async () => {
        const id = await AsyncStorage.getItem("id");
        setUserId(id);
    };

    const getUserInfo = async () => {
        const user = await UserModel.currentUser;
        setHangiDilID(user[0].DilID);
        setAnaDilID(user[0].SectigiDilID);
    };

    const OyunGecis = (bolumId) => {
        navigation.navigate("TemelEgitimOyun", { BolumID: bolumId, UserID :userId,AnaDilID:AnaDilID,HangiDilID:HangiDilID })
    }

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                await setUserID();
                await getUserInfo();
            };
            fetchData();
        }, [])
    );

    const temelKategorileriGetir = async () => {
        try {
            const response = await api.get("/kullanici/temelKategoriler", {
                params: {
                    AnaDilID: AnaDilID,
                    HangiDilID: HangiDilID,
                },
            });
            console.log(response.data.message);
            setTemelKategoriler(response.data.message);
            fetchAllBolumler(response.data.message);

        } catch (error) {
            console.error(error);
        }
    };

    const fetchAllBolumler = async (kategoriler) => {
        const bolumPromises = kategoriler.map(async (kategori) => { /* map fonks kullanılmış */
            try {
                const response = await api.get("/kullanici/temelBolumler", {
                    params: {
                        AnaDilID,
                        HangiDilID,
                        KategoriID: kategori.id,
                    },
                });
                return { kategoriId: kategori.id, bolumler: response.data.message };
            } catch (error) {
                console.error(error);
                return { kategoriId: kategori.id, bolumler: [] };
            }
        });

        const bolumData = await Promise.all(bolumPromises);
        const bolumMap = {};
        bolumData.forEach(({ kategoriId, bolumler }) => {
            bolumMap[kategoriId] = bolumler; /* kategori id'sine göre set ettil */
        });
        setKategoriBolumleri(bolumMap);
    };

    useEffect(() => {
        if (HangiDilID && AnaDilID) {
            temelKategorileriGetir();
        }
    }, [AnaDilID, HangiDilID]);

    return (
        <View style={styles.container}>
            <FlatList
                data={temelKategoriler}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.text}>{item.Ceviri}</Text>
                        <FlatList
                            data={kategoriBolumleri[item.id] || []}
                            keyExtractor={(bolum) => bolum.id.toString()}
                            renderItem={({ item: bolum }) => (
                                <TouchableOpacity onPress={() => OyunGecis(bolum.id)}>
                                    <View style={styles.bolumContainer}>
                                        <Image source={require("../assets/apple.png")} style={{ width: 30, height: 30 }} />
                                        <Text style={styles.bolumText}>{bolum.ceviri}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.horizontalListContainer}
                        />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    item: {
        padding: 15,
        backgroundColor: '#f1f8ff',
        shadowColor: '#ccc',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        borderBottomWidth: 2, // İnce bir çizgi ekler
        borderBottomColor: '#ccc', // Çizginin rengi (gri ton)
    },
    text: {
        fontSize: 24,
        marginBottom: 8,
        fontWeight: 'bold',
        color: '#ff6f61',
    },
    bolumContainer: {
        alignItems: 'center',
        marginRight: 15,
        backgroundColor: '#dfe6e9',
        padding: 10,
        borderRadius: 15,
        width: 130,
        height: 75
    },
    bolumText: {
        fontSize: 18,
        color: '#6c5ce7',
        marginLeft: 10,
    },
    icon: {
        color: '#00cec9',
    },
});
