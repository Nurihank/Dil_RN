import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function SozlukEkrani() {
  const [userId, setUserId] = useState(null);
  const [kelimeler, setKelimeler] = useState([]);

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
        console.log("API Response:", response.data.message); // API yanıtını kontrol edin
        setKelimeler(response.data.message || []);
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
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.Ceviri}</Text>
      <Text style={styles.itemText}>{item.Value}</Text>
    </View>
  );

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
    padding: 10,
  },
  itemContainer: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    elevation: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemText: {
    fontSize: 16,
  },
});
