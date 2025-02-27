import { View, StyleSheet, ActivityIndicator,Text } from 'react-native';
import React, { useCallback, useState } from 'react';
import { ProgressBar } from 'react-native-paper';
import api from '../api/api';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";

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

  const getGradientColors = () => {
    if (progress < 0.3) return ["#ffcc00", "#ff6600"]; // Mavi → Yeşil
    if (progress < 0.6) return ["#ffcc00", "#ff6600"]; // Yeşil → Sarı
    if (progress < 0.9) return ["#ff6600", "#ffcc00"]; // Sarı → Turuncu
    return ["#ffcc00", "#ff6600"]; // Turuncu → Kırmızı
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#00e0ff" />
        ) : (
          <>
            <Text style={styles.progressText}>
              🚀 %{Math.round(progress * 100)} TAMAMLANDI
            </Text>
            <View style={styles.progressBarWrapper}>
              <LinearGradient
                colors={getGradientColors()}
                style={[styles.progressFill, { width: `${progress * 100}%` }]}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  progressContainer: {
    alignItems: "center",
    width: "90%",
  },
  progressText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e0e0e0",
    marginBottom: 10,
    textAlign: "center",
  },
  progressBarWrapper: {
    width: "100%",
    height: 25,
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Hafif şeffaf beyaz/mor
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#8a2be2", // Parlak mor çerçeve
  },
  progressFill: {
    height: "100%",
    borderRadius: 15,
  },
});

