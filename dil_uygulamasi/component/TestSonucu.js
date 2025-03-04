import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import api from '../api/api';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function TestSonucu({ KullaniciID }) {
    const [testData, setTestData] = useState([]);
    const [loading, setLoading] = useState(true); // Yüklenme durumu
    const [testSonucuModal, setTestSonucuModal] = useState(false)
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

    const TestSonucu = ({ item }) => {
        const filtered = testData.filter(test => test.SeviyeAdi === item);

        return (
            <View>
                <Text style={styles.modalTitle}>{item} Test Sonucu</Text>
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.AnaKelimelerID?.toString()}
                    nestedScrollEnabled={true}
                    renderItem={({ item }) => (
                        <View style={[styles.resultRow, item.dogruMu ? styles.correctAnswer : styles.wrongAnswer]}>
                            <Text style={styles.resultText}>{item.Value}</Text>
                            <Text style={styles.resultText}>{item.Ceviri}</Text>
                        </View>
                    )}
                />
            </View>
        );
    };


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
                <TouchableOpacity onPress={() => setTestSonucuModal(true)}>
                    <Text>Test Sonucunu Görmek İçin Tıkla</Text>
                </TouchableOpacity>
                <FlatList
                    data={levels}
                    renderItem={renderProgressBar}
                    keyExtractor={(item) => item.toString()}
                    numColumns={3}
                    contentContainerStyle={styles.container}
                    nestedScrollEnabled={true}
                />
                <Modal
                    visible={testSonucuModal}
                    transparent={true}
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <TouchableOpacity onPress={() => setTestSonucuModal(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>X</Text>
                        </TouchableOpacity>
                        <FlatList
                            data={levels}
                            renderItem={TestSonucu}
                            keyExtractor={(item) => item.toString()}
                            nestedScrollEnabled={true}
                        />
                    </View>
                </Modal>
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
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: 'white',
    },
    resultRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    correctAnswer: {
        backgroundColor: 'rgba(0, 255, 0, 0.3)',
    },
    wrongAnswer: {
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
    },
    resultText: {
        fontSize: 16,
        color: 'black',
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 10,
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    }
});
