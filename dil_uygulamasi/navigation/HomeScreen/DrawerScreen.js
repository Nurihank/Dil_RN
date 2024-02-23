import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer' //bunu import ettik
import UserInfoScreen from '../../screens/UserInfoScreen'
import HomeScreen from '../../screens/HomeScreen'
import Logout from '../../screens/Logout'

export default function DrawerScreen({ route }) {
    const Drawer = createDrawerNavigator() //draver'i tanımladık

    return (
        <Drawer.Navigator >
            <Drawer.Screen name="HomeScreen" component={HomeScreen} />
            <Drawer.Screen name="UserInfo" component={UserInfoScreen} />
            <Drawer.Screen name="Logout" component={Logout} />
        </Drawer.Navigator>
    )
}

const styles = StyleSheet.create({})