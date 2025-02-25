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

  return (
    <View style={styles.container}>
      <View style={styles.ImageContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#00e0ff" />
        ) : (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              🚀 %{Math.round(progress * 100)} TAMAMLANDI
            </Text>

            {/* Çerçeveli Progress Bar */}
            <View style={styles.progressBarWrapper}>
              <LinearGradient
                  colors={["red", "#ffcc00"]} // Degrade efekti
                style={[styles.progressFill, { width: `${progress * 100}%` }]}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ImageContainer: {
    flexDirection: "row",
  },

  progressContainer: {
    marginVertical: 12,
    alignItems: "center",
    width: "100%",
  },

  progressText: {
    fontSize: 18, // Daha büyük ve net yazı
    fontWeight: "bold",
    color: "#e0e0e0",
    marginBottom: 10, // Çubuğun üstünde boşluk
    textAlign: "center",
  },

  progressBarWrapper: {
    width: 300, // Daha geniş
    height: 25, // Daha dolgun
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Hafif beyaz arkaplan
    borderRadius: 15, // Daha yuvarlak kenarlar
    overflow: "hidden", // Taşmayı engeller
    borderWidth: 2, // Çerçeve efekti
    borderColor: "#00e0ff", // Şık çerçeve rengi
  },

  progressFill: {
    height: "100%",
    borderRadius: 15, // İç dolguyu da yuvarlak yap
  },
});

