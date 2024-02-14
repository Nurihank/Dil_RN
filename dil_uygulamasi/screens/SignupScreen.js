import { Button, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React , {useState}from 'react'
import { useNavigation } from '@react-navigation/native'
import useControls from '../hooks/useControls'

export default function SigninScreen() {

    const [kullaniciAdi, setKullaniciAdi] = useState("")
    const [sifre, setSifre] = useState("")
    console.log(kullaniciAdi)
    console.log(sifre)
    const navigation = useNavigation()
    

  return (
    <KeyboardAvoidingView style={styles.container}>
        <View style={styles.textContainer}>
            <Text style={styles.text}>Dil Uygulamasına Hoşgeldiniz</Text>
        </View>
        <View style={styles.inputContainer}>
            <TextInput style={styles.input}
             placeholder='Kullanici Adi Girin'
             value={kullaniciAdi}
             onChangeText={(text) => setKullaniciAdi(text)}

             />
             <TextInput style={styles.input}
             placeholder='E-posta Girin'
             value={kullaniciAdi}
             onChangeText={(text) => setKullaniciAdi(text)}

             />
            <TextInput style={styles.input} 
            placeholder='Şifre Girin'
            value={sifre}
             onChangeText={(text) => setSifre(text)}
            />
        </View>
        <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={()=>navigation.navigate("Signup")} style={styles.button}>
                <Text style={{color:"#191970" ,fontSize:20,fontWeight:"bold"}}>KAYIT OL</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate("Signin")} style={styles.button}>
                <Text style={{color:"#191970" ,fontSize:20,fontWeight:"bold"}}>GİRİŞ EKRANINA</Text>
                <Text style={{color:"#191970" ,fontSize:20,fontWeight:"bold"}}>GERİ DÖN</Text>
            </TouchableOpacity>
            
        </View>
    </KeyboardAvoidingView>
    
  )
}

const styles = StyleSheet.create({
    container:{
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:"#e0ffff",
        height:"100%",
    },
    textContainer:{
        backgroundColor:"#87cefa",
        margin:10,
        padding:10,
        borderRadius:20,
      //  marginBottom:100
    },
    text:{
        fontSize:20,
        fontWeight:"bold"
    },
    inputContainer:{
        width:"75%",

    },
    input:{
       marginVertical:10,
       backgroundColor:"white",
       padding:10,
       borderRadius:20
    },
    forgotContainer:{
        marginTop:12,
        marginLeft:180
    },
    buttonContainer:{
        width:"50%",
        marginTop:10,
        alignItems:"center"
    },
    button:{
        borderRadius:25,
        alignItems:"center",
        backgroundColor:"#faf0e6",
        marginVertical:10,
        padding:15,
        
    }
})