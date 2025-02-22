import { View, StyleSheet, ActivityIndicator,Text } from 'react-native';
import React, { useCallback, useState } from 'react';
import { ProgressBar } from 'react-native-paper';
import api from '../api/api';
import { useFocusEffect } from '@react-navigation/native';

export default function ProgressBars({ KullaniciID, SeviyeID }) {  
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const IlerlemeHesaplama = async () => {
        try {
          const response = await api.get("/kullanici/MeslekiIlerleme", {
            params: {
              KullaniciID,
              SeviyeID
            }
          });

          if (response.data) {
            const { gecilenBolumler, tumBolumler } = response.data;
            if (tumBolumler > 0) {
              setProgress(gecilenBolumler / tumBolumler); // Yüzdelik hesaplama
            }
          }
        } catch (error) {
          console.error("İlerleme hesaplanırken hata oluştu:", error);
        } finally {
          setLoading(false);
        }
      };

      IlerlemeHesaplama();
    }, [KullaniciID, SeviyeID])
  );

  return (
    <View style={styles.container}>
      <View style={styles.ImageContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#00e0ff" />
        ) : (
          <View style={{ margin: 10, marginTop: 15 }}>
            <Text>BU SEVİYEDE %{Math.round(progress * 100)} İLERLEME</Text>
            <ProgressBar progress={progress} width={230} height={50} color="#00e0ff" />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ImageContainer: {
    flexDirection: "row",
    marginTop: 10
  },
  image: {
    height: 65,
    width: 65
  },
}) 