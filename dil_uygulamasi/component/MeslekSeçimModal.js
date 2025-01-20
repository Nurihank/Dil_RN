import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Modal } from 'react-native-paper';
import api from '../api/api';
import { Ionicons } from '@expo/vector-icons'; // İleri gitme simgesi için ekledik
import { AntDesign } from '@expo/vector-icons'; // Geri dönme simgesi için ekledik
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MeslekSeçimModal({ visible, MeslekModalGeriTusu, MeslekSecimiOnayi }) {
  const [meslekler, setMeslekler] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);

  useEffect(() => { 
    GetAllMeslek();
  }, []);

  const GetAllMeslek = async () => {
    try {
      const response = await api.get("/kullanici/meslek");
      setMeslekler(response.data.result); // Meslekleri state'e set et

    } catch (error) {
      console.error("Error fetching meslekler:", error);
    }   
  };

  const handleOnayla = async () => {
    const id = await AsyncStorage.getItem("id")
    if (!selectedValue) {
      alert("Bir Meslek Seçmelisin");
    } else {
      try {
        const response = await api.post("/kullanici/meslekSecim", {
          id: id,
          meslek: selectedValue.idMeslek
        });
        MeslekSecimiOnayi();
      }
      catch (error) {
        console.error("Meslek seçimi kaydedilirken hata oluştu:", error);
      }
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedValue === item.idMeslek;
    return (
      <TouchableOpacity
        style={[styles.itemContainer, isSelected && styles.selectedItem]}
        onPress={() => setSelectedValue(item)}
      >
        <Image
         source={{ uri: item.meslekPathImage }} // Replace with your image URI
          style={styles.image}
        />

        <Text style={styles.textStyle}>{item.meslek}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      style={styles.modal} // Modal için genel stil
    >

      <View style={styles.container}>
        {!selectedValue ?
          <Text style={styles.textStyle}>Seçilen Meslek = </Text> :
          <Text style={styles.textStyle}>Seçilen Meslek = {selectedValue.meslek}</Text>}
        <FlatList
          data={meslekler} // FlatList'e gösterilecek veri
          renderItem={renderItem}
          numColumns={2} // İki sütunlu görünüm
          columnWrapperStyle={styles.columnWrapper} // Sütunları sarmalayan stil
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={MeslekModalGeriTusu} style={styles.button}>
            <AntDesign name="arrowleft" size={24} color="white" />
            <Text style={styles.buttonText}>Geri Dön</Text>
          </TouchableOpacity>
          {!selectedValue ?
            <TouchableOpacity style={{
              backgroundColor: "white", flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15, borderRadius: 5, width: '48%',
            }} onPress={handleOnayla}>
              <Text style={styles.buttonText}>Onayla</Text>
              <Ionicons name="checkmark-outline" size={24} color="white" />
            </TouchableOpacity>
            :
            <TouchableOpacity style={styles.onaylaButton} onPress={handleOnayla}>
              <Text style={styles.buttonText}>Onayla</Text>
              <Ionicons name="checkmark-outline" size={24} color="white" />
            </TouchableOpacity>}

        </View>
      </View>

    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)' // Modal arka plan rengi ve opaklık
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '100%', // Modal içeriği genişliği
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    margin: 5 // Kenarlar arasında boşluk
  },
  selectedItem: {
    backgroundColor: '#d0d0d0' // Seçilen öğe arka plan rengi
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100
  },
  textStyle: {
    marginTop: 10,
    fontSize: 16
  },
  columnWrapper: {
    justifyContent: 'space-between' // Sütunlar arasını boşluk bırakır
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  button: {
    backgroundColor: '#007BFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
    width: '48%', // Butonların genişliği
  },
  onaylaButton: {
    backgroundColor: '#28a745', // Yeşil renk
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
    width: '48%', // Butonların genişliği
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
    marginRight: 5
  }
});
