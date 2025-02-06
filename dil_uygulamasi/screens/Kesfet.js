import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image } from "react-native";
import LottieView from 'lottie-react-native';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import api from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Kesfet = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [userID, setUserId] = useState()
  const [meslekiEgitim, setMeslekiEgitim] = useState(0)
  const [temeliEgitim, setTemelEgitim] = useState(0)
  const [sozlukTekrari, setSozlukTekrari] = useState()
  const [hatalaraBakma, setHatalaraBakma] = useState()
  const [egzersiz, setEgzersiz] = useState()

  useEffect(() => {
    setModalVisible(false);
  }, []);

  const setUserID = async () => {
    const id = await AsyncStorage.getItem("id");
    setUserId(id);
  };

  useFocusEffect(
    useCallback(() => {
      setUserID()
    }, [])
  );


  useFocusEffect(
    useCallback(() => {
      meslekiEgitimSayisi()
      temeliEgitimSayisi()
      sozlukTekrariKontrol()
      hataTekrariKontrol()
      egzersizKontrol()
    }, [userID])
  );

  const meslekiEgitimSayisi = async () => {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    const response = await api.get("/kullanici/MeslekiEgitimKontrol", {
      params: {
        KullaniciID: userID,
        Date: formattedDate
      }

    })
    setMeslekiEgitim(response.data.message)
  }

  const temeliEgitimSayisi = async () => {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    const response = await api.get("/kullanici/TemelEgitimKontrol", {
      params: {
        KullaniciID: userID,
        Date: formattedDate
      }
    })
    setTemelEgitim(response.data.message)
  }

  const sozlukTekrariKontrol = async () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD formatı

    try {
        const response = await api.get("/kullanici/SozlukTekrariKontrol", {
            params: { KullaniciID: userID, Date: formattedDate }
        });

        console.log("API Yanıtı:", response.data); // Gelen veriyi kontrol edelim

        const sozlukGiris = response.data?.message?.[0]?.SozlukGiris || 0;
      console.log(sozlukGiris)

        setSozlukTekrari(sozlukGiris);
    } catch (error) {
        console.error("Hata:", error);
    }
};


  const hataTekrariKontrol = async () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    try {
      const response = await api.get("/kullanici/GunlukGorevHataKontrol", {
        params: { KullaniciID: userID, Date: formattedDate }
      });

      console.log("API Yanıtı (Hata Tekrarı):", response.data.message);

      const hataEgzersiz = response.data?.message?.[0]?.HataEgzersiz || 0;
      console.log(hataEgzersiz)
      setHatalaraBakma(hataEgzersiz);
    } catch (error) {
      console.error("Hata:", error);
    }
  };   


  const egzersizKontrol = async () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    try {
      const response = await api.get("/kullanici/GunlukGorevEgzersizKontrol", {
        params: { KullaniciID: userID, Date: formattedDate }
      });

      console.log("API Yanıtı (Egzersiz):", response.data);

      const egzersiz = response.data?.message?.[0]?.Egzersiz || 0;
      console.log(egzersiz)

      setEgzersiz(egzersiz);
    } catch (error) {
      console.error("Hata:", error); 
    }
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("premium")}>
        <View style={styles.premiumBanner}>
          <Text style={styles.bannerText}>🌟 Premium Üye Ol! Daha Fazla Özellik Keşfet 🌟</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.content}>
        <View style={styles.animationContent}>
          <LottieView
            source={require('../assets/animasyon/first.json')}
            style={styles.animation}
          />
          <Text style={styles.first}>Bugüne Hazır Mısın?</Text>
        </View>
        <View style={styles.area}>
          <View style={{alignItems:"center"}}>
            <Text style={styles.headerText}>Günlük Yapılması Gerekenler</Text>

          </View>
          <View>
            <View style={styles.GorevAlani}>
              <Text style={styles.text}>Mesleki Eğitim  {meslekiEgitim}/3</Text>
            </View>
            <View style={styles.GorevAlani}>
              <Text style={styles.text}>Temel Eğitim {temeliEgitim}/3</Text>
            </View>
            <View style={styles.GorevAlani}>
              <Text style={styles.text}>Sözlük Tekrarı</Text>
              <Image
                source={sozlukTekrari == 1 ? require('../assets/yes.png') : require('../assets/no.png')}
                style={{ width: 30, height: 30 }}
              />
            </View>
            <View style={styles.GorevAlani}>
              <Text style={styles.text}>Hatalara Bakma</Text>
              <Image
                source={hatalaraBakma == 1 ? require('../assets/yes.png') : require('../assets/no.png')}
                style={{ width: 30, height: 30 }}
              />
            </View>
            <View style={styles.GorevAlani}>
              <Text style={styles.text}>Günlük Egzersiz</Text>
              <Image
                source={egzersiz == 1 ? require('../assets/yes.png') : require('../assets/no.png')}
                style={{ width: 30, height: 30, }}
              />
            </View>
          </View> 
        </View>

      </View>
      {/* Premium Mesajı için Modal */} 
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalView}>
            <Text style={styles.title}>Premium Üye Ol!</Text>
            <Text style={styles.message}>
              Tüm özelliklere erişmek için premium olabilirsin.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  premiumBanner: {
    width: "100%",
    backgroundColor: "#FFD700",
    padding: 10,
    alignItems: "center",
    position: "absolute",
    top: 0,
    zIndex: 10,
  },
  bannerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    marginTop: 50, // Premium banner için boşluk bırakıyoruz
  },
  pageText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  animationContent: {
    alignItems: "center",
    marginBottom: 14
  },
  animation: {
    width: 200,
    height: 200,
  }, 
  first: {
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    color: 'cyan', // Yazı rengini belirle
    textAlign: 'center',
  },
  area: {
    borderTopWidth: 2,
    borderBottomColor: 'red'
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 8,
  },
  GorevAlani: {
    flexDirection: "row",
    margin:5,
    marginLeft:10,
  },
  text:{
    fontSize:25,
    color:"gray",
    fontWeight: "bold",

  }
});

export default Kesfet;
