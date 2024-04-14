import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import UserModel from '../model/ModelUser'
import AsyncStorage from '@react-native-async-storage/async-storage'



export default function HomeScreen() {
  const [user, setuser] = useState("")

  

  const deneme = async () => {
    const userDeneme = await UserModel.getCurrentUser()
    setuser(userDeneme[0].id)
  }
  useEffect(() => {
    deneme()
  }, [])

  console.log(user)

  if (user == null) {
    return null
  }
  return (
    <View>
      <Text>{user}</Text>
    </View>
  )
}
