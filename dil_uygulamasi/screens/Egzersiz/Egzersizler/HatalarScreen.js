import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import api from '../../../api/api'

export default function HatalarScreen(route) {

    const kelimeleriGetir = async()=>{
        const response = await api.get("/kullanici")
    }
  return (
    <View>
      <Text>{route.route.params.egzersizTuru}</Text>
    </View>
  )
}

const styles = StyleSheet.create({})