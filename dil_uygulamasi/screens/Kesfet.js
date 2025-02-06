import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet,Image } from "react-native";
import LottieView from 'lottie-react-native';

const Kesfet = () => {
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Ekran açıldığında modalı göster
    setModalVisible(true);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.premiumBanner}>
        <Text style={styles.bannerText}>🌟 Premium Üye Ol! Daha Fazla Özellik Keşfet 🌟</Text>
      </View>
      
      <View style={styles.content}>
          <View style={styles.animationContent}>
            <LottieView
                source={require('../assets/animasyon/first.json')}
                style={styles.animation}
            />
            <Text style={styles.text}>Bugüne Hazır Mısın?</Text>
            </View>
        <View style={styles.area}>
          <Text style={styles.header}>Günlük Yapılması Gerekenler</Text>
          <View>
            <Text>Mesleki Eğitim</Text>
            <Text>Temel Eğitim</Text>
            <Text>Sözlük Tekrarı</Text>
            <Text>Hatalara Bakma</Text>
            <Text>Günlük Egzersiz</Text>
          </View>
        </View>
        
      </View>
      {/* Premium Mesajı için Modal */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  animationContent:{
    alignItems:"center",
    marginBottom:14
  },
  animation: {
    width: 200,
    height: 200,
},text: {
  fontSize: 24,
  fontWeight: 'bold',
  textShadowColor: 'rgba(0, 0, 0, 0.75)',
  textShadowOffset: { width: 2, height: 2 },
  textShadowRadius: 5,
  color: 'cyan', // Yazı rengini belirle
  textAlign: 'center',
},
area:{
    borderTopWidth:2,
    borderBottomColor: 'red'
},
header:{
  fontSize:20,
  fontWeight: "bold",
marginLeft:10,
marginTop:8,
}
});

export default Kesfet;
