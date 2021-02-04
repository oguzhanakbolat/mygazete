import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, Dimensions, useWindowDimensions, Text, TouchableOpacity, Image} from 'react-native';
import HTML from "react-native-render-html";
import axios from 'axios';
import {useSetting} from "../hooks/use-setting";
import Advertisement from "../components/Advertisement";
import TopSlider from "../components/TopSlider";
import ItemList from "../components/ItemList";

const { width, height } = Dimensions.get('screen');

export default function CategoryScreen({navigation, route}) {
    const {apiURL, setLoading, loading, setScreen} = useSetting();
    const [data, setData] = useState();
    const contentWidth = useWindowDimensions().width;

    const getGundem = () => {
        setLoading(true);

        if(route?.params?.category?.kategori_tip === 'category') {
            axios.get(apiURL + 'kategori_icerik_restapi/kategori?kategori=' + route?.params?.category?.kategori_link)
            .then( response => {setData(response.data);
                setLoading(false);
            })
            .catch(error => console.log(error));
        }
        else if(route?.params?.category?.kategori_tip === 'page') {
            axios.get(apiURL + 'sayfa_icerik_restapi/secili?sayfa=' + route?.params?.category?.kategori_link)
            .then( response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => console.log(error));
        }
    }

    const onPress = (id, item) => {
        setScreen('DetailScreen');

        const makale = [{
            id: item.son_yazi_id
        }];

        navigation.navigate('DetailScreen', {id, list: makale});
        setLoading(true);
    }

    useEffect(() => {
        getGundem();
    }, [])

    return (
        <View style={styles.container}>
            <ScrollView>
                {
                    route?.params?.category?.kategori_tip === 'category' &&
                    <>
                        { data?.slider && <Advertisement advertisement={'haber_ust'}/> }
                        { data?.slider && <TopSlider slider={data.slider} navigation={navigation}/> }
                        { data?.news && <Advertisement advertisement={'haber_resim_alt'}/> }
                        { data?.news && <ItemList news={data.news} navigation={navigation}/> }
                        { data?.news && <Advertisement advertisement={'haber_alt'}/> }
                    </>
                }
                {
                    route?.params?.category?.kategori_link === 'kunye' &&
                    <View style={{padding: 15, backgroundColor: '#fff'}}>
                        <HTML source={{ html: data?.kunye }}
                            baseFontStyle={{ fontFamily: "Roboto" }}
                            ignoredStyles={["font-family", "letter-spacing"]}
                            contentWidth={contentWidth - 30}
                            tagsStyles={{ p: { marginTop: 5, marginBottom: 5, fontSize: 14, lineHeight: 20 }, blockquote: { backgroundColor: "#f1f1f1", padding: 12, paddingBottom: 0, marginTop: 6 } }}/>
                    </View>
                }

{
                    route?.params?.category?.kategori_link === 'iletisim' &&
                    <View style={{padding: 15, width, height: height - 210, backgroundColor: '#fff'}}>
                        <Text>İletişim ekranı hazırlanıyor</Text>
                    </View>
                }
                {
                    route?.params?.category?.kategori_link === 'son-dakika-haberleri' &&
                    <View style={{padding: 15, width, height: height - 210, backgroundColor: '#fff'}}>
                        <Text>Son Dakika ekranı hazırlanıyor</Text>
                    </View>
                }
                {
                    route?.params?.category?.kategori_link === 'yazarlar' &&
                    <View style={styles.yazarContainer}>
                    {
                        data?.yazarlar?.map((item, i) => 
                            <TouchableOpacity key={i} onPress={() => onPress(item.son_yazi_id, item)}>
                                <View style={styles.yazar}>
                                    <Image source={{uri: item.foto_url}} style={styles.yazarImage}/>
                                    <Text style={styles.yazarTitle}>{item.adi}</Text>
                                    <View style={styles.yazarText}>
                                        <HTML source={{ html: item.son_yazi_baslik }}
                                            baseFontStyle={{ fontFamily: "Roboto" }}
                                            ignoredStyles={["font-family", "letter-spacing"]}
                                            contentWidth={contentWidth / 2 - 40}
                                            tagsStyles={{ p: { marginTop: 5, marginBottom: 5, fontSize: 14, lineHeight: 20 }, blockquote: { backgroundColor: "#f1f1f1", padding: 12, paddingBottom: 0, marginTop: 6 } }}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                    </View>
                }
            </ScrollView>
            {
                loading &&
                <View style={styles.containerLoading}><ActivityIndicator size="large" color="#0000ff" /></View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    yazarContainer: {
        padding: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#fff'
    },
    yazar: {
        margin: 5,
        width: width / 2 - 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: 1
    },
    yazarImage: {
      width: width / 2 - 28, 
      height: width / 2 - 28,
      marginTop: 3,
      marginBottom: 5
    },
    yazarTitle: {
        fontWeight: 'bold',
        color: '#444',
        paddingHorizontal: 5,
        height: 40
    },
    yazarText: {
        paddingHorizontal: 5,
        color: '#888',
        height: 60
    },
  container: {
    flex: 1,
    backgroundColor: '#ddd',
    alignItems: 'center',
  },
  containerLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    backgroundColor: '#0005',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: width - 100,
    height: width - 100
  },
});