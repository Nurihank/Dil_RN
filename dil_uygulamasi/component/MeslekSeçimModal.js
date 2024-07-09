import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Modal } from 'react-native-paper';
import api from '../api/api';
import { RadioButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons'; // İleri gitme simgesi için ekledik
import { AntDesign } from '@expo/vector-icons'; // Geri dönme simgesi için ekledik
import UserModel from '../model/ModelUser';
import DilSeçimModal from './DilSeçimModal';

export default function MeslekSeçimModal({ visible, GeriTusu }) {
  const [meslekler, setMeslekler] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [userID, setUserID] = useState(null);
  const user = UserModel.getCurrentUser(); // Kullanıcının id'sini almak için

  const [DilSecimModalVisible, setDilSecimModalVisible] = useState(false);

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
    if (!selectedValue) {
      alert("Bir Meslek Seçmelisin");
    } else {
      try {
        const response = await api.post("/kullanici/meslekSecim", {
          id: user[0].id,
          meslek: selectedValue
        });
        console.log("Meslek seçimi başarıyla kaydedildi");
        setDilSecimModalVisible(true);
      } catch (error) {
        console.error("Meslek seçimi kaydedilirken hata oluştu:", error);
      }
    }
  };

  const handleCloseDilSecimModal = () => {
    setDilSecimModalVisible(false);
  };

  return (
    <Modal
      visible={visible}
      style={styles.modal} // Modal için genel stil
    >
      <View style={styles.container}>
        <FlatList
          data={meslekler} // FlatList'e gösterilecek veri
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <RadioButton
                value={item.idMeslek}
                status={selectedValue === item.idMeslek ? "checked" : "unchecked"}
                onPress={() => setSelectedValue(item.idMeslek)}
                color="darkgrey"
              />
              <Text style={styles.textStyle}>{item.meslek}</Text>
            </View>
          )}
          keyExtractor={(item) => item.idMeslek.toString()}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={GeriTusu} style={styles.button}>
            <AntDesign name="arrowleft" size={24} color="white" />
            <Text style={styles.buttonText}>Geri Dön</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.onaylaButton} onPress={handleOnayla}>
            <Text style={styles.buttonText}>Onayla</Text>
            <Ionicons name="checkmark-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <DilSeçimModal visible={DilSecimModalVisible} handleClose={handleCloseDilSecimModal} />
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
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%', // Modal içeriği genişliği
    maxHeight: '100%' // Modal maksimum yüksekliği
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  textStyle: {
    marginLeft: 10,
    fontSize: 16
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
