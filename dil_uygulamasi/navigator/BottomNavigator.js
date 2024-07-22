import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from "../screens/HomeScreen.js";
import ProfileScreen from '../screens/ProfileScreen.js';
import Logout from '../screens/Logout.js';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

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
                } else if (route.name === 'Profil') {
                    iconName = focused ? 'person' : 'person-outline';
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
