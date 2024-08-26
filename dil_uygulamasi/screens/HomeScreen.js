import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProgressBars from '../component/ProgressBars';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import UserModel from '../model/ModelUser';
import Accordion from 'react-native-collapsible/Accordion';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [Seviyeler, setSeviyeler] = useState([]);
  const [selectedSeviyeID, setSelectedSeviyeID] = useState(null);
  const [sezonlar, setSezonlar] = useState([]);
  const [bolumler, setBolumler] = useState([]);
  const [activeSections, setActiveSections] = useState([]); // Accordion için gerekli
  const [userId, setUserId] = useState(null);
  const [meslekID, setMeslekID] = useState();
  const [AnaDilID, setAnaDilID] = useState(); // bu hep İngilizce ID'si
  const [HangiDilID, setHangiDilID] = useState();

  const setUserID = async () => {
    const id = await AsyncStorage.getItem("id");
    setUserId(id);
  };

  const getUserInfo = async () => {
    const user = await UserModel.currentUser;
    setMeslekID(user[0].MeslekID);
    setHangiDilID(user[0].DilID);
    setAnaDilID(user[0].SectigiDilID); // bu hep İngilizce
  };

  useEffect(() => {
    setUserID();
    getUserInfo();
    const SeviyeGetir = async () => {
      const Seviye = await api.get("/kullanici/Seviye");
      const formattedData = Seviye.data.map(item => ({
        label: item.SeviyeAdi || 'Default Label',
        value: item.SeviyeID || 'defaultValue'
      }));
      setSeviyeler(formattedData);
    };
    SeviyeGetir();
  }, []);

  useEffect(() => {
    if (selectedSeviyeID && HangiDilID) {
      const SezonlariGetir = async () => {
        try {
          const response = await api.get("/kullanici/Sezon", {
            params: {
              SeviyeID: selectedSeviyeID,
              HangiDilID: HangiDilID,
            },
          });
          console.log(response.data)
          setSezonlar(response.data);
        } catch (error) {
          console.log("Sezonları getirirken hata oluştu:", error);
        }
      };
      SezonlariGetir();
    }
  }, [selectedSeviyeID, HangiDilID]);

  // Bölümleri Getir
  const BolumleriGetir = async (sezonID) => {
    try {
      const response = await api.get("/kullanici/Bolum", {
        params: {
          SezonID: sezonID,
          HangiDilID:HangiDilID
        },
      });
      console.log(response.data)
      setBolumler(response.data);
    } catch (error) {
      console.log("Bölümleri getirirken hata oluştu:", error);
    }
  };

  const renderAccordionHeader = (section) => { //Accordion'un başlık kısmını render eder. 
    return (
      <View style={styles.accordionHeader}>
        <Text style={styles.headerText}>{section.Ceviri}</Text>
      </View>
    );
  };

  const renderAccordionContent = (section) => { //Accordion'un içerik kısmını render eder.
    return (
      <View style={styles.accordionContent}>
        {bolumler.map((bolum, index) => (
          <Text key={index}>{bolum.Ceviri}</Text>
        ))}
      </View>
    );
  };

  const updateSections = (activeSections) => { //Aktif olan Accordion bölümlerini günceller.
    setActiveSections(activeSections);
    if (activeSections.length > 0) {
      const selectedSezonID = sezonlar[activeSections[0]].SezonID;
      BolumleriGetir(selectedSezonID); // Seçili sezonun bölümlerini getir
    }
  };

  const placeholder = {
    label: 'Seviye Seç',
    value: null,
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <ProgressBars />
        <View>
          <Text>Select an option:</Text>
          <RNPickerSelect
            placeholder={placeholder}
            items={Seviyeler}
            onValueChange={(value) => setSelectedSeviyeID(value)}
            value={selectedSeviyeID}
          />
        </View>
        <Accordion
          sections={sezonlar}
          activeSections={activeSections}
          renderHeader={renderAccordionHeader}
          renderContent={renderAccordionContent}
          onChange={updateSections}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f7f7f7', // Daha yumuşak bir arka plan rengi
    padding: 16,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  accordionHeader: {
    backgroundColor: '#3498db', // Canlı mavi renk başlıklar için
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 3, // Android için gölge efekti
    shadowColor: '#000', // iOS için gölge efekti
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff', // Beyaz yazı rengi
  },
  accordionContent: {
    backgroundColor: '#ecf0f1', // Hafif gri içerik arka planı
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
  },
});
