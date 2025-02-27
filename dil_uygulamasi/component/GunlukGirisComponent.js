import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import api from '../api/api';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GunlukGirisComponent() {
  const [userId, setUserId] = useState(null);
  const [gunSerisi, setGunSerisi] = useState(null);

  const setUserID = async () => {
    const id = await AsyncStorage.getItem("id");
    setUserId(id);
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await setUserID();
      };
      fetchData();
    }, [])
  );

  useEffect(() => {
    if (userId) {
      GunlukGirisiGetir();
    }
  }, [userId]);

  const GunlukGirisiGetir = async () => {
    try {
      const response = await api.get("/kullanici/GunlukGiris", {
        params: { 
          KullaniciID: userId
        }  
      });
  
      const gunlukVerileri = response.data.message;
  
      const gunler = gunlukVerileri.map(entry => new Date(entry.Tarih).toISOString().split('T')[0]);
  
      const benzersizGunler = [...new Set(gunler)].sort((a, b) => new Date(b) - new Date(a));
  
      let ardışıkGunSayısı = 0;
  
      for (let i = 0; i < benzersizGunler.length; i++) {
        const gün = new Date(benzersizGunler[i]);
        if (i === 0 || (gün.getTime() === new Date(benzersizGunler[i - 1]).getTime() - 86400000)) { 
          ardışıkGunSayısı++;
        } else { 
          break;
        }
      }
      setGunSerisi(ardışıkGunSayısı);
    } catch (error) { 
      console.error("Hata:", error);
    }  
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {Array.from({ length: 7 }, (_, index) => {
          const minGun = Math.max(1, gunSerisi - 3); // İlk 4'lünün başlangıç günü
          const gunIndex = minGun + index; // Hangi gün gösterilecek
          const isActive = index < 4; // İlk 4 tanesi renkli, son 3 tanesi gri

          return (
            <View key={index} style={styles.iconWrapper}>
              <Text style={[styles.gunText, { color: isActive ? "white" : "gray" }]}>
                {gunIndex}
              </Text>
              <Image
                style={[styles.icon, { tintColor: isActive ? "#FFD700" : "gray" }]}
                source={require("../assets/fire.png")}
              />
            </View>
          );
        })}
      </View>
      <Text style={styles.title}>Gün</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: 270,
    height: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  iconContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 7,
    tintColor: "#FFD700", // Turuncu ateş efekti
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color:"white"
  },gunText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

