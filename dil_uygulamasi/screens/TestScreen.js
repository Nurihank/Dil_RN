import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    Modal,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
} from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import api from "../api/api";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserModel from "../model/ModelUser";

export default function TestScreen(route) {
    const [modalVisible, setModalVisible] = useState(true);
    const [name, setName] = useState("");
    const [meslekler, setMeslekler] = useState([]);
    const [meslekID, setMeslekID] = useState(null);
    const [diller, setDiller] = useState([]);
    const [dilID, setDilID] = useState(null);
    const [dillerL, setDillerL] = useState([]);
    const [dilIDL, setDilIDL] = useState(null);
    const [testSorulari, setTestSorulari] = useState([]);
    const [soruKelimesi, setSoruKelimesi] = useState();
    const [siklar, setSiklar] = useState([]);
    const [soruIndex, setSoruIndex] = useState(0);
    const [dogruCevaplar, setDogruCevaplar] = useState([]);
    const [yanlisCevaplar, setYanlisCevaplar] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [testSonuModal, setTestSonuModal] = useState(false)
    const [gelenID, setGelenID] = useState()
    const [userID, setUserID] = useState()

    const navigation = useNavigation()

    useEffect(() => { /* giriş yaptığnı kotnrol edşiyor ona göre kullanıcı verilerini alacak */
        if (route.route.params.girisYapmisMi) {
            console.log(route.route.params.girisYapmisMi)
            const KullaniciVerileri = async () => {
                const user = await UserModel.currentUser;
                setUserID(user[0].id)
                setDilIDL(user[0].DilID)
                setDilID(user[0].SectigiDilID)
                setMeslekID(user[0].MeslekID)
                setName(user[0].kullaniciAdi)
            }
            KullaniciVerileri()
        } else {
            console.log(route.route.params.girisYapmisMi)
        }
    }, [])

    const Sorular = () => {
        if (soruIndex < testSorulari.length || soruIndex < 12) {

            const soru = testSorulari[soruIndex]; // Mevcut soru
            setSoruKelimesi(soru);

            const dogruCevap = soru;

            // Yanlış cevapları rastgele seç (doğru cevap dışındaki 3 tanesini al)
            let yanlisCevaplar = testSorulari
                .filter(item => item !== dogruCevap) // Doğru cevabı çıkar
                .sort(() => Math.random() - 0.5) // Karıştır
                .slice(0, 3); // İlk 3 tanesini al   

            // Doğru cevabı rastgele bir konuma yerleştir
            const rastgeleIndex = Math.floor(Math.random() * 4); // 0 ile 3 arasında rastgele index seç       
            let siklar = [...yanlisCevaplar];

            siklar.splice(rastgeleIndex, 0, dogruCevap); // Doğru cevabı rastgele bir konuma ekle

            setSiklar(siklar); // Şıkları state'e kaydet 
            setSoruIndex(soruIndex + 1);
        } else {
            testSonu()
        }
    };

    const testSonu = async () => {

        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        const responseID = await api.post("/kullanici/test", {
            Name: name,
            Date: formattedDate
        })
        setGelenID(responseID.data.id)
        const testID = JSON.stringify(responseID.data.id)
        AsyncStorage.setItem("testID", testID)
        console.log("TEST ID =" + testID)
        if (route.route.params.girisYapmisMi) {
            navigation.navigate("Profil")
        } else {
            setTestSonuModal(true)
        }

    }


    const dogruMuCevap = () => {
        Sorular()
        if (soruKelimesi.Ceviri === selectedOption.Ceviri) {
            setDogruCevaplar(prevState => [...prevState, soruKelimesi]);
            setSelectedOption(null)

        } else {
            setYanlisCevaplar(prevState => [...prevState, soruKelimesi])
            setSelectedOption(null)

        }
    };

    useEffect(()=>{
        if(selectedOption){
            dogruMuCevap()
        }
    },[selectedOption])

    useEffect(() => {
        const Kaydet = async () => {
            try {
                for (let kelime of dogruCevaplar) {
                    await api.post("/kullanici/TestSorulari", {
                        TestID: gelenID,
                        KelimeID: kelime.AnaKelimelerID,
                        dogruMu: 1
                    });
                    console.log("d "+kelime.AnaKelimelerID)
                }

                // Daha sonra yanlış cevapları kaydet
                for (let kelime of yanlisCevaplar) {
                    await api.post("/kullanici/TestSorulari", {
                        TestID: gelenID,
                        KelimeID: kelime.AnaKelimelerID,
                        dogruMu: 0
                    });
                    console.log("y "+kelime.AnaKelimelerID)

                }
                console.log("Tüm kelimeler başarıyla kaydedildi.");
            } catch (error) {
                console.error("Kelimeleri kaydederken hata oluştu:", error);
            }
        };

        if (gelenID) {
            Kaydet();
            if (route.route.params.girisYapmisMi) {
                const TesIDKaydet = async () => {
                    console.log("burday")
                    const response = await api.post("/kullanici/TestIDKaydet", {
                        TestID: gelenID,
                        KullaniciID: userID
                    })
                    console.log(response.data.message)
                }
                TesIDKaydet()
            } else {

            }
        }
    }, [gelenID]);


    useEffect(() => {
        const TestKelimeleri = async () => {
            const response = await api.get("/kullanici/test", {
                params: {
                    MeslekID: meslekID,
                    DilID: dilIDL,
                    OgrencegiDilID: dilID,
                }
            });
            setTestSorulari(response.data.message[0]);
        };
        TestKelimeleri();
    }, [dilIDL, meslekID, dilID]);

    useEffect(() => {
        const MeslekleriGetir = async () => {
            try {
                const response = await api.get("/kullanici/meslek");

                if (response.data.result && Array.isArray(response.data.result)) {
                    const formattedData = response.data.result.map(meslek => ({
                        label: meslek.meslek,
                        value: meslek.idMeslek,
                    }));
                    setMeslekler(formattedData);
                }
            } catch (error) {
                console.error("Meslekleri getirirken hata oluştu:", error);
            }
        };

        const DilleriGetir = async () => {
            try {
                const response = await api.get("/kullanici/dil");

                if (response.data.result && Array.isArray(response.data.result)) {
                    const formattedDataL = response.data.result.map(dil => ({
                        label: dil.LocalName,
                        value: dil.DilID,
                    }));
                    setDillerL(formattedDataL);

                    const formattedData = response.data.result.map(dil => ({
                        label: dil.DilAdi,
                        value: dil.DilID,
                    }));
                    setDiller(formattedData[0]);
                }
            } catch (error) {
                console.error("Dilleri getirirken hata oluştu:", error);
            }
        };
        DilleriGetir();
        MeslekleriGetir();
    }, []);

    const handleModalClose = () => {
        if (name == null || meslekID == null || dilID == null || dilIDL == null) {
            alert("Boş yer Kalmasın")
        } else {
            Sorular();  // Soruları yükle
            setModalVisible(false);  // Modalı kapat
        }
    };

    const placeholder = {
        label: 'Meslek Seç',
        value: null,
    };

    const placeholderD = {
        label: 'Dil Seç',
        value: null,
    };

    const renderSiklar = ({ item }) => {

        const isSelected = selectedOption && selectedOption.AnaKelimelerID === item.AnaKelimelerID; // id ile eşleşme kontrolü (id'yi öğeyle sağlamak gerekebilir)
        return (
            (item) ? 
            <TouchableOpacity onPress={() => setSelectedOption(item)}>
                <View style={[styles.sikContainer, isSelected && styles.selectedOption]}>
                    <Text style={[styles.sikText, isSelected && styles.selectedText]}>{item.Ceviri}</Text>
                </View>
            </TouchableOpacity>
            :
            null
        );
    };

    return (
        <View style={styles.container}>
            <View style={{ bottom: 150, right: 120 }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        backgroundColor: '#FF4C4C', // Kırmızı arka plan
                        paddingVertical: 10,
                        paddingHorizontal: 15,
                        borderRadius: 10,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 3,
                        elevation: 5, // Android gölge efekti
                    }}
                >
                    <Text style={{
                        color: 'white',
                        fontSize: 18,
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>
                        ❌ Çıkış
                    </Text>
                </TouchableOpacity>
            </View>
            <Text>{soruIndex} / 12</Text>
            {soruKelimesi && (
                <View style={styles.soruContainer}>
                    <Text style={styles.soruText}>{soruKelimesi.Kelime}</Text>
                    <FlatList
                        data={siklar}
                        renderItem={renderSiklar}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            )}

            {/* Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Size nasıl hitap edelim?</Text>

                        {/* İsim Girişi */}
                        <TextInput
                            style={styles.input}
                            placeholder="İsminizi giriniz"
                            value={name}
                            onChangeText={setName}
                            editable={!route.route.params.girisYapmisMi} // Eğer giriş yapılmışsa devre dışı bırak
                            textAlignVertical="center" // `verticalAlign` yerine `textAlignVertical`
                        />

                        {/* Meslek Seçimi */}
                        <Text style={styles.label}>Mesleğinizi seçin:</Text>
                        <RNPickerSelect
                            placeholder={placeholder}
                            items={meslekler}
                            onValueChange={(value) => setMeslekID(value)}
                            value={meslekID}
                            style={pickerSelectStyles}
                            disabled={route.route.params.girisYapmisMi}
                        />

                        <Text style={styles.label}>Ana Dilinizi seçin:</Text>
                        <RNPickerSelect
                            placeholder={placeholderD}
                            items={dillerL}
                            onValueChange={(value) => setDilIDL(value)}
                            value={dilIDL}
                            style={pickerSelectStyles}
                            disabled={route.route.params.girisYapmisMi}
                        />

                        <Text style={styles.label}>Öğrenmek İstediğiniz Dili seçin:</Text>
                        <RNPickerSelect
                            placeholder={placeholderD}
                            items={diller}
                            onValueChange={(value) => setDilID(value)}
                            value={dilID}
                            style={pickerSelectStyles}
                            disabled={route.route.params.girisYapmisMi}
                        />


                        {/* Buton */}
                        <TouchableOpacity style={styles.button} onPress={handleModalClose}>
                            <Text style={styles.buttonText}>Teste Hazırım</Text>
                        </TouchableOpacity>
                        {/* Buton */}
                        <TouchableOpacity style={[styles.button, { backgroundColor: "red" }]} onPress={() => navigation.goBack()}>
                            <Text style={styles.buttonText}>Çıkış</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/**/}
            <Modal visible={testSonuModal} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Test Sonucu</Text>
                        <Text style={{ fontSize: 17, color: "gray", fontWeight: "bold" }}>
                            {name} Test sonucunu görmek için
                        </Text>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.replace("Signin")}>
                            <Text style={styles.buttonText}>Giriş Yap</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={() => navigation.replace("Signup")}>
                            <Text style={styles.buttonText}>Kayıt Ol</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    soruContainer: {
        width: '100%',
        marginBottom: 30,
        alignItems: 'center',
    },
    soruText: {
        fontSize: 32,
        fontWeight: '700',
        color: '#333',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 40,
    },
    sikContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        paddingVertical: 18,
        paddingHorizontal: 25,
        marginBottom: 20,
        width: '100%',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
        transform: [{ scale: 1.05 }],
    }, selectedOption: {
        backgroundColor: '#483d8b', // Yeşil renk
    },
    selectedText: {
        color: '#fff',
    },
    sikText: {
        fontSize: 20,
        color: '#444',
        fontWeight: '500',
        textAlign: 'center',
    },
    nextButton: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextImage: {
        height: 60,
        width: 60,
        borderRadius: 30,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 20,
        width: '90%',
        maxWidth: 450,
        alignItems: 'center',
        elevation: 10,
    },
    modalTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: '#333',
        marginBottom: 25,
    },
    input: {
        width: '100%',
        padding: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#f1f1f1',
        fontSize: 16,
        color: '#333',
    },
    label: {
        alignSelf: 'flex-start',
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#00bcd4',
        padding: 18,
        borderRadius: 12,
        marginTop: 25,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    pickerStyle: {
        width: '100%',
        height: 50,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 20,
    },
});


const pickerSelectStyles = StyleSheet.create({
    pickerStyle: {
        width: '100%',
        height: 50,
        backgroundColor: '#fafafa',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 20,
    },
});