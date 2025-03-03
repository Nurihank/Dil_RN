import { FlatList, StyleSheet, Text, View, TouchableOpacity, Image, Modal } from 'react-native';
import React, { useState } from 'react';
import api from '../../../api/api';
import * as Speech from 'expo-speech';
import { useNavigation } from '@react-navigation/native';

export default function HatalarScreen(route) {
  const [kelimeler, setKelimeler] = useState([]);
  const [gozdenGecirModal, setGozdenGecirModal] = useState(false)
  const [gozdenGecirilenKelime, setGozdenGecirilenKelime] = useState(null)

  const navigation = useNavigation()

  const Ogrendim = async (kelime) => {

    const response = await api.put("/kullanici/yanlisBilinenKelime", {
      KullaniciID: route.route.params.id,
      temelMi: route.route.params.egzersizTuru,
      KelimeID: kelime.KelimeID
    })
    setGozdenGecirModal(false)
    kelimeleriGetir()
  }

  const GozdenGecir = (kelime) => {
    setGozdenGecirilenKelime(kelime)
    setGozdenGecirModal(true)
  }

  const GunlukGorevTamamlama = async () => {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    console.log("sad")
    const response = await api.post("/kullanici/GunlukGorevHata", {
      KullaniciID: route.route.params.id,
      Date: formattedDate,
    })

    console.log(response.data)
    alert("Gunluk görev tamam")
  }

  const kelimeleriGetir = async () => {
    try {
      const response = await api.get('/kullanici/yanlisBilinenKelime', {
        params: {
          KullaniciID: route.route.params.id,
          TemelMi: route.route.params.egzersizTuru,
        },
      });
      setKelimeler(response.data.message);
      console.log(response.data.message);
    } catch (error) {
      console.error('Kelime getirme hatası:', error);
    }
  };

  const speakWord = (kelime) => {
    const options = {
      rate: 0.50,  // Adjust the speed (0.75 is slower than normal, where 1.0 is the default speed)
      pitch: 1.1,  // Adjust the pitch (1.0 is the default pitch)

      language: 'en',  // You can set the language here (e.g., 'en' for English)

      onStart: () => console.log("Speech started"),

      onDone: () => console.log("Speech finished"),
    }
    if (route.route.params.egzersizTuru == 0) {
      Speech.speak(kelime.Value, options)

    } else {
      Speech.speak(kelime.value, options)

    }
  }

  useState(() => {
    kelimeleriGetir();
    GunlukGorevTamamlama()
  }, [route.route.params.id]);

  const renderKelime = ({ item }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.kelimeText}>{item.Ceviri}</Text>
        <View style={{ flexDirection: "row" }}>
          {route.route.params.egzersizTuru == 1 ? <Text style={{ color: "gray", fontSize: 18, marginLeft: 10 }}>{item.value}</Text> : <Text style={{ color: "gray", fontSize: 18, marginLeft: 10 }}>{item.Value}</Text>}


        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => GozdenGecir(item)}>
        <Text style={styles.buttonText}>Gözden Geçir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    (kelimeler.length > 0) ?
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>
            KAPAT
          </Text>
        </TouchableOpacity>

        <View style={{ alignItems: "center", marginTop: 25 }} >
          <Text style={styles.headerText}>Hata Yaptığın Kelimeler</Text>
        </View>
        <FlatList
          data={kelimeler}
          renderItem={renderKelime}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
        />
        <Modal visible={gozdenGecirModal} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={() => setGozdenGecirModal(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>

              {gozdenGecirilenKelime && (
                <>
                  {route.route.params.egzersizTuru == 0 ?
                    <Text style={styles.modalWord}>{gozdenGecirilenKelime.Value}</Text>
                    :
                    <Text style={styles.modalWord}>{gozdenGecirilenKelime.value}</Text>
                  }
                  <Text style={styles.modalTranslation}>{gozdenGecirilenKelime.Ceviri}</Text>

                  <TouchableOpacity onPress={() => speakWord(gozdenGecirilenKelime)} style={styles.speakerButton}>
                    <Image source={require("../../../assets/microphone.png")} style={styles.speakerIcon} />
                  </TouchableOpacity>

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.learnedButton} onPress={() => Ogrendim(gozdenGecirilenKelime)}>
                      <Text style={styles.buttonText}>Öğrendim</Text>
                    </TouchableOpacity>

                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
      :
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>
            KAPAT
          </Text>
        </TouchableOpacity>
        <Text>Şu anda Hata Yaptığın Kelime bulunmuyor</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    padding: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderBottomWidth: 4,
    borderBottomColor: '#E0E0E0',
    elevation: 3,
  },
  kelimeText: {
    fontSize: 25,
    fontWeight: '600',
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#007BFF',
    marginBottom: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Arka planı bulanıklaştırıyor
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
  },
  modalWord: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  modalTranslation: {
    fontSize: 20,
    color: "#666",
    marginBottom: 20,
  },
  speakerButton: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 50,
    marginBottom: 20,
  },
  speakerIcon: {
    width: 30,
    height: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  learnedButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginRight: 5,
  },
  remindButton: {
    backgroundColor: "#FFA500",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginLeft: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

