import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, Image } from 'react-native';
import axios from 'axios';
import {useSetting} from "../hooks/use-setting";

const { width } = Dimensions.get('screen');

export default function Slider() {
    const {apiURL} = useSetting();
    const [change , setChange] = useState([]);

    useEffect(() => {
        getChange();
    }, [])

    const getChange = () => {
        axios.get(apiURL + 'borsa_restapi/borsa')
        .then( response => {
            setChange(response.data);
        })
        .catch( error =>  console.log(error));
    }

    const changeNumber = (value, fixed) => {
        const nmbr = value.split(',');
        let sayi = 0;
        let firstNumber = 0;

        const nbr = nmbr[0].split('.');

        if(nbr.length > 1){
            firstNumber = Number(nbr[0] + '' + nbr[1]);
        }
        else {
            firstNumber = nmbr[0];
        }


        if(nmbr.length > 1) {
            sayi = Number(firstNumber + '.' + nmbr[1]).toFixed(fixed);
        }
        else {
            sayi = Number(value).toFixed(fixed);
        }

        return sayi;
    }

    return (
        <View style={styles.container}>
            {
                //s equal
                change.dolar &&
                <View style={styles.change}>
                    <Text style={styles.title}>DOLAR</Text>
                    <Text style={styles.text}>{changeNumber(change.dolar[0].kur, 4)}</Text>
                    <Image style={styles.icon} source={change.dolar[0].kur_durum === 's up' ? require('../assets/up.png') : (change.dolar[0].kur_durum === 's dw' ? require('../assets/down.png') : (change.dolar[0].kur_durum === 's equal' ? require('../assets/equal.png') : require('../assets/foo.png')))}/>
                    <Text style={styles.text}>{change.dolar[0].kur_yon}</Text>
                </View>
            }
            {
                change.euro &&
                <View style={styles.change}>
                    <Text style={styles.title}>EURO</Text>
                    <Text style={styles.text}>{changeNumber(change.euro[0].kur, 4)}</Text>
                    <Image style={styles.icon} source={change.euro[0].kur_durum === 's up'  ? require('../assets/up.png') : (change.euro[0].kur_durum === 's dw' ? require('../assets/down.png') : (change.euro[0].kur_durum === 's equal' ? require('../assets/down.png') : require('../assets/foo.png')))}/>
                    <Text style={styles.text}>{change.euro[0].kur_yon}</Text>
                </View>
            }
            {
                change.altin &&
                <View style={styles.change}>
                    <Text style={styles.title}>ALTIN</Text>
                    <Text style={styles.text}>{changeNumber(change.altin[0].kur, 2)}</Text>
                    <Image style={styles.icon} source={change.altin[0].kur_durum === 's up'  ? require('../assets/up.png') : (change.altin[0].kur_durum === 's dw' ? require('../assets/down.png') : (change.altin[0].kur_durum === 's equal' ? require('../assets/down.png') : require('../assets/foo.png')))}/>
                    <Text style={styles.text}>{change.altin[0].kur_yon}</Text>
                </View>
            }
            {
                change.btc &&
                <View style={styles.change}>
                    <Text style={styles.title}>BTC</Text>
                    <Text style={styles.text}>{changeNumber(change.btc[0].kur, 2)}</Text>
                    <Image style={styles.icon} source={change.btc[0].kur_durum === 's up'    ? require('../assets/up.png') : (change.btc[0].kur_durum === 's dw' ? require('../assets/down.png') : (change.btc[0].kur_durum === 's equal' ? require('../assets/down.png') : require('../assets/foo.png')))}/>
                    <Text style={styles.text}>{change.btc[0].kur_yon}</Text>
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    paddingHorizontal: 5,
    marginVertical: 5,
    width,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  change: {
      width: (width - 18) / 4,
      margin: 1,
      height: 100,
      backgroundColor: '#fff',
      paddingVertical: 5,
      alignItems: 'center'
  },
  title: {
        width: (width - 18) / 4,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#3b5998',
        marginBottom: 4
  },
  text: {
        width: (width - 18) / 4,
        color: '#000',
        textAlign: 'center',
  },
  icon: {
      height: 21,
      width: 21
  }
});