import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import UserModel from '../model/ModelUser';
import MeslekEkrani from './SecimEkranları/MeslekEkrani';
import HomeScreen from './HomeScreen';
import DilEkrani from './SecimEkranları/DilEkrani';
import SectigiDilEkranı from './SecimEkranları/SectigiDilEkranı';
import { useNavigation } from '@react-navigation/native';
import { Drawer } from 'react-native-paper';


export default function GecisEkrani() {

  const [meslek, setMeslek] = useState(null)
  const [dil, setDil] = useState(null)
  const [sectigiDil, setSectigiDil] = useState(null)
  const navigation = useNavigation()
  const calis = async () => {
    const meslekId = await UserModel.getMeslekId()
    const dilId = await UserModel.getDilId()
    const sectigiDilId = await UserModel.getSectigiDilId()
    console.log(meslekId)
    console.log(dilId)
    console.log(sectigiDilId)
    setMeslek(meslekId)
    setDil(dilId)
    setSectigiDil(sectigiDilId)
  }
  useEffect(() => {
    calis() 
  }, [])

  return (
    meslek == null ?
        navigation.navigate("MeslekEkrani")
      :
      dil == null ?
        <DilEkrani />  
        : sectigiDil == null ?
          <SectigiDilEkranı /> 
          : navigation.navigate("Drawer")      
  )
}   