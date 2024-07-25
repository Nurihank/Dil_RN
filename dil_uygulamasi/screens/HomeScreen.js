import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity,Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProgressBars from '../component/ProgressBars';
import { AntDesign } from '@expo/vector-icons';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [animating, setAnimating] = useState(false); // Animasyon durumu için state

  const startAnimation = () => {
    setAnimating(true); // Animasyon başlangıcı

    setTimeout(() => {
      setAnimating(false); // 2 saniye sonra animasyonu durdur
    }, 2000);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <ProgressBars/>
        <View>
          <TouchableOpacity style={styles.iconButton} onPress={startAnimation}>
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
