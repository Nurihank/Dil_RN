import { FlatList, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import api from '../../../api/api';
import * as Speech from 'expo-speech';
import { useNavigation } from '@react-navigation/native';

export default function HatalarScreen(route) {
  const [kelimeler, setKelimeler] = useState();

  const navigation = useNavigation()

  const GozdenGecir = (kelime)=>{
    /* burda gözden geçir diyince kelime silinecek */
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
    if (route.route.params.egzersizTuru == 0){
      Speech.speak(kelime.Value, options)

    }else{
      Speech.speak(kelime.value, options)

    }
  }

  useState(() => {
    kelimeleriGetir();
  }, []);

  const renderKelime = ({ item }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.kelimeText}>{item.Ceviri}</Text>
        <View style={{ flexDirection:"row" }}>
          {route.route.params.egzersizTuru == 1 ? <Text style={{ color: "gray", fontSize: 18, marginLeft: 10 }}>{item.value}</Text> : <Text style={{ color: "gray", fontSize: 18, marginLeft: 10 }}>{item.Value}</Text>}
          
          <TouchableOpacity onPress={()=>speakWord(item)}>
            <Image source={require("../../../assets/microphone.png")} style={{ height: 30, width: 30, marginLeft: 10, marginTop: 3 }} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={()=>GozdenGecir(item)}>
        <Text style={styles.buttonText}>Gözden Geçir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Bottom")}>
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
  }
});

