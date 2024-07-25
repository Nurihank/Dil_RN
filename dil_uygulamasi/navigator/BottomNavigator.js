import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Ionicons kütüphanesini import edin
import HomeScreen from "../screens/HomeScreen.js";
import ProfileScreen from '../screens/ProfileScreen.js';
import Logout from '../screens/Logout.js';
import React from 'react';
import { BlurView } from 'expo-blur';
import { StyleSheet, View, Image } from 'react-native';
import SozlukEkrani from '../screens/SozlukEkrani.js';
import MagazaScreen from '../screens/MagazaScreen.js';

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
                                <Image source={require("../assets/house.png")} style={{ width: 30, height: 30 }} />
                            ) : (
                                <Image source={require("../assets/home.png")} style={{ width: 30, height: 30 }} />
                            )}
                        </View>
                    );
                } else if (route.name === 'Profil') {
                    return (
                        <View style={{ alignItems: 'center' }}>
                            {focused ? (
                                <Image source={require("../assets/user.png")} style={{ width: 35, height: 35 }} />
                            ) : (
                                <Image source={require("../assets/users.png")} style={{ width: 35, height: 35 }} />
                            )}
                        </View>
                    );
                } else if (route.name === "Sozluk") {
                    return (
                        <View style={{ alignItems: 'center' }}>
                            {focused ? (
                                <Image source={require("../assets/dictionary.png")} style={{ width: 35, height: 35 }} />
                            ) : (
                                <Image source={require("../assets/book.png")} style={{ width: 30, height: 30 }} />
                            )}
                        </View>
                    );
                } else if (route.name === 'Magaza') {
                    return (
                        <View style={{ alignItems: 'center' }}>
                            {focused ? (
                                <Image source={require("../assets/carts.png")} style={{ width: 35, height: 35 }} />
                            ) : (
                                <Image source={require("../assets/shopping-cart.png")} style={{ width: 30, height: 30 }} />
                            )}
                        </View>
                    );
                } else if (route.name === 'Cikis') {
                    iconName = focused ? 'exit' : 'exit-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
            tabBarLabelStyle: { ...styles.tabBarLabel },
        })}>
            <Tab.Screen name="Ana Sayfa" component={HomeScreen} />
            <Tab.Screen name="Profil" component={ProfileScreen} />
            <Tab.Screen name="Sozluk" component={SozlukEkrani} />
            <Tab.Screen name="Magaza" component={MagazaScreen} />
            <Tab.Screen name="Cikis" component={Logout} />
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
