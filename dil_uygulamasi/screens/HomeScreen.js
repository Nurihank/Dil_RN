import { Alert, StyleSheet, Text, View } from 'react-native'
import React,{useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RadioButton } from 'react-native-paper'; 
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native'
import DenemeScreen from './DenemeScreen';

export default function  HomeScreen() {
  const navigation = useNavigation()
  const [selectedValue, setSelectedValue] = useState(''); 
  


  var styles = StyleSheet.create({ 
    container: { 
        flex: 1, 
        backgroundColor:'#F5F5F5' ,
        justifyContent: 'center', 
        alignItems: 'center', 
    }, 
    radioGroup: { 
        alignItems: 'center', 
        justifyContent: 'space-around', 
        marginTop: 20, 
        borderRadius: 8, 
        backgroundColor: 'white', 
        padding: 16, 
        elevation: 4, 
        shadowColor: '#000', 
        shadowOffset: { 
            width: 0, 
            height: 2, 
        }, 
        shadowOpacity: 0.25, 
        shadowRadius: 3.84, 
    }, 
    radioButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
    }, 
    radioLabel: { 
        marginLeft: 8, 
        fontSize: 16, 
        color: '#333', 
    }, 
  }); 
  
  return (
    <View style={styles.container}> 
    <View>
    <Text>Meslek Seçim Ekranı</Text>
    </View>
    <View style={styles.radioGroup}> 
        <View style={styles.radioButton}> 
            <RadioButton.Android 
                value="option1"
                status={selectedValue === 'option1' ?  
                        'checked' : 'unchecked'} 
                onPress={() => setSelectedValue('option1')} 
                color="#007BFF"
            /> 
            <Text style={styles.radioLabel}> 
                Bilgisayar Müh
            </Text> 
        </View> 

        <View style={styles.radioButton}> 
            <RadioButton.Android 
                value="option2"
                status={selectedValue === 'option2' ?  
                         'checked' : 'unchecked'} 
                onPress={()=>{
                
                  setSelectedValue('option2');
              } } 
                color="#007BFF"
            /> 
            <Text style={styles.radioLabel}> 
                Elektrik Mühendisi 
            </Text> 
        </View> 

        <View style={styles.radioButton}> 
            <RadioButton.Android 
                value="option3"
                status={selectedValue === 'option3' ?  
                        'checked' : 'unchecked'} 
                onPress={() => setSelectedValue('option3')} 
                color="#007BFF"
            /> 
            <Text style={styles.radioLabel}> 
                Pilot
            </Text> 
        </View> 
    </View> 
    <View>
    <TouchableOpacity onPress={()=>{(selectedValue == "") ? Alert.alert("Bir Meslek Seç") : navigation.navigate(DenemeScreen)}}>
      <Text>Seçimi Onaylıyorum</Text>
    </TouchableOpacity> 
    </View>
</View> 

  )
}
