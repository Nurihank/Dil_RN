import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image, FlatList, ScrollView } from "react-native";
import LottieView from 'lottie-react-native';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import api from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserModel from "../model/ModelUser";
import { asCalendarConsumer } from "react-native-calendars";

const Kesfet = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [userID, setUserId] = useState()
  const [meslekiEgitim, setMeslekiEgitim] = useState(0)
  const [temeliEgitim, setTemelEgitim] = useState(0)
  const [sozlukTekrari, setSozlukTekrari] = useState()
  const [hatalaraBakma, setHatalaraBakma] = useState()
  const [egzersiz, setEgzersiz] = useState()
  const [HangiDilID, setHangiDilID] = useState();
  const [AnaDilID, setAnaDilID] = useState();
  const [temelKategoriler, setTemelKategoriler] = useState([]);
  const [egzersizler, setEgzersizler] = useState([]); // Verileri depolamak için state

  const getUserInfo = async () => {
    const user = await UserModel.currentUser;
    setHangiDilID(user[0].DilID);
    setAnaDilID(user[0].SectigiDilID);
  };

  const gunlukGorevTamamlandi = async () => {

    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    const response = await api.post("/kullanici/GunlukGorevTamamlandi", {
      KullaniciID: userID,
      Date: formattedDate
    })
    console.log("Gunluk Gorev = " + response.data.message)
  }
  const egzersizleriGetir = async () => {
    try {
      const response = await api.get("/kullanici/egzersiz");
      setEgzersizler(response.data.message); // Gelen veriyi state'e kaydediyoruz
    } catch (error) {
      console.error("Egzersiz verisi alınırken hata oluştu", error);
    }
  };

  const temelKategorileriGetir = async () => {
    try {
      const response = await api.get("/kullanici/temelKategoriler", {
        params: {
          AnaDilID: AnaDilID,
          HangiDilID: HangiDilID,
        },
      });
      setTemelKategoriler(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setModalVisible(false);
  }, []);

  useEffect(() => {
    if (HangiDilID && AnaDilID) {
      temelKategorileriGetir();
      egzersizleriGetir()
    }
  }, [AnaDilID, HangiDilID]);

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
      getUserInfo()
    }, [userID])
  );

  useFocusEffect(
    useCallback(() => {
      meslekiEgitimSayisi()
      temeliEgitimSayisi()
      sozlukTekrariKontrol()
      hataTekrariKontrol()
      egzersizKontrol()
      if (
        egzersiz === 1 &&
        hatalaraBakma === 1 &&
        sozlukTekrari === 1 &&
        meslekiEgitim === 3 &&
        temeliEgitim === 3
      ) {
        gunlukGorevTamamlandi()
      } else {
      }
    }, [userID, meslekiEgitim, temeliEgitim, sozlukTekrari, hatalaraBakma, egzersiz])
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

      const sozlukGiris = response.data?.message || 0;

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


      const hataEgzersiz = response.data?.message || 0;
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

      const egzersiz = response.data?.message || 0;

      setEgzersiz(egzersiz);
    } catch (error) {
      console.error("Hata:", error);
    }
  };


  return (
    <ScrollView style={styles.container}>
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
          <Text style={styles.first}>Bugüne Hazır Mısın? </Text>
        </View>
        <View style={styles.area}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.headerText}>Günlük Yapılması Gerekenler</Text>

          </View>
          <View>
            <View style={styles.GorevAlani}>
              <Text style={styles.text}>Mesleki Eğitim {meslekiEgitim}/3 </Text>
              {meslekiEgitim == 3 ?
                <Image source={require('../assets/yes.png')} style={{ width: 24, height: 24 }} />
                :
                <TouchableOpacity onPress={() => navigation.navigate("Ana Sayfa")}>
                  <Image source={require('../assets/go.png')} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>

              }

            </View>
            <View style={styles.GorevAlani}>
              <Text style={styles.text}>Temel Eğitim {temeliEgitim}/3 </Text>
              {temeliEgitim == 3 ?
                <Image source={require('../assets/yes.png')} style={{ width: 24, height: 24 }} />
                :
                <TouchableOpacity onPress={() => navigation.navigate("Temel")}>
                  <Image source={require('../assets/go.png')} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>

              }
            </View>
            <View style={styles.GorevAlani}>
              <Text style={styles.text}>Sözlük Tekrarı </Text>
              {sozlukTekrari === 1 ? (
                <Image source={require('../assets/yes.png')} style={{ width: 24, height: 24 }} />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={require('../assets/no.png')} style={{ width: 24, height: 24, marginRight: 8 }} />
                    <TouchableOpacity onPress={() => navigation.navigate("Sozluk")}>
                    <Image source={require('../assets/go.png')} style={{ width: 24, height: 24 }} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.GorevAlani}>
              <Text style={styles.text}>Hatalara Bakma</Text>
              {hatalaraBakma === 1 ? (
                <Image source={require('../assets/yes.png')} style={{ width: 24, height: 24 }} />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={require('../assets/no.png')} style={{ width: 24, height: 24, marginRight: 8 }} />
                    <TouchableOpacity onPress={() => navigation.navigate("Egzersiz")}>
                    <Image source={require('../assets/go.png')} style={{ width: 24, height: 24 }} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.GorevAlani}>
              <Text style={styles.text}>Günlük Egzersiz </Text>
              {egzersiz === 1 ? (
                <Image source={require('../assets/yes.png')} style={{ width: 24, height: 24 }} />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={require('../assets/no.png')} style={{ width: 24, height: 24, marginRight: 8 }} />
                    <TouchableOpacity onPress={() => navigation.navigate("Egzersiz")}>
                    <Image source={require('../assets/go.png')} style={{ width: 24, height: 24 }} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={styles.area}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.headerText}>Temel Kelimelerde Eksiğin Mi Var ?</Text>
          </View>
          <FlatList
            data={temelKategoriler}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image source={{ uri: item.Image }} style={styles.image} />
                <Text style={styles.text}>{item.Ceviri}</Text>
              </View>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View style={styles.area}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.headerText}>Egzersiz Yapmak İster Misin ?</Text>
          </View>
          <FlatList
            data={egzersizler}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.text}>{item.EgzersizAdi}</Text>
              </View>
            )}
          />
        </View>

      </View>




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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 80
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
    margin: 5,
    marginLeft: 10,
  },
  text: {
    fontSize: 20,
    color: "gray",
    fontWeight: "bold",

  }, card: {
    width: 120,
    height: 120,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  }, image: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
});

export default Kesfet;
