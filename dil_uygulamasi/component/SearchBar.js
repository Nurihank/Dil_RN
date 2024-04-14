import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';

export default function SearchBar({termChange,termEnd,term}) { //seçim ekranında aradığımızı bulmak için bir searchBar yaptık
    return (
        <View style={styles.backgroundStyle}>
            <FontAwesome5 name="search" size={30} color="black" style={styles.icon} />
            <TextInput style={styles.Input} placeholder='Ara'
                onChangeText={termChange} //içinde text değişince onChangeTexte gelir
                onEndEditing={termEnd}  //text inputun içine yazılan bitince
                value={term}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    backgroundStyle: {
        backgroundColor: "lightgray",
        flexDirection: "row",
        borderRadius: 15,
        alignItems: "center",
        margin: 10,
    },
    icon: {
        marginHorizontal: 10
    },
    Input: {
        flex: 1,
        backgroundColor: "lightgray"
    }
})