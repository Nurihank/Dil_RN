import { Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React from 'react'
import { ProgressBar } from 'react-native-paper';

export default function ProgressBars() {
  return (
    <View style={styles.container}>
      <View style={styles.ImageContainer}>
        <Image source={require("../assets/turkey.png")} style={styles.image} />
        <View style={{ margin: 10, marginTop: 15 }}>
          <ProgressBar progress={0.35} width={230} height={30} />
        </View>
        <Image source={require("../assets/eng.png")} style={styles.image} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  ImageContainer: {
    flexDirection: "row",
    marginTop: 10
  },
  image: {
    height: 65,
    width: 65
  },
})