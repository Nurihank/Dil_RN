import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import SearchBar from './SearchBar'
import GetDb from '../Hooks/GetDb'
import { RadioButton } from 'react-native-paper';
import UserModel from '../model/ModelUser';
import api from '../api/api';
import { useNavigation } from '@react-navigation/native'

export default function SecimEkrani({ apiSecim, apiInfo }) { //gelen api bilgilerini aldık meslek dil yada sectigi dil için

    const navigation = useNavigation()
    const [searchApi, result] = GetDb({ apiInfo }) //gelen api bilgisine göre veriyi getirdik result = gelen sonuç , searchApi = arama yapmak için kullanacaz 
    const [selectedValue, setSelectedValue] = useState("") //Radio buttonu ile seçilen veriyi tutmak için useState ' i kullandık
    const [dilSeviyesi, SetDilSeviyesi] = useState("")
    const [term, setTerm] = useState("")  //arama yapmak için bu useState kullandık

    const user = UserModel.getCurrentUser() //kullanıcının id'sini almak için
    const Gecis = async (term) => {
        console.log(term)
        if (term == "/mesleki") { //seçim ekranı meslekse buraya 
            const response = await api.post("/kullanici" + apiSecim, {
                meslek: selectedValue,
                id: user[0].id
            })
            if (response.data.STATUS == "SUCCES") {
                setSelectedValue(null)
                navigation.navigate("DilEkrani")
            }

        } else if (term == "/dili") {
            const response = await api.post("/kullanici" + apiSecim, {
                dil: selectedValue,
                id: user[0].id
            })
            if (response.data.STATUS == "SUCCES") {
                setSelectedValue(null)
                navigation.navigate("SectigiDilEkranı")
            }
        } else if (term == "/sectigiDili") {
            console.log
            const response = await api.post("/kullanici" + apiSecim, {
                sectigiDil: selectedValue,
                id: user[0].id
            })
            if (response.data.STATUS == "SUCCES") {
                setSelectedValue("")
                navigation.navigate("DilSeviyesiEkrani")
            }
        } else if (term == "/seviyei") {
            console.log("sdasdafsgsf")
            const response = await api.post("/kullanici" + apiSecim, {
                dilSeviyesi: dilSeviyesi,
                id: user[0].id
            })
            if (response.data.STATUS == "SUCCES") {
                // setSelectedValue("")
                navigation.navigate("Welcome")
            }
        }
        else {
            console.log(apiInfo)
        }

    }
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
                            <View style={{ flexDirection: "row", backgroundColor: "#4169e1", marginVertical: 10 }}>
                                <RadioButton
                                    value={item.idMeslek}
                                    status={selectedValue === item.idMeslek ? "checked" : "unchecked"}
                                    onPress={() => setSelectedValue(item.idMeslek)}
                                    color="darkgrey"
                                    left="15"
                                    backgroundColor="#000000"
                                />
                                <Text style={styles.textStyle}>{item.meslek}</Text>
                            </View>
                        )

                    }}
                />
                <View>
                    <TouchableOpacity onPress={() => { (selectedValue == "") ? Alert.alert("Bir Meslek Seç") : Gecis("/mesleki") }} //tıkladığımız veriyi doğru mu diye kontrol ettik
                    >
                        <Text style={styles.secimTextStyles}>Seçimi Onaylıyorum</Text>
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
                                <View style={{ flexDirection: "row", backgroundColor: "#4169e1", marginVertical: 10 }}>
                                    <RadioButton
                                        value={item.id}
                                        status={selectedValue === item.id ? "checked" : "unchecked"}
                                        onPress={() => setSelectedValue(item.id)}
                                        color="darkgrey"
                                        left="15"
                                        backgroundColor="#000000"
                                    />
                                    <Text style={styles.textStyle}>{item.dil_adi}</Text>
                                </View>
                            )

                        }}
                    />
                    <View>
                        <TouchableOpacity onPress={() => { (selectedValue == "") ? Alert.alert("Bir Dil Seç") : Gecis("/dili") }} //tıkladığımız veriyi doğru mu diye kontrol ettik
                        >
                            <Text style={styles.secimTextStyles}>Seçimi Onaylıyorum</Text>
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
                                    <View style={{ flexDirection: "row", backgroundColor: "#4169e1", marginVertical: 10 }}>
                                        <RadioButton
                                            value={item.id}
                                            status={selectedValue === item.id ? "checked" : "unchecked"}
                                            onPress={() => setSelectedValue(item.id)}
                                            color="darkgrey"
                                            left="15"
                                            backgroundColor="#000000"
                                        />
                                        <Text style={styles.textStyle}>{item.dil_adi}</Text>
                                    </View>
                                )

                            }}
                        />
                        <View>
                            <TouchableOpacity onPress={() => { (selectedValue == "") ? Alert.alert("Bir Dil Seç") : Gecis("/sectigiDili") }} //tıkladığımız veriyi doğru mu diye kontrol ettik
                            >
                                <Text style={styles.secimTextStyles}>Seçimi Onaylıyorum</Text>
                            </TouchableOpacity>
                        </View>

                    </View> :
                    apiInfo = "/seviye" ?
                        <View>
                            <RadioButton
                                value="1"
                                status={selectedValue === "1" ? "checked" : "unchecked"}
                                onPress={() => SetDilSeviyesi("1")}
                                color="darkgrey"
                                left="15"
                                backgroundColor="#000000"
                            />
                            <Text style={styles.textStyle}>Yeni başladım</Text>
                            <View>
                                <TouchableOpacity onPress={() => { (dilSeviyesi == "") ? Alert.alert("Bir Dil Seviyesi Seç") : Gecis("/seviyei") }} //tıkladığımız veriyi doğru mu diye kontrol ettik
                                >
                                    <Text style={styles.secimTextStyles}>Seçimi Onaylıyorum</Text>
                                </TouchableOpacity>
                            </View>

                        </View> :
                        <View>

                        </View>

    )
}

const styles = StyleSheet.create({
    textStyle: {
        fontSize: 25,
        color: "#87cefa",
        fontWeight: "bold",
        marginHorizontal: 15,
        left: 15
    },
    secimTextStyles: {
        fontSize: 25,
        left: 150,
        top: 25,
        fontWeight: "bold"
    }

}) 