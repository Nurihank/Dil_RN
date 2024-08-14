import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity,Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProgressBars from '../component/ProgressBars';
import { AntDesign } from '@expo/vector-icons';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [animating, setAnimating] = useState(false); // Animasyon durumu için state
  const [Seviyeler,setSeviyeler] = useState([])
  const [selectedSeviyeID, setSelectedSeviyeID] = useState(null);

  const oyun = () => {
    navigation.navigate("Oyun")
  };

  useEffect(()=>{
    const SeviyeGetir = async()=>{
  
      const Seviye = await api.get("/kullanici/Seviye")
      const formattedData = Seviye.data.map(item => ({
        label: item.SeviyeAdi || 'Default Label', // Adjust based on your data structure
        value: item.SeviyeID || 'defaultValue'   // Adjust based on your data structure
      }));

      setSeviyeler(formattedData);
   
    } 
    SeviyeGetir()
  },[])
   
  const placeholder = {
    label: 'Seviye Seç',
    value: null,
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <ProgressBars/>
        <View>
      <Text>Select an option:</Text>
      <RNPickerSelect
            placeholder={placeholder}
            items={Seviyeler}
            onValueChange={(value) => setSelectedSeviyeID(value)}
            value={selectedSeviyeID}
          />
          {selectedSeviyeID ? <Text>{selectedSeviyeID}</Text> : null }
    </View>
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
