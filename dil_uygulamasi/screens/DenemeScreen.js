import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import UserModel from '../model/ModelUser'

export default function DenemeScreen() {
  const deneme = UserModel.getCurrentUser()
  return (
    <View>
      <Text>{deneme}</Text>
    </View>
  )
}

const styles = StyleSheet.create({})