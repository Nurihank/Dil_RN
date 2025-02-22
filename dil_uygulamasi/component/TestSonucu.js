import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import api from '../api/api';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function TestSonucu({ KullaniciID }) {
    const [testData, setTestData] = useState([]);
    const [loading, setLoading] = useState(true); // Yüklenme durumu
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    const navigation = useNavigation();

    const TestSonucuGetir = async () => {
        setLoading(true); // API çağrısı başladığında yükleme durumunu aç
        try {
            const response = await api.get("/kullanici/TestSonucu", {
                params: { KullaniciID }
            });
            setTestData(response.data.message || []); // Gelen veri boş olabilir, hatayı önlemek için
        } catch (error) {
            console.error("Test sonuçlarını alırken hata oluştu:", error);
        } finally {
            setLoading(false); // API çağrısı bittiğinde yükleme durumunu kapat
        }
    };

    useFocusEffect(
        useCallback(() => {
            TestSonucuGetir();
        }, [KullaniciID])
    );

    const getLevelStats = (level) => {
        const filtered = testData.filter(item => item.SeviyeAdi === level);
        const total = filtered.length;
        const correct = filtered.filter(item => item.dogruMu === 1).length;
        return total === 0 ? 0 : (correct / total) * 100;
    };

    const renderProgressBar = ({ item }) => {
        const fill = getLevelStats(item);
        return (
            <View style={styles.progressContainer}>
                <Text style={styles.levelText}>{item}</Text>
                <AnimatedCircularProgress
                    size={100}
                    width={10}
                    fill={fill}
                    tintColor="#00e0ff"
                    backgroundColor="#3d5875"
                >
                    {(fill) => (
                        <Text style={styles.fillText}>{Math.round(fill)}%</Text>
                    )}
                </AnimatedCircularProgress>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00e0ff" />
                <Text>Veriler Yükleniyor...</Text>
            </View>
        );
    }

    return (
        testData.length > 0 ? (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={levels}
                    renderItem={renderProgressBar}
                    keyExtractor={(item) => item.toString()}
                    numColumns={3}
                    contentContainerStyle={styles.container}
                    nestedScrollEnabled={true}
                />
            </View>
        ) : (
            <View style={styles.noDataContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("TestScreen", { girisYapmisMi: true })}>
                    <Text style={styles.noDataText}>Mesleki Dil Seviyeni Görmek İster Misin?</Text>
                </TouchableOpacity>
            </View>
        )
    );
}


const styles = StyleSheet.create({
    container: {
        padding: 10,
        alignItems: 'center',
    },
    progressContainer: {
        alignItems: 'center',
        margin: 10,
    },
    levelText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    fillText: {
        fontSize: 18,
        fontWeight: 'bold',
    }
});
