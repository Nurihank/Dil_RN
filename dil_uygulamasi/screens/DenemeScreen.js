import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import UserModel from '../model/ModelUser'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function DenemeScreen() {
  const deneme = UserModel.getCurrentUser()
  const navigation = useNavigation()
  return (
    true == true ?
    <View>
    <TouchableOpacity onPress={()=>navigation.navigate("HomeScreen")}> 
    <Text>TIKLA</Text>
    </TouchableOpacity>
    </View>
    : 
    <View>
    
    </View>
  )
}

const styles = StyleSheet.create({})