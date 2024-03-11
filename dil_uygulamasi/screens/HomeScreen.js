import { Alert, StyleSheet, Text, View } from 'react-native'
import React,{useState,useEffect} from 'react'
import UserModel from '../model/ModelUser';
import Meslek from '../component/Meslek';

export default function HomeScreen() {
  
  const [meslek, setMeslek] = useState(null)

   async function selam (){
    const currentUser = await UserModel.getCurrentUser()
    setMeslek(currentUser[0].MeslekID)
    console.log(meslek)
    console.log("ds")
  }
  useEffect(() => {
    selam()
  }, [])
  
   
console.log(meslek)
  return (
     meslek == null ?    
             <Meslek/>       
    :  
    <View>
       <Text>sr</Text>            
    </View>

  
  ) 
} 
     