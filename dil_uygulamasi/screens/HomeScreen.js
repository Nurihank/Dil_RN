import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import UserModel from '../model/ModelUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import api from '../api/api';
import { FontAwesome5, AntDesign, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.contentText}>Dil Uygulamasi</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
  },
  contentText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  }
});
