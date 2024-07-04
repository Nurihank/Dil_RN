import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function WelcomeScreen() {

    const navigation = useNavigation();

    const AnaSayfayaGecis = () => {
        navigation.navigate("HomeScreen");
    };

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
