import { StyleSheet, Text, View, PanResponder, Animated } from 'react-native'
import React from 'react'

export default function OyunEkrani() {
    
  return (
    <View>
        <View style={styles.engWordContainer}>
            <View style={{flexDirection:"row"}}>
                <View style={styles.WordKarsiligiContainer}>
                    <Text></Text>
                </View>
                <View style={styles.WordContainer}>
                    <Text>Computer</Text>
                </View>
            </View>
            
            <View style={{flexDirection:"row"}}>
                <View style={styles.WordKarsiligiContainer}>
                    <Text></Text>
                </View>
                <View style={styles.WordContainer}>
                    <Text>Phone</Text>
                </View>
            </View>
            <View style={{flexDirection:"row"}}>
                <View style={styles.WordKarsiligiContainer}>
                    <Text></Text>
                </View>
                <View style={styles.WordContainer}>
                    <Text>Pencil</Text>
                </View>
            </View>
            <View style={{flexDirection:"row"}}>
                <View style={styles.WordKarsiligiContainer}>
                    <Text></Text>
                </View>
                <View style={styles.WordContainer}>
                    <Text>Keyboard</Text>
                </View>
            </View>
        </View>
        <View style={styles.hairline} />

        <View style={styles.trWordContainer}> 
            <View style={styles.trWord}>
                <Text>Telefon</Text>
            </View>
            <View style={styles.trWord}>
                <Text>Bilgisayar</Text>
            </View>
            <View style={styles.trWord}>
                <Text>Kalem</Text>
            </View>
            <View style={styles.trWord}>
                <Text>Klavye</Text>
            </View>
        </View>
        <View style={styles.hairline} />

    </View>
  )
}

const styles = StyleSheet.create({
    engWordContainer:{
        alignItems:"center",
        marginTop:"20%", //bu yüzde yirmilik yere çıkış yap car curt koyacam
        height:"40%",

    },
    WordContainer:{
        marginVertical:10,
        backgroundColor:"pink",
        width:"32%",
        justifyContent:"center",
        alignItems:"center",
        height:50,borderRadius:20
    },
    WordKarsiligiContainer:{
        marginVertical:10,
        backgroundColor:"pink",
        width:"32%",
        justifyContent:"center",
        alignItems:"center",
        height:50,
        marginRight:"20%",borderRadius:20
    },
    hairline: {
        backgroundColor: 'black',
        height: 15,
        width: "100%",
        
    },
    trWordContainer:{
        alignItems:"center",
        justifyContent:"center",
        height:"40%"
    },
    trWord:{
        marginVertical:10,
        backgroundColor:"orange",
        width:"32%",
        height:50,
        justifyContent:"center",
        alignItems:"center",borderRadius:20
    }
})