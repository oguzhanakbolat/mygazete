import React, {useRef, useEffect, useState} from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, Image, TouchableWithoutFeedback} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {useSetting} from "../hooks/use-setting";

const { width } = Dimensions.get('screen');
const sliderHeight = width * 440 / 778;

export default function Slider({slider, navigation: {navigate}}) {
    const scrollRef = useRef(null);
    const {setScreen, setLoading} = useSetting();
    const [index, setIndex] = useState(0);

    const handleScroll = (event) => {
        const pos = event.nativeEvent.contentOffset.x;
        setIndex(Math.round(pos / width));
    }

    const onPress = (id, list) => {
      setScreen('DetailScreen');
      navigate('DetailScreen', { id, list, key: id});
      setLoading(true);
    }

    return (
      <>
        {
          slider &&
          <View style={styles.container}>
            <ScrollView
                horizontal={true}
                contentContainerStyle={styles.contentContainer}
                showsHorizontalScrollIndicator={false}
                ref={scrollRef}
                onScroll={handleScroll}
                scrollEventThrottle={width}
                pagingEnabled={true}
                nestedScrollEnabled={true}>
                {
                  slider.map(item =>
                    <TouchableWithoutFeedback key={item.id} style={[styles.row, {height: width * item.mediaHeight / item.mediaWidth}]} onPress={() => onPress(item.id, slider)}>
                      <View>
                        <Image source={{uri: item.image}} style={[styles.sliderImage, {height: width * item.mediaHeight / item.mediaWidth}]}/>
                        <LinearGradient colors={['transparent', '#000000']} style={styles.gradient}/>
                        <Text style={styles.sliderTitle}>{item.title}</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  )
                }
            </ScrollView>
            
            <View style={styles.circleContainer}>
              {
                slider.map((item, i) =>
                  <View style={index === i ? styles.circleActive : styles.circle} key={item.id} />
                )
              }
            </View>
          </View>
        }
      </>
    );
}

const styles = StyleSheet.create({
    container: {
      width,
      backgroundColor: '#fff',
      position: 'relative'
    },
    row: {
      width,
      backgroundColor: '#fff',
      position: 'relative'
    },
  sliderImage: {
    width,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    top: sliderHeight / 2,
    left: 0,
    right: 0,
  },
  sliderTitle: {
    position: 'absolute',
    bottom: 6,
    padding: 10,
    color: '#fff',
    fontSize: 18
  },
  circleContainer: {
    width,
    height: 7,
    position: 'absolute',
    bottom: 3,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  circleActive: {
      width: 7,
      height: 7,
      borderRadius: 5,
      backgroundColor: '#fff',
      marginLeft: 1
  },
  circle: {
      width: 7,
      height: 7,
      borderRadius: 5,
      backgroundColor: '#fff5',
      marginLeft: 1
  }
});