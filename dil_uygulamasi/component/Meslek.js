import { Alert,StyleSheet, Text, View } from 'react-native'
import React,{useState} from 'react'
import { RadioButton } from 'react-native-paper'; 
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native'
import DenemeScreen from '../screens/DenemeScreen';
import UserModel from '../model/ModelUser';

export default function Meslek() {

    const navigation = useNavigation()

    const [selectedValue, setSelectedValue] = useState(''); 
    

    
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

const styles = StyleSheet.create({})