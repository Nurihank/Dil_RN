import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProgressBars from '../component/ProgressBars';
import { AntDesign } from '@expo/vector-icons';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import UserModel from '../model/ModelUser';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [Seviyeler, setSeviyeler] = useState([])
  const [selectedSeviyeID, setSelectedSeviyeID] = useState(1);
  const [sezon, setSezon] = useState(1);
  const [userId, setUserId] = useState(null); // Başlangıçta null olarak ayarlandı
  const [meslekID, setMeslekID] = useState()
  const [AnaDilID, setAnaDilID] = useState()//bu hep ingilizce id'si
  const [HangiDilID, setHangiDilID] = useState()


  const oyun = () => {
    navigation.navigate("Oyun")
  };

  const setUserID = async () => {
    const id = await AsyncStorage.getItem("id");
    setUserId(id);
  }

  const getUserInfo = async ()=>{
    const user = await UserModel.currentUser
    setMeslekID(user[0].MeslekID)
    setHangiDilID(user[0].DilID)
    setAnaDilID(user[0].SectigiDilID) //bu hep ingilizce 
  } 

  useEffect(() => { 
    setUserID()
    getUserInfo()
    const SeviyeGetir = async () => {

      const Seviye = await api.get("/kullanici/Seviye")
      const formattedData = Seviye.data.map(item => ({
        label: item.SeviyeAdi || 'Default Label', // Adjust based on your data structure
        value: item.SeviyeID || 'defaultValue'   // Adjust based on your data structure
      }));
      setSeviyeler(formattedData);
    }
    SeviyeGetir()
  }, [])

  const placeholder = {
    label: 'Seviye Seç',
    value: null, 
  };

  const SezonlariGetir = () => {
    const SezonGetir = async () => {
      const response = await api.get("/kullanici/Sezon", {
        params: {
          SeviyeID: selectedSeviyeID,
          HangiDilID: HangiDilID
        }
      }
      
      )
      console.log(response.data)
      setSezon(response.data)
    }
    SezonGetir()
    
  }
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <ProgressBars />
        <View>
          <Text>Select an option:</Text>
          <RNPickerSelect
            placeholder={placeholder}
            items={Seviyeler}
            onValueChange={(value) => setSelectedSeviyeID(value)}
            value={selectedSeviyeID}
          />
          {selectedSeviyeID ? SezonlariGetir() : null}

        </View>
        <FlatList
          data={sezon}
        />
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
  startGameLabel: {
    margin: 15,
    color: "#ff8c00",
    fontSize: 25,
    fontWeight: "bold"
  }
});
