import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from "react-native";

export default function PremiumScreen() {
  const features = [
    "Reklam Yok",
    "Sözlüğe Sınırsız Kelime Ekle",
    "Daha Hızlı Öğrenme",
  ];

  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  return (
    <View style={styles.container}>
    <Image style={styles.icon} source={require("../assets/crown.png")} />
    <Image style={styles.icon} source={require("../assets/people.png")} />

      <Text style={styles.title}>Premium ile daha hızlı öğren</Text>
      <Text style={styles.subtitle}>Mesleki Dil Öğrenmen Hızlansın</Text>
      
      {/* Premium Özellikler Listesi */}
      <FlatList
        data={features}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.featureItem}>✓ {item}</Text>
        )}
        style={styles.featuresList}
      />

      {/* Abonelik Seçenekleri */}
      <View style={styles.subscriptionContainer}>
        <TouchableOpacity
          style={[
            styles.subscriptionOption,
            selectedOption === "Monthly" && styles.selectedOption,
          ]}
          onPress={() => handleSelectOption("Monthly")}
        >
          <Text style={styles.subscriptionPrice}>₺19,99</Text>
          <Text style={styles.subscriptionType}>Aylık</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.subscriptionOption,
            selectedOption === "Yearly" && styles.selectedOption,
          ]}
          onPress={() => handleSelectOption("Yearly")}
        >
          <Text style={styles.subscriptionPrice}>₺119,99</Text>
          <Text style={styles.subscriptionType}>Yıllık</Text>
          <Text style={styles.popularLabel}>Popüler</Text>
        </TouchableOpacity>
      </View>

      {/* Satın Alma Butonu */}
      <TouchableOpacity style={styles.continueButton}>
        <Text style={styles.continueButtonText}>Satın Al</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1a1a1a",
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  featuresList: {
    marginBottom: 20,
  },
  featureItem: {
    fontSize: 16,
    marginVertical: 8,
    color: "#4caf50",
  },
  subscriptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  subscriptionOption: {
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    width: "45%",
    elevation: 3,
  },
  subscriptionPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  subscriptionType: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  popularLabel: {
    fontSize: 12,
    color: "#ffffff",
    backgroundColor: "#ff9800",
    borderRadius: 5,
    paddingHorizontal: 5,
    marginTop: 8,
  },
  continueButton: {
    backgroundColor: "#0288d1",
    padding: 15,
    borderRadius: 30,
    width: "90%",
    alignItems: "center",
    marginBottom: 120, // Bottom boşluk için platforma duyarlı ayar
  },
  continueButtonText: {
    color: "#ffffff",
    fontSize: 18,
  },
  selectedOption: {
    backgroundColor: "#0288d1",
    color: "#ffffff",
  },
  icon:{
    height:75,
    width:75,
    marginBottom:0
  }
});
