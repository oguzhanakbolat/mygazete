import React, { useEffect }  from 'react';
import {StyleSheet, Text, View, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';
import {useSetting} from "../hooks/use-setting";

const window = Dimensions.get('screen');
const sliderHeight = window.width * 440 / 778;

export default function ItemList({news, navigation: {navigate, setParams}}) {
    const {setScreen, screen, setLoading} = useSetting();
    const onPress = (id, list) => {
        if(screen === 'DetailScreen')  {
            setParams({ id, list, key: id});
        }
        else {
            setScreen('DetailScreen');
            navigate('DetailScreen', { id, list, key: id});
        }
        setLoading(true);
    }

    return (
        <>
            {
                !!news &&
                news.map(item => 
                    <TouchableWithoutFeedback key={item.id} onPress={() => onPress(item.id, news)}>
                        <View key={item.id} style={styles.container}>
                            <Image source={{uri: item.media}} style={[styles.sliderImage, {height: window.width * item.mediaHeight / item.mediaWidth}]}/>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.text}><Text style={styles.type}>{item.type}</Text> {item.date}</Text>
                        </View> 
                    </TouchableWithoutFeedback>
                )
            }
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: window.width,
        backgroundColor: '#fff',
        marginBottom: 10
    },
    row: {
        width: window.width,
        height: sliderHeight,
        backgroundColor: '#fff',
        position: 'relative'
    },
    sliderImage: {
        width: window.width,
        resizeMode: 'cover'
    },
    title: {
        padding: 10,
        fontWeight: 'bold',
        fontSize: 16
    },
    type: {
        color: '#777',
        fontWeight: 'bold',
    },
    text: {
        paddingHorizontal: 10,
        marginBottom: 10,
        color: '#555'
    }
});