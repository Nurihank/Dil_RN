import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function TestSonucu({ KullaniciID }) {
    const [testData, setTestData] = useState([]);
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    const TestSonucuGetir = async () => {
        try {
            const response = await api.get("/kullanici/TestSonucu", {
                params: { KullaniciID }
            });
            setTestData(response.data || []); // Eğer data undefined ise boş dizi atar
        } catch (error) {
            console.error("Test sonuçlarını alırken hata oluştu:", error);
        }
    };

    useEffect(() => {
        TestSonucuGetir();
    }, [KullaniciID]);

    const getLevelStats = (level) => {

        if (!testData || !Array.isArray(testData.message)) {
            console.log("testData geçersiz veya dizi değil!");
            return 0;
        }

        const filtered = testData.message.filter(item => item.SeviyeAdi === level);

        const total = filtered.length;
        const correct = filtered.filter(item => item.dogruMu === 1).length;


        return total === 0 ? 0 : (correct / total) * 100;
    };



    const renderProgressBar = ({ item }) => {
        const fill = getLevelStats(item);  // Bu fonksiyonun doğru bir şekilde işlediğinden emin ol.

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

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={levels}
                renderItem={renderProgressBar} 
                keyExtractor={(item) => item.toString()}  // Burada her item'ın unique bir key'e sahip olmasını sağla
                numColumns={3}
                contentContainerStyle={styles.container}
                nestedScrollEnabled={false} // İç içe kaydırmayı devre dışı bırak
            />
        </View>
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
