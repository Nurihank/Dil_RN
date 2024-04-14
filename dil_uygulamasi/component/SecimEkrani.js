import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import SearchBar from './SearchBar'
import GetDb from '../Hooks/GetDb'
import { RadioButton } from 'react-native-paper';
import UserModel from '../model/ModelUser';
import api from '../api/api';
import { useNavigation } from '@react-navigation/native'

export default function SecimEkrani({ apiInfo, apiSecim }) { //gelen api bilgilerini aldık meslek dil yada sectigi dil için

    const navigation = useNavigation()
    const [searchApi, result] = GetDb({ apiInfo }) //gelen api bilgisine göre veriyi getirdik result = gelen sonuç , searchApi = arama yapmak için kullanacaz 
    const [selectedValue, setSelectedValue] = useState("") //Radio buttonu ile seçilen veriyi tutmak için useState ' i kullandık
    const [term, setTerm] = useState("")  //arama yapmak için bu useState kullandık

    const user = UserModel.getCurrentUser() //kullanıcının id'sini almak için

    const Gecis = async () => {
        if (apiInfo == "/meslek") { //seçim ekranı meslekse buraya 
            const response = await api.post("/kullanici" + apiSecim, {
                meslek: selectedValue,
                id: user[0].id
            })
            if (response.data.STATUS == "SUCCES") {
                setSelectedValue("")
                navigation.navigate("DilEkrani")
            }

        } else if (apiInfo == "/dil") {
            console.log("zaa")
            const response = await api.post("/kullanici" + apiSecim, {
                dil: selectedValue,
                id: user[0].id
            })
            if (response.data.STATUS == "SUCCES") {
                setSelectedValue("")
                navigation.navigate("SectigiDilEkranı")
            }
        } else if (apiInfo == "/sectigiDil") {
            console.log("asd")
            const response = await api.post("/kullanici" + apiSecim, {
                sectigiDil: selectedValue,
                id: user[0].id
            })
            if (response.data.STATUS == "SUCCES") {
                setSelectedValue("")
                navigation.navigate("Drawer")
            }
        }
        else {
            console.log("züüü")
        }

    }
    /* const ad = result
    console.log(ad) */

    return (
        apiInfo == "/meslek" ?
            <View>
                <View>
                    <SearchBar term={term} termChange={setTerm} termEnd={() => searchApi(term)} //searchBarımız yaptık arama yapmak için
                    />
                </View>

                <FlatList  //gelen resultu flatlist ile yansıtmak için yaptık
                    data={result}
                    renderItem={({ item }) => {
                        return (
                            <View>
                                <Text>{item.meslek}</Text>
                                <RadioButton
                                    value={item.idMeslek}
                                    status={selectedValue === item.idMeslek ? "checked" : "unchecked"}

                                    onPress={() => setSelectedValue(item.idMeslek)}
                                    color="#007BFF"
                                />
                            </View>
                        )

                    }}
                />
                <View>
                    <TouchableOpacity onPress={() => { (selectedValue == "") ? Alert.alert("Bir Meslek Seç") : Gecis() }} //tıkladığımız veriyi doğru mu diye kontrol ettik
                    >
                        <Text>Seçimi Onaylıyorum</Text>
                    </TouchableOpacity>
                </View>

            </View>
            : apiInfo == "/dil" ?
                <View>
                    <View>
                        <SearchBar term={term} termChange={setTerm} termEnd={() => searchApi(term)} //searchBarımız yaptık arama yapmak için
                        />
                    </View>

                    <FlatList  //gelen resultu flatlist ile yansıtmak için yaptık
                        data={result}
                        renderItem={({ item }) => {
                            return (
                                <View>
                                    <Text>{item.dil_adi}</Text>
                                    <RadioButton
                                        value={item.id}
                                        status={selectedValue === item.id ? "checked" : "unchecked"}

                                        onPress={() => setSelectedValue(item.id)}
                                        color="#007BFF"
                                    />
                                </View>
                            )

                        }}
                    />
                    <View>
                        <TouchableOpacity onPress={() => { (selectedValue == "") ? Alert.alert("Bir Dil Seç") : Gecis() }} //tıkladığımız veriyi doğru mu diye kontrol ettik
                        >
                            <Text>Seçimi Onaylıyorum</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                :
                apiInfo = "/sectigiDil" ?
                    <View>
                        <View>
                            <SearchBar term={term} termChange={setTerm} termEnd={() => searchApi(term)} //searchBarımız yaptık arama yapmak için
                            />
                        </View>

                        <FlatList  //gelen resultu flatlist ile yansıtmak için yaptık
                            data={result}
                            renderItem={({ item }) => {
                                return (
                                    <View>
                                        <Text>{item.dil_adi}</Text>
                                        <RadioButton
                                            value={item.id}
                                            status={selectedValue === item.id ? "checked" : "unchecked"}

                                            onPress={() => setSelectedValue(item.id)}
                                            color="#007BFF"
                                        />
                                    </View>
                                )

                            }}
                        />
                        <View>
                            <TouchableOpacity onPress={() => { (selectedValue == "") ? Alert.alert("Bir Meslek Seç") : Gecis() }} //tıkladığımız veriyi doğru mu diye kontrol ettik
                            >
                                <Text>Seçimi Onaylıyorum</Text>
                            </TouchableOpacity>
                        </View>

                    </View> :
                    <Text>hata var</Text>

    )
}

const styles = StyleSheet.create({

}) 