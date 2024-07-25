import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from "../screens/HomeScreen.js";
import ProfileScreen from '../screens/ProfileScreen.js';
import Logout from '../screens/Logout.js';
import { StyleSheet, View, Image } from 'react-native';
import React from 'react';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import SozlukEkrani from '../screens/SozlukEkrani.js';

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
                    iconName = focused ? 'home' : 'home-outline';
                    return (
                        <View style={{ alignItems: 'center' }}>
                            {focused ? (
                                <Image source={require("../assets/house.png")} style={{ width: 30, height: 30 }} />
                            ) : (
                                <Ionicons name="home-outline" size={size} color={color} />
                            )}
                        </View>
                    );
                } else if (route.name === 'Profil') {
                    iconName = focused ? 'person' : 'person-outline';
                } else if (route.name === 'Cikis') {
                    iconName = focused ? 'exit' : 'exit-outline';
                } else if (route.name === "Sozluk") {
                    return (
                        <View style={{ alignItems: 'center' }}>
                            {focused ? (
                                <Image source={require("../assets/dictionary.png")} style={{ width: 35, height: 35 }} />
                            ) : (
                                <Image source={require("../assets/book.png")} style={{ width: 35, height: 35 }} />
                            )}
                        </View>
                    );
                }
                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
            tabBarLabelStyle: { ...styles.tabBarLabel },
        })}>
            <Tab.Screen name="Ana Sayfa" component={HomeScreen} />
            <Tab.Screen name="Profil" component={ProfileScreen} />
            <Tab.Screen name="Cikis" component={Logout} />
            <Tab.Screen name="Sozluk" component={SozlukEkrani} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        height: 60,
        borderTopWidth: 0,
        elevation: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 20,
        marginHorizontal: 10,
        marginBottom: 7,
    },
    tabBarLabel: {
        fontSize: 12,
        marginBottom: 5,
    },
});
