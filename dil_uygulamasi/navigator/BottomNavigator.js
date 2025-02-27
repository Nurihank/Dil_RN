import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Ionicons kütüphanesini import edin
import HomeScreen from "../screens/HomeScreen.js";
import ProfileScreen from '../screens/ProfileScreen.js';
import React from 'react';
import { BlurView } from 'expo-blur';
import { StyleSheet, View, Image } from 'react-native';
import SozlukEkrani from '../screens/SozlukEkrani.js';
import TemelEgitimScreen from '../screens/TemelEgitim/TemelEgitimScreen.js';
import EgzersizScreen from '../screens/Egzersiz/EgzersizScreen.js';
import Kesfet from '../screens/Kesfet.js';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';

const Tab = createBottomTabNavigator();

export default function BottomNavigator() {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarStyle: { ...styles.tabBar },
            tabBarBackground: () => (
                <BlurView tint="light" intensity={150} style={StyleSheet.absoluteFill} />
            ),
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Ana Sayfa') {
                    return (
                        <View style={{ alignItems: 'center' }}>
                            {focused ? (
                                <AntDesign name="home" size={35} color="gray" />
                            ) : (
                                    <AntDesign name="home" size={35} color="white" />
                            )}
                        </View>
                    );
                } else if (route.name === 'Profil') {
                    return (
                        <View style={{ alignItems: 'center' }}>
                            {focused ? (
                                <AntDesign name="user" size={35} color="gray" />
                            ) : (
                                <AntDesign name="user" size={35} color="white" />)}
                        </View>
                    );
                } else if (route.name === "Sozluk") {
                    return (
                        <View style={{ alignItems: 'center' }}>
                            {focused ? (
                                <AntDesign name="book" size={35} color="gray" />) : (
                                    <AntDesign name="book" size={35} color="white" />)}
                        </View>
                    );
                } else if (route.name === 'Egzersiz') {
                    return (
                        <View style={{ alignItems: 'center' }}>
                            {focused ? (
                                <MaterialCommunityIcons name="dumbbell" size={35} color="gray" />) : (
                                    <MaterialCommunityIcons name="dumbbell" size={35} color="white" />)}
                        </View>
                    );
                } else if (route.name === 'Temel') {
                    return (
                        <View style={{ alignItems: 'center' }}>
                            {focused ? (
                                <Ionicons name="newspaper-outline" size={35} color="gray" />
                            ) : (
                                    <Ionicons name="newspaper-outline" size={35} color="white" />)}
                        </View>
                    );
                }
                else if (route.name === 'Kesfet') {
                    return (
                        <View style={{ alignItems: 'center' }}>
                            {focused ? (
                                <Feather name="compass" size={35} color="white" />
                            ) : (
                                    <Feather name="compass" size={35} color="white" />)}
                        </View>
                    );
                }
                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
            tabBarLabelStyle: { ...styles.tabBarLabel },
        })}>

            <Tab.Screen name="Kesfet" component={Kesfet} options={{
                headerShown: false, // Üst başlığı gizler
            }} />
            <Tab.Screen name="Ana Sayfa" component={HomeScreen} options={{
                headerShown: false, // Üst başlığı gizler
            }} />
            <Tab.Screen name="Profil" component={ProfileScreen} options={{
                headerShown: false, // Üst başlığı gizler
            }} />
            <Tab.Screen name="Sozluk" component={SozlukEkrani} options={{
                headerShown: false, // Üst başlığı gizler
            }} />
            <Tab.Screen name="Egzersiz" component={EgzersizScreen} options={{
                headerShown: false, // Üst başlığı gizler
            }} />
            <Tab.Screen name="Temel" component={TemelEgitimScreen} options={{
                headerShown: false, // Üst başlığı gizler
            }} />

        </Tab.Navigator>

    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        height: 65, 
        borderTopWidth: 0,
        elevation: 0,
        backgroundColor: '#3c0663', 
        borderRadius: 20,
        marginHorizontal: 10,
        marginBottom: 7,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15, 
        shadowRadius: 3,
    },
    tabBarLabel: {
        fontSize: 12,
        marginBottom: 5,
        color: 'white', 
    },
    tabIcon: {
        color: '#FFFFFF', 
    }
});


