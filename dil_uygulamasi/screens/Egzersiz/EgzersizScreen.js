import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/api';

export default function EgzersizScreen() {

  const navigation = useNavigation();
  const [userId, setUserId] = useState();
  const [egzersizler, setEgzersizler] = useState([]); // Verileri depolamak için state
  const [tercihModal, setTercihModal] = useState(false)
  const [oyunID, setOyunID] = useState()

  const setUserID = async () => {
    const id = await AsyncStorage.getItem("id");
    setUserId(id);
  };

  const Tercih = (id) => {
    setOyunID(id)
    setTercihModal(true)
  }

  const EgzersizeGecis = (egzersizTuru) => {
    setTercihModal(false)
    console.log(egzersizTuru)
    if (oyunID == 1) {
      navigation.navigate("HataScreen", { egzersizTuru: egzersizTuru, id: userId })
    } else if (oyunID == 2) {
      navigation.navigate("DinlemeEgzersiz", { egzersizTuru: egzersizTuru, id: userId })
    } else if (oyunID == 3) {
      /* görsel */
    } else if (oyunID == 4) {
      /* cümle çeviri */
    }
  }

  const egzersizleriGetir = async () => {
    try {
      const response = await api.get("/kullanici/egzersiz");
      setEgzersizler(response.data.message); // Gelen veriyi state'e kaydediyoruz
    } catch (error) {
      console.error("Egzersiz verisi alınırken hata oluştu", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setTercihModal(false)
      const fetchData = async () => {
        await setUserID();
        await egzersizleriGetir();
      };
      fetchData();
    }, [])
  );

  const renderEgzersiz = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => Tercih(item.id)}>
          <Text style={styles.itemText}>{item.EgzersizAdi}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>

      <FlatList
        data={egzersizler} // Veriyi burada kullanıyoruz
        renderItem={renderEgzersiz}
        keyExtractor={(item, index) => index.toString()} // Her öğe için benzersiz bir anahtar belirliyoruz
      />
      <Modal
        visible={tercihModal}
        transparent={true} // Transparan arka plan
        animationType="fade" // Modal geçişi animasyonu
        onRequestClose={() => setTercihModal(false)} // Modal'ı kapatma
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Egzersiz Tercih Edin</Text>
            <TouchableOpacity style={styles.button} onPress={() => EgzersizeGecis(0)}>
              <Text style={styles.buttonText}>Mesleki Kelimeler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => EgzersizeGecis(1)}>
              <Text style={styles.buttonText}>Temel Kelimeler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setTercihModal(false)}>
              <Text style={styles.closeButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Arka plan transparan
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
