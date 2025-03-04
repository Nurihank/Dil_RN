import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image, FlatList, ScrollView, ImageBackground } from "react-native";
import LottieView from 'lottie-react-native';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import api from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserModel from "../model/ModelUser";
import { LinearGradient } from 'expo-linear-gradient';

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
  const [MeslekID, setMeslekID] = useState()
  const [temelKategoriler, setTemelKategoriler] = useState([]);
  const [egzersizler, setEgzersizler] = useState([]);
  const [eksikBilgiModal, setEksikBilgiModal] = useState(false)

  const getUserInfo = async () => {
    const user = await UserModel.currentUser;
    setHangiDilID(user[0].DilID);
    setAnaDilID(user[0].SectigiDilID);
    setMeslekID(user[0].MeslekID)
  };

  const KullaniciBilgileriniTamGirmisMi = () => {
    if (HangiDilID && AnaDilID && MeslekID) {
      console.log("tamam")
      setEksikBilgiModal(false)
    } else {
      setEksikBilgiModal(true)
    }
  };

  useEffect(() => {
    KullaniciBilgileriniTamGirmisMi();
  }, [HangiDilID, AnaDilID, MeslekID]);



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
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 70 }}>
      <LinearGradient
        colors={['#693D89', '#5A227E', '#4A1769', '#3C0663', '#2A0040']}
        locations={[0, 0.2, 0.4, 0.7, 1]}
        style={{ flex: 1 }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("premium")}>
          <View style={styles.premiumBanner}>
            <Text style={styles.bannerText}>🌟 Premium Üye Ol! Daha Fazla Özellik Keşfet 🌟</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.content}>
          <View style={styles.animationContent}>
            <Image source={require('../assets/worried.png')} style={{ width: 200, height: 200,marginVertical:15 }} />

            <Text style={styles.first}>Bugüne Hazır Mısın? </Text>
          </View>
          <View style={[styles.area]}>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.headerText}>Günlük Yapılması Gerekenler</Text>

            </View>
            <View>
              <View style={styles.GorevAlani}>
                <Text style={styles.text}>Mesleki Eğitim {meslekiEgitim}/3 </Text>
                {meslekiEgitim >= 3 ?
                  <Image source={require('../assets/yes.png')} style={{ width: 24, height: 24,tintColor:"white" }} />
                  :
                  <TouchableOpacity onPress={() => navigation.navigate("Ana Sayfa")}>
                    <Image source={require('../assets/devams.png')} style={{ width: 24, height: 24 }} />
                  </TouchableOpacity>

                }

              </View>
              <View style={styles.GorevAlani}>
                <Text style={styles.text}>Temel Eğitim {temeliEgitim}/3 </Text>
                {temeliEgitim >= 3 ?
                  <Image source={require('../assets/yes.png')} style={{ width: 24, height: 24 }} />
                  :
                  <TouchableOpacity onPress={() => navigation.navigate("Temel")}>
                    <Image source={require('../assets/devams.png')} style={{ width: 24, height: 24 }} />
                  </TouchableOpacity>

                }
              </View>
              <View style={styles.GorevAlani}>
                <Text style={styles.text}>Sözlük Tekrarı </Text>
                {sozlukTekrari === 1 ? (
                  <Image source={require('../assets/yes.png')} style={{ width: 24, height: 24 }} />
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Sozluk")}>
                      <Image source={require('../assets/devams.png')} style={{ width: 24, height: 24 }} />
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
                    <TouchableOpacity onPress={() => navigation.navigate("Egzersiz")}>
                      <Image source={require('../assets/devams.png')} style={{ width: 24, height: 24 }} />
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
                    <TouchableOpacity onPress={() => navigation.navigate("Egzersiz")}>
                      <Image source={require('../assets/devams.png')} style={{ width: 24, height: 24 }} />
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
                <TouchableOpacity onPress={() => navigation.navigate("Temel")}>
                  <View style={styles.card}>
                    <Image source={{ uri: item.Image }} style={styles.image} />
                    <Text style={styles.text}>{item.Ceviri}</Text>
                  </View>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View style={[styles.area]}>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.headerText}>Egzersiz Yapmak İster Misin ?</Text>
            </View>
            <FlatList
              data={egzersizler}
              horizontal
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate("Egzersiz")}>
                  <View style={[styles.card]}>
                    <Text style={styles.text}>{item.EgzersizAdi}</Text>
                  </View>
                </TouchableOpacity>
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

        <Modal
          visible={eksikBilgiModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Bilgilerini Tamamlamamışsın</Text>
              <Image style={{ height: 200, width: 200 }} source={require("../assets/sad.png")} />

              <TouchableOpacity
                onPress={() => navigation.navigate("SecimEkrani", { id: userID })}
                style={styles.modalButton}
              >
                <Text style={styles.buttonText}>Bilgilerini tamamlamak için dokun</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </LinearGradient>

    </ScrollView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E2DAD6",
    marginTop: 30
  },
  premiumBanner: {
    width: "100%",
    backgroundColor: "#3C1A4A",
    padding: 10,
    alignItems: "center",
    position: "absolute",
    top: 0,
    zIndex: 10,
  },
  bannerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
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
    fontSize: 25,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white', // Yazı rengini belirle
    textAlign: 'center',
  },
  area: {
    padding: 15,
    borderRadius: 15,
    borderTopWidth: 3,
    borderTopColor: '#2E3F5F', // Lavanta grisi çizgi,

  },
  headerText: {
    color: '#D8BFD8', // Açık mor, zarif bir başlık
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  GorevAlani: {
    flexDirection: "row",
    margin: 5,
    marginLeft: 10,
    justifyContent: "space-between",

  },
  card: {
    backgroundColor: '#5A3173', // Canlı Mor, Kartların Arka Planı
    width: 120, // **Sabit genişlik (Kare)**
    height: 120, // **Sabit yükseklik (Kare)**
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: 60, // **İçindeki resmin sabit boyutu**
    height: 60,
    borderRadius: 8,
    marginBottom: 5,
  },
  text: {
    color: '#E0C3FC', // Beyaz, net yazı
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  }, modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Arka planı yarı saydam yapar
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    elevation: 5, // Android gölgelendirme
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Kesfet;
