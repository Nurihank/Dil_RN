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
    <Text style={styles.title}>Gün Serisi</Text>
      <View style={styles.iconContainer}>
        <Image style={styles.icon} source={require("../assets/fire.png")} />
        <Text style={styles.count}>{gunSerisi}</Text> 
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 10,
    margin: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 50,
    width: 50,
    marginBottom: 10,
  },
  count: {
    position: 'absolute',
    fontSize: 30,
    fontWeight: 'bold',
    color: 'red',
    top: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 5,
  },
});
