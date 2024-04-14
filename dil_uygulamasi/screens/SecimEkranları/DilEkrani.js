import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SecimEkrani from '../../component/SecimEkrani'

export default function DilEkrani() {
  return (
    <View style={styles.container}>
      <View>
        <Text>Dil Seçim Ekranı</Text>
      </View>
      <View>
        <SecimEkrani apiInfo="/dil" apiSecim="/dilSecim" //Seçim ekranına /meslek gönderdik api için
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})