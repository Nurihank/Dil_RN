import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SecimEkrani from '../../component/SecimEkrani'

export default function DilSeviyesiEkrani() {
    return (
        <View style={styles.container}>
            <View style={{ alignItems: "center", justifyContent: "center", backgroundColor: "#e9967a", height: 75 }}>
                <Text style={{ fontSize: 35, fontWeight: "bold" }}>Dil Seviyeni Belirle</Text>
            </View>
            <View>
                <SecimEkrani apiSecim="/dilSeviyesi"
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})