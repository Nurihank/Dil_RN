import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import SecimEkrani from '../component/SecimEkrani'

export default function Deneme() {
    const navigation = useNavigation()
  return (
    <View>
          <Button title='Tıkla' onPress={() => { navigation.navigate("HomeScreen")}}> </Button>
      <View>
        
      </View>
    </View>
    
  )
}

const styles = StyleSheet.create({})