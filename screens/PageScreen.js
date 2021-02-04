import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import axios from 'axios';
import HTML from "react-native-render-html";
import {useSetting} from "../hooks/use-setting";
import Advertisement from "../components/Advertisement";
import Slider from "../components/Slider";
import ItemList from "../components/ItemList";



const { width } = Dimensions.get('screen');

export default function PageScreen({navigation, route}) {
    const {apiURL, setLoading, loading} = useSetting();
    const [data, setData] = useState();

    const getGundem = () => {
        setLoading(true);
        axios.get(apiURL + 'sayfa_icerik_restapi/secili?sayfa=' + route?.params?.category?.kategori_link)
        .then( response => {
            setData(response.data);
            setLoading(false);
        })
        .catch(error => console.log(error));
    }

    useEffect(() => {
        getGundem();
    }, [])

    return (
        <View style={styles.container}>
            <ScrollView>
            {
            !!data &&
            <HTML source={{ html: data.kunye }}
                  baseFontStyle={{ fontFamily: "Roboto" }}
                  ignoredStyles={["font-family", "letter-spacing"]}
                  contentWidth={contentWidth - 40}
                  tagsStyles={{ p: { marginTop: 5, marginBottom: 5, fontSize, lineHeight: 20 }, blockquote: { backgroundColor: "#f1f1f1", padding: 12, paddingBottom: 0, marginTop: 6 } }}/>
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
  }
});