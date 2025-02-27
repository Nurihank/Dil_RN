import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProgressBars from '../component/ProgressBars';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import UserModel from '../model/ModelUser';
import Accordion from 'react-native-collapsible/Accordion';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import GunlukGirisComponent from '../component/GunlukGirisComponent';
import Fontisto from '@expo/vector-icons/Fontisto';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ route }) {
  const navigation = useNavigation();
  const [Seviyeler, setSeviyeler] = useState([]);
  const [selectedSeviyeID, setSelectedSeviyeID] = useState(1);
  const [sezonlar, setSezonlar] = useState([]);
  const [bolumler, setBolumler] = useState([]);
  const [activeSections, setActiveSections] = useState([]);
  const [userId, setUserId] = useState(null);
  const [meslekID, setMeslekID] = useState();
  const [sezonID, setSezonID] = useState(null);
  const [HangiDilID, setHangiDilID] = useState();
  const [gecilenBolumler, setGecilenBolumler] = useState([]);
  const [gecilenSezonlar, setGecilenSezonlar] = useState([]);
  const [gecilenSeviyeler, setGecilenSeviyeler] = useState([])
  const [acikSeviyeler, setAcikSeviyeler] = useState([])

  const setUserID = async () => {
    const id = await AsyncStorage.getItem("id");
    setUserId(id);
  };

  const getUserInfo = async () => {
    const user = await UserModel.currentUser;
    setMeslekID(user[0].MeslekID);
    setHangiDilID(user[0].DilID);
  };

  const Oyun = (BolumID, SezonID, SeviyeID) => {
    navigation.navigate("OyunEkrani", { BolumID: BolumID, SezonID: SezonID, SeviyeID: SeviyeID });
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

    }, [userId])
  );

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

  useEffect(() => {  //sezonarı getirir 
    if (selectedSeviyeID && HangiDilID) {
      SezonlariGetir();
    }
  }, [selectedSeviyeID, HangiDilID]);

  const BolumleriGetir = async (sezonID) => { //bölümleri getirir
    try {
      const response = await api.get("/kullanici/Bolum", {
        params: {
          SezonID: sezonID,
          HangiDilID: HangiDilID,
          MeslekID: meslekID
        },
      });
      setBolumler(response.data);
    } catch (error) {
      console.log("Bölümleri getirirken hata oluştu:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const gecilenSeviyeleriGetir = async () => {
        const response = await api.get("/kullanici/GecilenSeviyeler", {
          params: {
            KullaniciID: userId
          }
        })
        setGecilenSeviyeler(response.data.message)
      }
      gecilenSeviyeleriGetir()

    }, [userId])
  )

  useEffect(() => {
    const seviye = GozukecekSeviyeler()
    setAcikSeviyeler(seviye)
  }, [gecilenSeviyeler])

  const GozukecekSeviyeler = () => {
    const acikSeviyeSayisi = gecilenSeviyeler.length + 1;

    return Seviyeler
      .filter((_, index) => index < acikSeviyeSayisi) // Sadece açık olan seviyeleri al
      .map(seviye => ({
        label: seviye.label, // RNPickerSelect için 'label' ve 'value' formatına çeviriyoruz
        value: seviye.value,
      }));
  };

  useFocusEffect(   //gecilen sezonları getirir
    useCallback(() => {
      const GecilenSezonlarGetir = async () => {
        try {
          const response = await api.get("/kullanici/GecilenSezonlar", {
            params: {
              KullaniciID: userId,
              SeviyeID: selectedSeviyeID
            }
          });

          setGecilenSezonlar(response.data.message);
        } catch (error) {
          console.log("Sezonları getirirken hata oluştu:", error);
        }
      };

      // Sadece userId ve selectedSeviyeID mevcut olduğunda çağır
      if (userId && selectedSeviyeID) {
        GecilenSezonlarGetir();
      }
    }, [userId, selectedSeviyeID])
  )

  useFocusEffect(   //gecilen bölümleri getirir
    useCallback(() => {
      const GecilenBolumlerGetir = async () => {
        const response = await api.get("/kullanici/GecilenBolumler", {
          params: {
            KullaniciID: userId,
            SezonID: sezonID
          }
        })
        setGecilenBolumler(response.data.message)
      }
      GecilenBolumlerGetir()
    }, [sezonID])
  )




  const renderAccordionHeader = (content, index, isActive, sections) => {
    // Geçilen sezonlar dizisini kontrol et, eğer yoksa boş bir dizi kullan
    const gecilenSezonlarArray = Array.isArray(gecilenSezonlar) ? gecilenSezonlar : [];

    // Bu sezona ait bilgileri al
    const sezonID = content.SezonID;
    const sezonOrder = content.Order;

    // Bu sezonun tamamlanıp tamamlanmadığını kontrol et
    const isCompletedSeason = gecilenSezonlarArray.some(
      (completedSeason) => completedSeason.SezonID === sezonID
    );

    // Geçilen sezonlar içinde en yüksek Order'a sahip son tamamlanmış sezonu bul
    const lastCompletedSeason = gecilenSezonlarArray.reduce(
      (prev, current) => (current.Order > prev.Order ? current : prev),
      { Order: 0 }
    );

    // Bu sezonun açık olup olmadığını belirle
    const shouldOpen = isCompletedSeason ||
      sezonOrder <= (parseInt(lastCompletedSeason.Order) + 1) ||
      (gecilenSezonlarArray.length === 0 && sezonOrder === 1);

    return (
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => {
          if (!shouldOpen) return;
        }}
        disabled={shouldOpen} // Kilitli ise tıklanabilirliği devre dışı bırak
      >
        <View>
          {shouldOpen ? (
            <View style={styles.headerContainer}>
              {isCompletedSeason ? (
                <View>
                  <FontAwesome name="check-circle" size={24} color="#2ecc71" />
                  <Text style={styles.headerText}>{content.Ceviri}</Text>
                </View>
              ) : (
                <Text style={styles.headerText}>{content.Ceviri}</Text>
              )}
            </View>
          ) : (
            <Text style={styles.lockedText}>{content.Ceviri}</Text>
          )}
        </View>
      </TouchableOpacity>
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
                  <TouchableOpacity style={styles.iconContainer} onPress={() => Oyun(bolum.BolumID, sezonID, selectedSeviyeID)}>
                    <FontAwesome name="gamepad" size={24} color="#3498db" />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.bolumText}>{bolum.Ceviri}</Text>
                  <TouchableOpacity style={styles.lockediconContainer} >
                    <Fontisto name="locked" size={24} color="black" />
                  </TouchableOpacity>
                </>)}
            </View>
          );
        })}
      </View>
    );
  };

  const updateSections = (activeSections) => {
    console.log(activeSections)
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
    <ScrollView style={styles.mainContainer}>
      <LinearGradient
      colors={['#4a0a77', '#3c0663', '#310055', '#28003d']}
locations={[0, 0.4, 0.7, 1]}
 
      


        style={{ flex: 1 }}
      >
        <View style={styles.container}>

          <View style={styles.topContainer}>
            <View style={styles.leftContainer}>
              <GunlukGirisComponent />
            </View>
          </View>
          <View style={styles.pickerContainer}>
          
            <View style={styles.separator} />
            <ProgressBars KullaniciID={userId} SeviyeID={selectedSeviyeID} />
            <View style={styles.separator} />

            <Text style={[styles.pickerLabel]}>
              Seviye Seç:
            </Text>

            <RNPickerSelect
              placeholder={{ label: "Bir seviye seçin", value: null }}
              items={acikSeviyeler} // Sadece açık seviyeler
              onValueChange={(value) => setSelectedSeviyeID(value)}
              value={selectedSeviyeID}
              style={pickerSelectStyles}
            />
            <View>
              <TouchableOpacity
                style={styles.eğitimButton}
                onPress={() => { navigation.navigate("Egitim", { id: selectedSeviyeID }) }}
              >
                <FontAwesome name="book" size={24} color="#fff" style={styles.eğitimIcon} />
                <Text style={styles.eğitimText}>Seviye Eğitimi</Text>
              </TouchableOpacity>

            </View>

          </View>
          <Accordion
            sections={sezonlar}
            activeSections={activeSections}
            renderHeader={renderAccordionHeader}
            renderContent={renderAccordionContent}
            onChange={updateSections}
          />
          <Accordion
            sections={sezonlar}
            activeSections={activeSections}
            renderHeader={renderAccordionHeader}
            renderContent={renderAccordionContent}
            onChange={updateSections}
          />
          <Accordion
            sections={sezonlar}
            activeSections={activeSections}
            renderHeader={renderAccordionHeader}
            renderContent={renderAccordionContent}
            onChange={updateSections}
          />
        </View>
      </LinearGradient>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: 30
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  pickerContainer: {
    width: '100%',
    padding: 7
  },
  pickerLabel: {
    fontSize: 25, // Çok büyük olmadan belirgin
    fontWeight: 'bold',
    marginBottom: 6, // Picker ile arası çok açılmasın
    color: 'rgb(230, 230, 230)', // Daha koyu ama yumuşak bir ton (Gri-Mavi)
    textAlign: 'left', // **Sola hizalandı**
    paddingLeft: 8, // Biraz içeriden başlasın
    textTransform: 'capitalize', // Baş harfi büyük
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Vertically centers the items in the row
    justifyContent: 'space-between', // Distribute space between text and icons
    width: 350,
  },
  accordionHeader: {
    backgroundColor: '#5a108f',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10, // YAN BOŞLUĞU SABİTLE
    borderRadius: 12,
    elevation: 5,
    height: 60,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: "800",
    color: '#e0c3fc',
    flexShrink: 1, // Ensures text doesn’t overflow beyond the container
    numberOfLines: 1, // Truncate long text
    ellipsizeMode: 'tail', // Add "..." at the end if text is too long
  },
  accordionContent: {
    backgroundColor: '#ecf0f1', // Açık gri tonu
    padding: 15,
    borderRadius: 12,
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
    fontSize: 18,
    color: '#2c3e50',
    flex: 1,
  },
  iconContainer: {
    paddingLeft: 10,
  },
  eğitimButton: {
    flexDirection: 'row',  // İkon ve yazıyı yan yana getir
    alignItems: 'center',  // Dikey hizalama
    justifyContent: 'center', // Yatay ortalama
    backgroundColor: '#8b2fc9', // Soft mor tonu (Daha modern)
    paddingVertical: 12, // Daha rahat dokunma alanı
    paddingHorizontal: 16,
    borderRadius: 12, // Yumuşak köşeler
    shadowColor: '#6A5ACD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Android için gölge efekti
    marginTop: 10
  },
  eğitimIcon: {
    marginRight: 8, // İkon ile yazı arasında boşluk
  },
  eğitimText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF', // Beyaz yazı rengi
    textTransform: 'uppercase', // Tamamen büyük harf
    letterSpacing: 1, // Harfler arası boşluk
  },
  lockedText: {
    fontSize: 17,
    color: '#e74c3c', // Kilitli metin için kırmızı
    fontStyle: 'italic',
    fontWeight:"bold"
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15, // Kenar boşluğu ekle
    paddingVertical: 10,
  },
  leftContainer: {
    flex: 1, // Günlük giriş ikonunu sola it
    alignItems: "flex-start",
  },
  premiumButton: {
    alignItems: "flex-end",
  },
  premiumIcon: {
    height: 50, // Biraz daha büyük
    width: 50,
    bottom: 25
  }, 
  separator: {
    height: 2, // Çizgi kalınlığı
    backgroundColor: "rgba(255, 255, 255, 0.5)", // Şeffaf beyaz çizgi
    borderRadius: 1, // Daha yumuşak çizgi
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#7B68EE', // Yumuşak bir mor tonu (Pastel)
    borderRadius: 12, // Hafif daha oval
    backgroundColor: '#F8F8FF', // Hafif gri-beyaz arası soft renk
    fontSize: 17,
    color: '#4B0082', // Koyu mor tonu (Soft ama belirgin)
    elevation: 4, // Hafif yükseltme efekti
    shadowColor: "#7B68EE",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  inputAndroid: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#7B68EE', // Android için de aynı border
    borderRadius: 12,
    backgroundColor: '#F8F8FF',
    fontSize: 17,
    color: '#4B0082',

  },
});


