import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SecimEkrani from '../../component/SecimEkrani'

export default function SectigiDilEkranı() {
  return (
    <View style={styles.container}>
      <View>
        <Text>Öğrenmek İstediğin Dili Seçim Ekranı</Text>
      </View>
      <View>
        <SecimEkrani apiInfo="/sectigiDil" apiSecim="/sectigiDilSecim" //Seçim ekranına gönderiyo<
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})