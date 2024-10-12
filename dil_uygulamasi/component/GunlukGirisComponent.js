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
      console.log(userId);
      const response = await api.get("/kullanici/GunlukGiris", {
        params: { 
          KullaniciID: userId
        }  
      });
  
      const gunlukVerileri = response.data.message;
  
      // Günleri tarih formatında saklayacağız 
      const gunler = gunlukVerileri.map(entry => new Date(entry.Tarih).toISOString().split('T')[0]);
  
      // Günleri benzersiz ve sıralı hale getiriyoruz
      const benzersizGunler = [...new Set(gunler)].sort((a, b) => new Date(b) - new Date(a));
  
      // Ardışık günleri saymak için bir değişken tanımlıyoruz
      let ardışıkGunSayısı = 0;
  
      for (let i = 0; i < benzersizGunler.length; i++) {
        const gün = new Date(benzersizGunler[i]);
        // Eğer ilk gün ise veya bir önceki gün ile aynı değilse gün sayısını artırıyoruz
        if (i === 0 || (gün.getTime() === new Date(benzersizGunler[i - 1]).getTime() - 86400000)) {
          ardışıkGunSayısı++;
        } else {
          break; // Eğer ardışık değilse döngüden çıkıyoruz
        }
      }
   
      // Sonuçları state'e kaydediyoruz 
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
        <Text style={styles.title}>Gün Serisi</Text>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    margin: 10,
    flexDirection: "row", // Yönlendirme sütun olarak ayarlandı
  },
  iconContainer: {
    alignItems: 'center',
    position: 'relative', // Pozisyon ayarı ile yazıyı ikon üzerine yerleştiriyoruz
  },
  icon: {
    height: 40,
    width: 40,
  },
  count: {
    position: 'absolute', // Pozisyonu mutlak olarak ayarlıyoruz
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4500',
    top: 8, // İkonun üst kısmına konumlandırıyoruz
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10, // Başlık için biraz boşluk veriyoruz
  },
});
