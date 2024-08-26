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
  const [sezon, setSezon] = useState([]);
  const[bolum,setBolum] = useState([])
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
          setSezon(response.data);
          console.log(response.data)
        } catch (error) {
          console.log("Sezonları getirirken hata oluştu:", error);
        }
      };
      SezonlariGetir();
    }
  }, [selectedSeviyeID, HangiDilID]);

  const placeholder = {
    label: 'Seviye Seç',
    value: null,
  };

 
  const renderHeader = (section) => {  //başlık
    return (
      <View style={styles.accordionHeader}>
        <Text style={styles.headerText}>{section.Ceviri}</Text>
      </View>
    );
  };
 
  const renderContent = (section) => { //tıkladığımda açılan ekranın içeriği

    const BolumGetir =async ()=>{
      const response = await api.get("/kullanici/Bolum",{
        params:{
          SezonID:section.SezonID,
          HangiDilID:HangiDilID
        }
      })
      console.log(response.data)
      setBolum(response.data)
    }
    BolumGetir();
    return (
      <View style={styles.accordionContent}>
        <Text>{bolum.Ceviri}</Text>
      </View>
    );
  };

  const updateSections = (activeSections) => { //accordionun açılmasını sağlıyor
    console.log(activeSections)
    
    
    setActiveSections(activeSections);
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
          sections={sezon}
          activeSections={activeSections}
          renderHeader={renderHeader}
          renderContent={renderContent}
          onChange={updateSections}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  accordionHeader: {
    backgroundColor: '#f1c40f',
    padding: 10,
    marginVertical: 5,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  accordionContent: {
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
});
