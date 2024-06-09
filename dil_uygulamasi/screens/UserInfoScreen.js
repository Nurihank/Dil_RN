import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import UserModel from '../model/ModelUser'

export default function UserInfoScreen() {

  const user = UserModel.getCurrentUser()
  console.log(user)
  var userId = user[0].id
 console.log()
  return (
    <View>
      <Text>{userId}</Text>
      <Text>{user[0].email}</Text>
      <Text>{user[0].kullaniciAdi}</Text>
    </View>
  )
}

const styles = StyleSheet.create({})