import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { OnboardFlow } from 'react-native-onboard';
import { useNavigation } from '@react-navigation/native';

export default function OnBoardingScreen() {
    const navigation = useNavigation()

    const Cikis = ()=>{
        navigation.navigate("Signin")
    }
    return (
        <OnboardFlow
            pages={[
                {
                    title: 'Dil Uygulamasına Hoşgeldiniz',
                    subtitle: 'Mesleğinize Göre Dilinizi Geliştirmek İstemez Misiniz ?',
                    imageUri: 'https://frigade.com/img/example1.png',
                },
                {
                    title: 'Page 2 header',
                    subtitle: 'This is page 2',
                    imageUri: 'https://frigade.com/img/example2.png',
                }
            ]}
            type={'fullscreen'}
            onDone={Cikis}
        />
    );
}

const styles = StyleSheet.create({})