import { Alert, StyleSheet, Text, View ,TouchableOpacity} from 'react-native'
import React, { useState } from 'react'
import { RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'
import SecimEkrani from '../../component/SecimEkrani';

export default function MeslekEkrani() {

    const navigation = useNavigation()

    
    return (
        <View style={styles.container}>
            <View style={{ alignItems: "center",justifyContent:"center", backgroundColor:"#e9967a",height:75}}>
                <Text style={{ fontSize: 35  ,fontWeight:"bold"}}>Meslek Seçim Ekranı</Text>
            </View>
            <View>
                <SecimEkrani apiInfo="/meslek" apiSecim="/meslekSecim" //Seçim ekranına /meslek gönderdik api için
                /> 
            </View>   
        </View>
    )
}

const styles = StyleSheet.create({})