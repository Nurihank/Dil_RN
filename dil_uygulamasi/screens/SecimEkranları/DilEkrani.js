import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SecimEkrani from '../../component/SecimEkrani'

export default function DilEkrani() {
  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center", justifyContent: "center", backgroundColor: "#e9967a", height: 75 }}>
        <Text style={{ fontSize: 35, fontWeight: "bold" }}>Dil Seçim Ekranı</Text>
      </View>
      <View>
        <SecimEkrani apiInfo="/dil" apiSecim="/dilSecim" //Seçim ekranına /meslek gönderdik api için
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})