import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect,useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WelcomeScreen() {
    const [userId, setUserId] = useState(null);

    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            const fetchId = async()=>{
                await setUserID();
            }
            fetchId()
        }, [])
      );

    const setUserID = async () => {
        const id = await AsyncStorage.getItem("id");
        setUserId(id);
      };
    const AnaSayfayaGecis = () => {
        navigation.navigate("Bottom");
    };
    const GunlukGiris = async () => {
        const currentDate = new Date();
    
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
    
        const formattedDate = `${year}-${month}-${day}`;
        const response = await api.post("/kullanici/GunlukGiris", {
          KullaniciID: userId,
          Date: formattedDate
        })
      }
      
  useEffect(() => {
    if (userId) {
      GunlukGiris()
    }
  }, [userId])

    return (
        <View style={styles.container}>
            <Image
                source={require("../assets/dill.jpg")}
                style={styles.image}
            />
            <Text style={styles.title}>Uygulamamıza Hoşgeldiniz!</Text>
            <Text style={styles.subtitle}>Dil becerilerinizi geliştirmenize yardımcı olacağız.</Text>
            <Text style={styles.subtitle}>Bu yolculukta sizinle birlikteyiz.</Text>
            <TouchableOpacity style={styles.button} onPress={AnaSayfayaGecis}>
                <Icon name="arrow-right" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Hadi Eğitime Başla</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0f7fa',
        padding: 20,
    },
    image: {
        width: 250,
        height: 150,
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#00796b',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#004d40',
        textAlign: 'center',
        marginBottom: 5,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00796b',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 20,
    },
    buttonIcon: {
        marginRight: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
