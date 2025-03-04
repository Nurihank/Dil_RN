import { ScrollView, Image, StyleSheet, Text, View, ActivityIndicator, FlatList } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressBars from '../component/ProgressBars'; // ProgressBars olarak import edildi
import { Calendar } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import TestSonucu from '../component/TestSonucu';
export default function ProfileScreen() {

  const [userId, setUserId] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // Başlangıçta null olarak ayarlandı
  const [markedDates, setMarkedDates] = useState({}); // State for marked dates

  const handleDayPress = (day) => {
    console.log(day.dateString);
  }; 

  const setMarkedDatesApi = async () => { /* günlük giriş yaptığımız günleri takvimde set etmek için  */
    const response = await api.get("/kullanici/GunlukGiris", {
      params: {
        KullaniciID: userId
      }
    })
    const data = response.data.message
    const marked = data.reduce((acc, item) => {
      const localDate = new Date(item.Tarih); // Tarihi Date objesine çevir
      localDate.setDate(localDate.getDate() + 1); // UTC farkını düzelt

      const dateKey = localDate.toISOString().split('T')[0]; // YYYY-MM-DD formatına getir
      acc[dateKey] = {
        marked: true,
        dotColor: 'green',
      };
      return acc;
    }, {});
    setMarkedDates(marked);
  }
  // Kullanıcı bilgilerini al
  const getUserInfo = async () => {
    const id = await AsyncStorage.getItem("id");
    setUserId(id);
    try {
      const response = await api.get("/kullanici/KullaniciBilgileri", {
        params: {
          id: id    
        },
      });
      setUser(response.data.user[0]);
      setLoading(false);
    } catch (error) {
    }  
  };

  // useFocusEffect ile ekran odaklandığında veri yenileme
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await getUserInfo();
        await setMarkedDatesApi()
      }
      fetchData()
    }, [userId])
  );

  const renderItem = () => {
    if (!userId || !user) {
      return <Text style={styles.errorText}>Kullanıcı bilgileri bulunamadı veya hata oluştu.</Text>;
    }

    return (
      <>
        <View style={styles.profileImageContainer}>
          <Image source={require("../assets/profile-default.jpg")} style={styles.imageStyle} />
        </View>
        <Text style={styles.username}>{user?.kullaniciAdi || "Bilinmeyen Kullanıcı"}</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Meslek</Text>
          <Text style={styles.infoText}>{user?.meslek || "Bilinmiyor"}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Ana Dili</Text>
          <Text style={styles.infoText}>{user?.dil || "Bilinmiyor"}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Öğrendiğin Dil</Text>
          <Text style={styles.infoText}>{user?.OgrenilecekDil ? `${user.OgrenilecekDil} Öğreniyor` : "Bilinmiyor"}</Text>
        </View>
        
        <TestSonucu KullaniciID={userId} />

        <Calendar onDayPress={handleDayPress} markedDates={markedDates} style={styles.calendar} />
      </>
    );
  };

  return (
    <FlatList
      data={userId && user ? [{ key: "profileScreen" }] : []} // Eğer user null ise listeyi boş gönder
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
      ListEmptyComponent={<Text style={styles.errorText}>Kullanıcı bilgileri bulunamadı veya hata oluştu.</Text>}
      ListHeaderComponent={loading ? (
        <ActivityIndicator style={styles.loadingContainer} size="large" color="#3A8DFF" />
      ) : null}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F4F4F4', // Yumuşak gri arka plan
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  imageStyle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#E0E0E0', // Soft border
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1E1E1E', // Koyu başlık rengi
  },
  infoContainer: {
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1E1E1E', // Koyu renk başlık
  },
  infoText: {
    fontSize: 18,
    color: '#555555', // Daha yumuşak metin rengi
    borderWidth: 1,
    borderColor: '#E0E0E0', // Soft border for info text
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF', // Beyaz arka plan
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#FF6347', // Kırmızı hata mesajı
  },
  calendar: {
    width: '100%',
    marginTop: 25,
    borderRadius: 12, // Daha yuvarlak kenarlar
    backgroundColor: '#F7F9FC', // Hafif bir mavi-gri tonu
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5, // Android için gölge efekti
    padding: 10, // Takvim içeriğine biraz boşluk ekleme
  },
  selectedDateText: {
    marginTop: 20,
    fontSize: 18,
    marginBottom: 65,
  },
});