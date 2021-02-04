import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Dimensions, Image } from 'react-native';
import axios from 'axios';
import {useSetting} from "../hooks/use-setting";

const window = Dimensions.get('screen');

export default function Advertisement(props) {
    const {apiURL} = useSetting();
    const [advert, setAdvert] = useState();

    useEffect(() => {
        axios.get(apiURL + 'reklam_restapi/reklam')
        .then( response => {
            if(props.advertisement === 'haber_ust') {
                const countHeader = response.data.haber_ust.length;
                const random = Math.floor((Math.random() * countHeader));
                setAdvert(response.data.haber_ust[random]);
            }

            if(props.advertisement === 'haber_resim_alt') {
                const countGeneral = response.data.haber_resim_alt.length;
                const random = Math.floor((Math.random() * countGeneral));
                setAdvert(response.data.haber_resim_alt[random]);
            }

            if(props.advertisement === 'haber_alt') {
                const countGeneral = response.data.haber_alt.length;
                const random = Math.floor((Math.random() * countGeneral));
                setAdvert(response.data.haber_alt[random]);
            }
        })
        .catch(error => console.log(error));
    }, []);

    return (
        <>
            {
                advert &&
                <View style={styles.container}>
                    <View style={[styles.advertisement, {width: 320, height: 320 * advert.mediaHeight / advert.mediaWidth}]}>
                        <Image source={{uri: advert.reklam}} style={{width: 320, height: 320 * advert.mediaHeight / advert.mediaWidth}}/>    
                    </View>
                </View>
            }
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: window.width,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    advertisement: {
        backgroundColor: '#fff',
        marginVertical: 10,
        marginHorizontal: 20,
    }
});