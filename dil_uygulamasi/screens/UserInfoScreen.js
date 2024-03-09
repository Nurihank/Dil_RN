import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';

export default function UserInfoScreen() {

  const [kullaniciAdi, setKullaniciAdi] = useState("")
  const [email, setEmail] = useState("")
  const getData = async () => {

    try {
      const value = await AsyncStorage.getItem('user');
      console.log(value)
      if (value) {
       // console.log("asd")
        const response = await api.get("/user/" + value, {
          params: {
            id: value
          }
        })
        setEmail(response.data.message[0].email)
        setKullaniciAdi(response.data.message[0].kullaniciAdi)
       
      }
    } catch (e) {
      console.log(e)
    }
  };  
  useEffect(() => {
    getData()
  }, []) 
  
  return (
    <View>
      <Text>{kullaniciAdi}</Text> 
      <Text>{email}</Text>
    </View> 
  )
}

const styles = StyleSheet.create({})