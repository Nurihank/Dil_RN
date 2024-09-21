import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function SozlukEkrani() {
  const [userId, setUserId] = useState(null);
  const [kelimeler, setKelimeler] = useState([]);
  const [gosterimDurumu, setGosterimDurumu] = useState({});

  // Kullanıcı ID'sini AsyncStorage'dan al
  const getUserID = async () => {
    const id = await AsyncStorage.getItem("id");
    setUserId(id);
  };

  // Kullanıcının sözlüğünü API'den al
  const KelimeleriGetir = async (userId) => {
    if (userId) {
      try {
        const response = await api.get("/kullanici/SozluguGetir", {
          params: { KullaniciID: userId }
        });
        setKelimeler(response.data.message || []);
        // Başlangıçta tüm kelimeler kapalı
        setGosterimDurumu(response.data.message.reduce((acc, kelime) => {
          acc[kelime.Value] = false;
          return acc;
        }, {}));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await getUserID();
        if (userId) {
          await KelimeleriGetir(userId);
        }
      };
      fetchData();
    }, [userId])
  );

  // FlatList item'ları için render fonksiyonu
  const renderItem = ({ item }) => {
    const isVisible = gosterimDurumu[item.Value];
    return (
      <View style={styles.itemContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.itemText}>{item.Value}</Text>
          {isVisible && <Text style={styles.itemSubText}>{item.Ceviri}</Text>}
        </View>
        <TouchableOpacity onPress={() => {
          setGosterimDurumu(prev => ({
            ...prev,
            [item.Value]: !prev[item.Value]
          }));
        }}>
          <Image 
            source={isVisible ? require("../assets/acikGoz.png") : require("../assets/kapaliGoz.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={kelimeler}  // Veriyi FlatList'e gönderin
        renderItem={renderItem}  // Her bir item için render fonksiyonu
        keyExtractor={(item, index) => index.toString()} // Benzersiz anahtar
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    padding: 10,
  },
  itemContainer: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flexDirection: 'column',
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  itemSubText: {
    fontSize: 14,
    color: '#666666',
  },
  icon: {
    height: 40,
    width: 40,
  },
});
