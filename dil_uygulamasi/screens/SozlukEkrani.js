import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function SozlukEkrani() {
  const [userId, setUserId] = useState(null);
  const [kelimeler, setKelimeler] = useState([]);
  const [gosterimDurumu, setGosterimDurumu] = useState({});
  const [gosterimDurumuKontrol, setGosterimDurumuKontrol] = useState(false)
  // Kullanıcı ID'sini AsyncStorage'dan al
  const getUserID = async () => {
    const id = await AsyncStorage.getItem("id");
    setUserId(id);
  };

  const sozlukTekrari = async () => { /* burda sözlük tekrarı yapan oyuna gidecek */
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    const response = await api.post("/kullanici/GunlukGorevSozluk", {
      KullaniciID: userId,
      Date: formattedDate,
      SozlugeGiris: true,
    })
    console.log(response.data)
  }
  const KelimeleriGosterme = () => {
    const yeniDurum = {};
    kelimeler.forEach(item => {
      yeniDurum[item.Value] = !gosterimDurumuKontrol; // Tüm kelimeleri görünür yap
    });
    setGosterimDurumu(yeniDurum);
    setGosterimDurumuKontrol(!gosterimDurumuKontrol)
  };


  const KelimeleriGetir = async (userId) => {
    if (userId) {
      try {
        const response = await api.get("/kullanici/SozluguGetir", {
          params: { KullaniciID: userId }
        });
        setKelimeler(response.data.message || []);
        // Başlangıçta tüm kelimeler kapalı
        setGosterimDurumu(response.data.message.reduce((acc, kelime) => {
          acc[kelime.Value] = false;
          return acc;
        }, {}));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const SozluktenKelimeSilme = async (item) => {
    try {
      const response = await api.delete("/kullanici/SozluktenKelimeSilme", {
        params: {
          KullaniciID: userId,
          KelimeID: item.AnaKelimelerID // item.AnaKelimelerID'nin doğru olup olmadığını kontrol edin
        }
      });
      await KelimeleriGetir(userId)
    } catch (error) {
      console.error("Silme işleminde hata:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await getUserID();
        if (userId) {
          await KelimeleriGetir(userId);
        }
      };
      fetchData();
    }, [userId])
  );

  // FlatList item'ları için render fonksiyonu
  const renderItem = ({ item }) => {
    const isVisible = gosterimDurumu[item.Value];
    return (
      <View style={styles.itemContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.itemText}>{item.Value}</Text>
          {isVisible && <Text style={styles.itemSubText}>{item.Ceviri}</Text>}
        </View>
        <TouchableOpacity onPress={() => {
          setGosterimDurumu(prev => ({
            ...prev,
            [item.Value]: !prev[item.Value]
          }));
        }}>
          <View style={{ flexDirection: "row" }}>
            <Image
              source={isVisible ? require("../assets/acikGoz.png") : require("../assets/kapaliGoz.png")}
              style={styles.icon}
            />
            <TouchableOpacity onPress={() => SozluktenKelimeSilme(item)}>
              <Image
                source={require("../assets/delete.png")}
                style={styles.icon}
              />
            </TouchableOpacity>

          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {kelimeler && kelimeler.length > 0 ? (
        <>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity onPress={() => sozlukTekrari()} style={styles.button}>
              <Text style={styles.buttonText}>Sözlük Tekrarı</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => KelimeleriGosterme()}>
              {!gosterimDurumuKontrol ?
                <Text style={styles.buttonText}>Hepsini Görünür Yap</Text>
                :
                <Text style={styles.buttonText}>Hepsini Kapat</Text>

              }
            </TouchableOpacity>
          </View>
          <FlatList
            data={kelimeler} // Veriyi FlatList'e gönderin
            renderItem={renderItem} // Her bir item için render fonksiyonu
            keyExtractor={(item, index) => index.toString()} // Benzersiz anahtar
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Sözlükte hiçbir kelime bulunmuyor. Mesleki eğitimden kelime eklemeniz gerekiyor.
          </Text>
        </View>
      )}
    </View>
  );


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    padding: 10,
    marginTop: 20
  },
  itemContainer: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flexDirection: 'column',
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  itemSubText: {
    fontSize: 14,
    color: '#666666',
  },
  icon: {
    height: 35,
    width: 35,
    marginLeft: 10
  }, button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
    width: "40%",
    justifyContent: "center"
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyText: {
    fontSize: 25,
    color: "#555",
    textAlign: "center",
    fontWeight: "bold",
  },
});
