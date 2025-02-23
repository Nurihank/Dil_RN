import { Image, StyleSheet, Text, View } from 'react-native';
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
        <Image style={styles.icon} source={require("../assets/fire.png")} />
        <Text style={styles.count}>{gunSerisi}</Text> 
      </View>
    <Text style={styles.title}>Gün</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Şeffaf mor
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: 120,
    height: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 5,
    tintColor: "#FFA500", // Turuncu ateş efekti
  },
  count: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFF",
  },
  title: {
    fontSize: 14,
    color: "#F6E6FF",
  },
});

