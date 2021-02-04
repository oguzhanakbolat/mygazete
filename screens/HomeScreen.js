import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import {useSetting} from "../hooks/use-setting";
import Advertisement from "../components/Advertisement";
import Slider from "../components/Slider";
import Change from "../components/Change";
import Weather from "../components/Weather";
import ItemList from "../components/ItemList";


export default function App({navigation}) {
    const {apiURL, loading, setLoading} = useSetting();
    const [gundem, setGundem] = useState();

    const getGundem = () => {
        setLoading(true);
        axios.get(apiURL + 'gundem_restapi/gundem')
        .then( response => {
            setGundem(response.data);
            setLoading(false);
        })
        .catch( error =>  console.log(error));
    }

    useEffect(() => {
        getGundem();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView>
                { gundem?.news && <Advertisement advertisement={'haber_ust'}/> }
                { gundem?.slider && <Slider slider={gundem.slider} navigation={navigation}/> }
                { gundem?.news && <Change /> }
                { gundem?.news && <Advertisement advertisement={'haber_resim_alt'}/> }
                { gundem?.news && <Weather /> }
                { gundem?.news && gundem?.news.map((item, i) => <ItemList key={i} news={item} navigation={navigation}/>)}
                { gundem?.news && <Advertisement advertisement={'haber_alt'}/> }
            </ScrollView>
            { loading && <View style={styles.containerLoading}><ActivityIndicator size="large" color="#0000ff" /></View> }
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
  }
});
