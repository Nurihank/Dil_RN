import React, { useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import * as Speech from 'expo-speech';

export default function DinlemeEgzersizScreen() {
    const animationRef = useRef(null);

    const KelimeyiSeslendirme = () => {
        speakWord("Deneme");

        // Lottie animasyonunu başlat
        if (animationRef.current) {
            animationRef.current.play();
        }
    };

    const speakWord = (kelime) => {
        const options = {
            rate: 0.5, // Konuşma hızı
            pitch: 1.1, // Ton yüksekliği
            language: 'en', // Dil
            onStart: () => console.log("Seslendirme başladı"),
            onDone: () => console.log("Seslendirme tamamlandı"),
        };
        Speech.speak(kelime, options);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={KelimeyiSeslendirme}>
                <LottieView
                    ref={animationRef}
                    source={require('../../../assets/animasyon/sound.json')} // Animasyon dosya yolu
                    loop={false} // Tekrar etmesin
                    style={styles.animation}
                />
            </TouchableOpacity>
            <Text style={styles.text}>Dinleme Egzersizi</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    animation: {
        width: 200,
        height: 200,
    },
    text: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
