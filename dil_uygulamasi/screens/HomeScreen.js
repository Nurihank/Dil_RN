import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity,Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProgressBars from '../component/ProgressBars';
import { AntDesign } from '@expo/vector-icons';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [animating, setAnimating] = useState(false); // Animasyon durumu için state

  const oyun = () => {
    navigation.navigate("Oyun")
  };

  /* useEffect(()=>{
    const SendToDay = async () => {
      try {
          const today = new Date();
          
        const id = await AsyncStorage.getItem("id")
         

          const response = await api.post("/kullanici/Takvim", {
            kullaniciID: id,
              tarih: today
          });

          console.log("API Response:", response.data); 
      } catch (error) {
          console.error("Error sending date to API:", error);
      }
  };

  SendToDay();
  },[]) */

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <ProgressBars/>
        <View>
          <TouchableOpacity style={styles.iconButton} onPress={oyun}>
            <AntDesign name="playcircleo" size={120} color="#6495ed" style={{marginLeft:25}}/>
            <Text style={styles.startGameLabel}>Oyuna Basla</Text>
          </TouchableOpacity>
        </View>
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
  iconButton: {
    marginTop: 50,
    
  },
  startGameLabel:{
    margin:15,
    color:"#ff8c00",
    fontSize:25,
    fontWeight:"bold"
  }
});
