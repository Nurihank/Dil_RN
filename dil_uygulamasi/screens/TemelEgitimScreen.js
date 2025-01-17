import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserModel from '../model/ModelUser';
import api from '../api/api';
import { Modal, ProgressBar } from 'react-native-paper';

export default function TemelEgitimScreen() {
    const navigation = useNavigation();
    const [gecilenBolumler, setGecilenBolumler] = useState([]);
    const [userId, setUserId] = useState();
    const [HangiDilID, setHangiDilID] = useState();
    const [AnaDilID, setAnaDilID] = useState();
    const [temelKategoriler, setTemelKategoriler] = useState([]);
    const [kategoriBolumleri, setKategoriBolumleri] = useState({}); // Bölümleri kategorilere göre saklamak için
    const [sozlukModal, setSozlukModal] = useState(false)
    const [sozlukKelimeler,setSozlukKelimeleri] = useState()
    const [gosterimDurumu, setGosterimDurumu] = useState({});
    
    const setUserID = async () => {
        const id = await AsyncStorage.getItem("id");
        setUserId(id);
    };
    const SozluktenKelimeSilme = async(item)=>{
        console.log(item)
        const response = await api.delete("/kullanici/temelSozluk",{
            params:{
                KullaniciID:userId,
                KelimeID:item.id
            }
        }) 
        sozlukKelimeleriGetir()
    }
    const getUserInfo = async () => {
        const user = await UserModel.currentUser;
        setHangiDilID(user[0].DilID);
        setAnaDilID(user[0].SectigiDilID);
    };

    const OyunGecis = (bolumId, KategoriID) => {
        navigation.navigate("TemelEgitimOyun", { BolumID: bolumId, UserID: userId, AnaDilID: AnaDilID, HangiDilID: HangiDilID, KategoriID: KategoriID })
    }

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                await setUserID();
                await getUserInfo();
            };
            fetchData();
        }, [])
    );

    const temelKategorileriGetir = async () => {
        try {
            const response = await api.get("/kullanici/temelKategoriler", {
                params: {
                    AnaDilID: AnaDilID,
                    HangiDilID: HangiDilID,
                },
            });
            setTemelKategoriler(response.data.message);
            fetchAllBolumler(response.data.message);
        } catch (error) {
            console.error(error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            const gecilenBolumler = async () => {
                const response = await api.get("/kullanici/temelGecilenBolum", {
                    params: {
                        KullaniciID: userId
                    }
                })
                setGecilenBolumler(response.data.message)
            }
            if (userId) {
                gecilenBolumler()
            }
        }, [userId])
    )

    const SozlukModali = ()=>{
        sozlukKelimeleriGetir()
        setSozlukModal(!sozlukModal)
    }

    const fetchAllBolumler = async (kategoriler) => {
        const bolumPromises = kategoriler.map(async (kategori) => { /* map fonks kullanılmış */
            try {
                const response = await api.get("/kullanici/temelBolumler", {
                    params: {
                        AnaDilID,
                        HangiDilID,
                        KategoriID: kategori.id,
                    },
                });
                return { kategoriId: kategori.id, bolumler: response.data.message };
            } catch (error) {
                console.error(error);
                return { kategoriId: kategori.id, bolumler: [] };
            }
        });

        const bolumData = await Promise.all(bolumPromises);
        const bolumMap = {};
        bolumData.forEach(({ kategoriId, bolumler }) => {
            bolumMap[kategoriId] = bolumler; /* kategori id'sine göre set ettil */
        });
        setKategoriBolumleri(bolumMap);
    };

    const isBolumAcik = (kategoriId, bolumOrder) => {

        if (bolumOrder === 1) {
            return true;
        }

        const gecilen = gecilenBolumler.filter(
            (bolum) => bolum.KategoriID === kategoriId
        );
        const sonuc = gecilen.some((bolum) => bolum.Order + 1 === bolumOrder);

        return sonuc;
    }; 

    const renderItem = ({ item }) => {
  const isVisible = gosterimDurumu[item.value];

  return (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.itemText}>
          {isVisible ? item.Ceviri : item.value}
        </Text>
      </View>

      <View style={styles.iconContainer}>
        <TouchableOpacity
          onPress={() =>
            setGosterimDurumu((prev) => ({
              ...prev,
              [item.value]: !prev[item.value],
            }))
          }
        >
          <Image
            source={
              isVisible
                ? require("../assets/acikGoz.png")
                : require("../assets/kapaliGoz.png")
            }
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => SozluktenKelimeSilme(item)}>
          <Image
            source={require("../assets/delete.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

    const sozlukKelimeleriGetir =async ()=>{
        console.log(userId)
        const response = await api.get("/kullanici/temelSozluk",{
            params:{
                KullaniciID:userId
            }
        })
        console.log(response.data.message)
        setSozlukKelimeleri(response.data.message)
    }

    useEffect(() => {
        if (HangiDilID && AnaDilID) {
            temelKategorileriGetir();
        }
    }, [AnaDilID, HangiDilID]);

    return (
        <View style={styles.container}>
            <View style={{flexDirection:"row",paddingHorizontal:15}}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.button} onPress={()=>SozlukModali()}>
                    <Image source={require("../assets/temelSozluk.png")} style={{height:75,width:75}} />
                </TouchableOpacity>
            </View>
            <View style={styles.progressBarContainer}>
                <Text>%35 İlerleme</Text>
                <ProgressBar progress={0.35} width={230} height={50} color={'#6c5ce7'} />
            </View>
        </View>
       

            <FlatList
                data={temelKategoriler}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.text}>{item.Ceviri}</Text>
                        <FlatList 
                            data={kategoriBolumleri[item.id] || []}
                            keyExtractor={(bolum) => bolum.id.toString()}
                            renderItem={({ item: bolum }) => (
                                isBolumAcik(item.id, bolum.Order) ? (
                                    <TouchableOpacity onPress={() => OyunGecis(bolum.id, item.id)}>
                                        <View style={styles.bolumContainer}>
                                            <Image source={{ uri: bolum.Image }} style={styles.icon} />
                                            <Text style={styles.bolumText}>{bolum.ceviri}</Text>  
                                        </View>
                                    </TouchableOpacity>
                                ) : (
                                    <View style={styles.bolumContainer}>
                                        <Image
                                            source={require("../assets/lock.png")}
                                            style={{ width: 30, height: 30 }}
                                        />
                                        <Text style={styles.bolumTextKapali}>Kilitli</Text>
                                    </View>
                                )
                            )}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.horizontalListContainer}
                        />
                    </View>
                )}
            />
             <Modal
    visible={sozlukModal}
    animationType="slide"
    transparent={true}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <TouchableOpacity onPress={SozlukModali} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
        <Text style={styles.modalTitle}>Sözlük Kelimeleri</Text>

        {sozlukKelimeler && sozlukKelimeler.length > 0 ? (
          <FlatList
            data={sozlukKelimeler}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <Text style={styles.emptyText}>Gösterilecek kelime yok.</Text>
        )}
      </View>
    </View>

    </Modal>
        
        
        </View>
        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    item: {
        padding: 15,
        backgroundColor: '#f1f8ff',
        shadowColor: '#ccc',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        borderBottomWidth: 2,
        borderBottomColor: '#ccc',
    },
    text: {
        fontSize: 24,
        marginBottom: 8,
        fontWeight: 'bold',
        color: '#ff6f61',
    },
    bolumContainer: {
        alignItems: 'center',
        marginRight: 15,
        backgroundColor: '#dfe6e9',
        padding: 10,
        borderRadius: 15,
        width: 130,
        height: 90,
    },
    bolumText: {
        fontSize: 18,
        color: '#6c5ce7',
        marginLeft: 10,
    },
    header: {
        flexDirection: 'column',
        paddingVertical: 15,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 13,
        borderRadius: 10,
        width: 75,
        height: 75,
        marginRight: 35,
        marginTop: 15,
    },
    button: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ff6f61',
        marginBottom: 5,
    },
    icon: {
        width: 50,
        height: 50,
    },
    progressBarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: "7%",
    },
    progressBar: {
        borderRadius: 10,
    },

    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalText: {
        fontSize: 18,
        color: '#333',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#ff6f61',
        borderRadius: 20,
        padding: 10,
    },
    closeButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },itemContainer:{
        flexDirection:"row"
    },iconContainer:{
        flexDirection:"row"

    }
});
