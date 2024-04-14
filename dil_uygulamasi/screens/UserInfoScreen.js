import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import UserModel from '../model/ModelUser'

export default function UserInfoScreen() {

  const user = UserModel.getCurrentUser()
  var userId = user[0].id
 console.log()
  return (
    <View>
      <Text>{userId}</Text>
    </View>
  )
}

const styles = StyleSheet.create({})