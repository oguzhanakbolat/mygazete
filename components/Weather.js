import React, {useRef, useEffect, useState} from 'react';
import { StyleSheet, View, Text, Dimensions, Image } from 'react-native';
import axios from 'axios';
import {useSetting} from "../hooks/use-setting";

const { width } = Dimensions.get('screen');

export default function Slider() {
    const {apiURL} = useSetting();
    const [weather, setWeather] = useState();

    useEffect(() => {
        getWeather();
    }, [])

    const getWeather = () => {
        axios.get(apiURL + 'hava_restapi/hava')
        .then( response => {
            setWeather(response.data.hava_durumu[0]);
        })
        .catch(function (error) {
            console.log(error);
        }); 
    }

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{weather?.il}</Text>
                    <Text style={styles.text}>{weather?.durum}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Gündüz</Text>
                    <Text style={styles.titleBig}>{weather?.bugun}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Gece</Text>
                    <Text style={styles.titleBig}>{weather?.gece}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        padding: 10,
        width,

      },
    row: {
        width: width - 20,
        backgroundColor: '#fff',
        padding: 10,
        flexDirection: 'row'
    },
    titleContainer: {
        width: width / 3,
    },
    title: {
        fontWeight: 'bold'
    },
    titleBig: {
        fontSize: 16
    },
    text: {
        color: '#666',
        fontSize: 12,
        position: 'relative'
    },
    textDeg: {
        fontSize: 8,
        marginTop: 1,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    textContainer: {
        width: width / 3 - 10,
    },
    textRow: {
        flexDirection: 'row'
    },
    icon: {
      height: 21,
      width: 21
    }
});