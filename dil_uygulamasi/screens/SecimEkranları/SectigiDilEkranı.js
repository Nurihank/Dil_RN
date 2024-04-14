import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SecimEkrani from '../../component/SecimEkrani'

export default function SectigiDilEkranı() {
  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center", justifyContent: "center", backgroundColor: "#e9967a", height: 75 }}>
        <Text style={{ fontSize: 35, fontWeight: "bold" }}>Öğrenmek İstediğin Dili Seç</Text>
      </View>
      <View>
        <SecimEkrani apiInfo="/sectigiDil" apiSecim="/sectigiDilSecim" //Seçim ekranına gönderiyo<
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})