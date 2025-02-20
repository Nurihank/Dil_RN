import { Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React from 'react'
import { ProgressBar } from 'react-native-paper';

export default function ProgressBars(route) {  /* kullanıcnın mesleki eğitim için bir component */

  return (
    <View style={styles.container}>
      <View style={styles.ImageContainer}>
        <View style={{ margin: 10, marginTop: 15 }}>
          <ProgressBar progress={0.35} width={230} height={50} />
        </View>
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