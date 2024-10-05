import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProgressBars from '../component/ProgressBars';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import UserModel from '../model/ModelUser';
import Accordion from 'react-native-collapsible/Accordion';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [Seviyeler, setSeviyeler] = useState([]);
  const [selectedSeviyeID, setSelectedSeviyeID] = useState(1);
  const [sezonlar, setSezonlar] = useState([]);
  const [bolumler, setBolumler] = useState([]);
  const [activeSections, setActiveSections] = useState([]);
  const [userId, setUserId] = useState(null);
  const [meslekID, setMeslekID] = useState();
  const [AnaDilID, setAnaDilID] = useState();
  const [sezonID, setSezonID] = useState(null);
  const [HangiDilID, setHangiDilID] = useState();
  const [gecilenBolumler,setGecilenBolumler] = useState([]);
  const [gecilenSezonlar,setGecilenSezonlar] = useState([]);

  const setUserID = async () => {
    const id = await AsyncStorage.getItem("id");
    setUserId(id);
  };

  const getUserInfo = async () => {
    const user = await UserModel.currentUser;
    setMeslekID(user[0].MeslekID);
    setHangiDilID(user[0].DilID);
    setAnaDilID(user[0].SectigiDilID);
  };

  const Oyun = (BolumID,SezonID) => {
    navigation.navigate("OyunEkrani", { id: BolumID ,SezonID:SezonID});
  };


  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await setUserID();
        await getUserInfo();
        const SeviyeGetir = async () => {
          try {
            const Seviye = await api.get("/kullanici/Seviye");
            const formattedData = Seviye.data.map(item => ({
              label: item.SeviyeAdi || 'Default Label',
              value: item.SeviyeID || 'defaultValue'
            }));
            setSeviyeler(formattedData);
          } catch (error) {
            console.log("Seviyeleri getirirken hata oluştu:", error);
          }
        };
        await SeviyeGetir();
      };
      fetchData();
    }, [])
  );

  useEffect(() => {  //sezonarı getirir
    if (selectedSeviyeID && HangiDilID) {
      const SezonlariGetir = async () => {
        try {
          const response = await api.get("/kullanici/Sezon", {
            params: {
              SeviyeID: selectedSeviyeID,
              HangiDilID: HangiDilID,
            },
          });
          setSezonlar(response.data);
        } catch (error) {
          console.log("Sezonları getirirken hata oluştu:", error);
        }
      };
      SezonlariGetir();
    }
  }, [selectedSeviyeID, HangiDilID]);

  const BolumleriGetir = async (sezonID) => { //bölümleri getirir
    try {
      const response = await api.get("/kullanici/Bolum", {
        params: {
          SezonID: sezonID,
          HangiDilID: HangiDilID
        },
      });
      setBolumler(response.data);
    } catch (error) {
      console.log("Bölümleri getirirken hata oluştu:", error);
    }
  };
  
  useEffect(() => {  //gecilen sezonları getirir
    const GecilenSezonlarGetir = async () => {
      try {
        const response = await api.get("/kullanici/GecilenSezonlar", {
          params: {
            KullaniciID: userId,
            SeviyeID: selectedSeviyeID
          }
        });
        console.log(response.data.message)
        setGecilenSezonlar(response.data.message);
      } catch (error) {
        console.log("Sezonları getirirken hata oluştu:", error);
      }
    };

    // Sadece userId ve selectedSeviyeID mevcut olduğunda çağır
    if (userId && selectedSeviyeID) {
      GecilenSezonlarGetir();
    }
  }, [userId, selectedSeviyeID]);

  useEffect(()=>{ //gecilen bölümleri getirir
    const GecilenBolumlerGetir = async()=>{
      const response = await api.get("/kullanici/GecilenBolumler",{
        params:{
          KullaniciID:userId,
          SezonID:sezonID
        }
      })
      setGecilenBolumler(response.data.message)
    }
    GecilenBolumlerGetir()
  },[sezonID])


  const renderAccordionHeader =  (section) => {
    console.log("a")
    return (
      <View style={styles.accordionHeader}>
        <Text style={styles.headerText}>{section.Ceviri}</Text>
      </View>
    );
  }; 

  const renderAccordionContent = (section) => {
    const gecilenBolumlerArray = Array.isArray(gecilenBolumler) ? gecilenBolumler : [];

    return (
      <View style={styles.accordionContent}>
        {bolumler.map((bolum, index) => { //bolumler dizisinde değişiklikler yapar
          const isCompleted = gecilenBolumlerArray.some( //some fonksiyonu içine belirli bir koşul yazıyosun true false eödndürüyor
            (completedBolum) => completedBolum.BolumID === bolum.BolumID
          );
  
          const nextBolumToOpen = gecilenBolumlerArray.find( //bir sonraki leveli buluyor
            (completedBolum) => completedBolum.Order == (parseInt(bolum.Order) - 1)
          );
  
          const shouldOpen = isCompleted ||  //bölüm açık mı değil diye kontrol ediyor
                             (nextBolumToOpen && bolum.Order == (parseInt(nextBolumToOpen.Order) + 1)) || 
                             (gecilenBolumlerArray.length === 0 && index === 0);
  
          return (
            <View key={index} style={styles.bolumContainer}>
          
              {shouldOpen ? (
                <>
                  <Text style={styles.bolumText}>{bolum.Ceviri}</Text>
                  <TouchableOpacity style={styles.iconContainer} onPress={() => Oyun(bolum.BolumID,sezonID)}>
                    <FontAwesome name="gamepad" size={24} color="#3498db" />
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.lockedText}>Kilitli</Text> 
              )}
            </View>
          );
        })}
      </View>
    );
  };
  
  const updateSections = (activeSections) => {
    setActiveSections(activeSections);
    if (activeSections.length > 0) {
      const selectedSezonID = sezonlar[activeSections[0]].SezonID;
      setSezonID(selectedSezonID);
      BolumleriGetir(selectedSezonID);
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
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Seviye Seç:</Text>
          <RNPickerSelect
            placeholder={placeholder}
            items={Seviyeler}
            onValueChange={(value) => setSelectedSeviyeID(value)}
            value={selectedSeviyeID}
            style={pickerSelectStyles}
          />
          <TouchableOpacity style={styles.eğitimButton} onPress={() => { navigation.navigate("Egitim", { id: selectedSeviyeID }) }}>
            <FontAwesome name="book" size={24} color="#ffffff" />
            <Text style={styles.eğitimText}>Eğitim</Text>
          </TouchableOpacity>
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
    backgroundColor: '#f7f7f7',
    padding: 16,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  pickerContainer: {
    width: '100%',
    marginVertical: 16,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  accordionHeader: {
    backgroundColor: '#3498db',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 3,
    width: '100%',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  accordionContent: {
    backgroundColor: '#ecf0f1',
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
  },
  bolumContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  bolumText: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1,
  },
  iconContainer: {
    paddingLeft: 10,
  },
  eğitimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  eğitimText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 8,
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  inputAndroid: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
});
