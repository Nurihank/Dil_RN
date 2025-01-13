import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';

export default function Ayarlar() {
  const handleButtonPress = (action) => {
    Alert.alert(`${action} seçildi.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ayarlar</Text>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => handleButtonPress('Genel Veri')}
      >
        <Text style={styles.buttonText}>Genel Veri</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => handleButtonPress('Profil Bilgileri Değiştir')}
      >
        <Text style={styles.buttonText}>Profil Bilgileri Değiştir</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => handleButtonPress('Çıkış Yap')}
      >
        <Text style={styles.buttonText}>Çıkış Yap</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.buttonDelete} 
        onPress={() => handleButtonPress('Hesabımı Sil')}
      >
        <Text style={styles.buttonText}>Hesabımı Sil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonDelete: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
