import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import UserModel from '../model/ModelUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import api from '../api/api';

export default function HomeScreen() {
  const [user, setUser] = useState(undefined); // Başlangıçta undefined olarak ayarla
  useEffect(() => {
    const getUser = async ()=>{
      const response = await api.get("/kullanici/KullaniciBilgileri/" + user)
      console.log(response.data.user[0].dil)
    }
    getUser()
  }, [])
  
  const fetchUser = async () => {
    try {
      const currentUser = await UserModel.getCurrentUser();
      if (currentUser && currentUser.length > 0) {
        setUser(currentUser[0].id); // Eğer kullanıcı varsa, id'yi ayarla
      } else {
        setUser(null); // Kullanıcı bulunamazsa null olarak ayarla
      }
    } catch (error) {
      console.error("Kullanıcı getirilemedi:", error);
      setUser(null); // Hata durumunda null olarak ayarla
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (user === undefined) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user ? (
        <Text style={styles.userText}>Kullanıcı ID: {user}</Text>
      ) : (
        <Text style={styles.errorText}>Kullanıcı bulunamadı</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
  },
  userText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
  },
});
