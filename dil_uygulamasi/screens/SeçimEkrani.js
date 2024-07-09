import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import React,{useState} from 'react';
import { Ionicons } from '@expo/vector-icons'; // Örneğin, Expo'nun içe aktarımlarından biri
import MeslekSeçimModal from '../component/MeslekSeçimModal';
import { AntDesign } from '@expo/vector-icons';
export default function SeçimEkrani() {

    const [MeslekSecimModalVisible, setMeslekSecimModalVisible] = useState(false)
  
  const handleNext = () => {
    setMeslekSecimModalVisible(true)
    console.log('İleri gitme işlemi yapılacak');
  };
  const GeriTusu = ()=>{
    setMeslekSecimModalVisible(false)
  }
  console.log(MeslekSecimModalVisible)
  return (
    
      <View style={styles.container}>
        <Text style={styles.text}>
          Bu ekrandan sonra sana birkaç sorumuz olacak.
        </Text>
        <Text style={styles.text}>
          Seni daha yakından tanıyalım ve sana göre sorular soralım diye.
        </Text>
        <View style={styles.iconsContainer}>
        <AntDesign name="questioncircleo" size={40} color="black" />
        <AntDesign name="questioncircleo" size={40} color="black" style={[styles.icon, { marginLeft: 10 }]} />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Ionicons name="arrow-forward-outline" size={24} color="white" />
        </TouchableOpacity>
        <MeslekSeçimModal
            visible={MeslekSecimModalVisible}
            GeriTusu={GeriTusu}
        />
      </View>
   
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch' or 'contain'
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Yarı saydam arka plan rengi
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    color: '#333',
    marginBottom: 10,
  },
  iconsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  icon: {
    marginRight: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 25,
    marginTop: 30,
  },
});
