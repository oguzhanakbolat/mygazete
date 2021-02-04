import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableWithoutFeedback, Dimensions, TouchableOpacity, Animated } from 'react-native';
import * as Linking from 'expo-linking';
import {useSetting} from "../hooks/use-setting";
import axios from 'axios';

const { width } = Dimensions.get('screen');

export default function TabBar({ state, descriptors, navigation }) {
    const focusedOptions = descriptors[state.routes[state.index].key].options;
    const scrollRef = useRef(null);
    const [pos, setPos] = useState([]);
    const [yayin, setYayin] = useState({
        canli_yayin_durum: "Pasif",
        canli_yayin_link: "#",
        canli_yayin_metni: "",
    });

    const {apiURL, setMenuList, setTabState, setTabNav} = useSetting();

    if (focusedOptions.tabBarVisible === false) { return null; }

    useEffect(() => {
        axios.get(apiURL + 'canliyayin_restapi/canliyayin')
        .then( response => {
            setYayin(response.data[0]);
        })
        .catch( error =>  console.log(error));
    }, []);

    useEffect( () => {
        if(pos.length > 0) {
            const layout = pos[state.index];
            let xPos = 0;
            xPos = layout.x - width / 2 + layout.width / 2;
            scrollRef.current?.scrollTo({ x: xPos });
        }
        setTabNav(navigation);
        setMenuList(state.routes);
    }, [state]);

    useEffect(() => {
        setTabState(state);
    });
 
    const onLayout = event => {
        const list = [...pos];
        list.push(event.nativeEvent.layout);
        setPos(list);
    }

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true
                })
            ])
        ).start()
      }, [])
    
    return (
        <View style={[styles.topContainer, {height: yayin.canli_yayin_durum === 'Aktif' ? 84 : 42}]}>
            { 
                yayin.canli_yayin_durum === 'Aktif' &&
                    <TouchableOpacity onPress={() => Linking.openURL(yayin.canli_yayin_link)}>
                        <View style={styles.yayin}>
                            <Animated.Text style={{...styles.yayinText, opacity: fadeAnim}}>{yayin.canli_yayin_metni}</Animated.Text>
                        </View>
                    </TouchableOpacity>
   
            }
            <View style={[styles.container]}>
                <ScrollView 
                    horizontal={true}
                    contentContainerStyle={styles.contentContainer}
                    showsHorizontalScrollIndicator={false}
                    ref={scrollRef}
                    >
                    {
                        state.routes.map((route, index) => {
                            const { options } = descriptors[route.key];
                            
                            const label = options.tabBarLabel !== undefined
                                        ? options.tabBarLabel
                                        : options.title !== undefined
                                        ? options.title
                                        : route.name;

                            const isFocused = state.index === index;

                            const onPress = () => {
                                const event = navigation.emit({
                                    type: 'tabPress',
                                    target: route.key,
                                    canPreventDefault: true,
                                });

                                if (!isFocused && !event?.defaultPrevented) {
                                    navigation.navigate(route.name);
                                }
                            };

                            const onLongPress = () => {
                                navigation.emit({
                                    type: 'tabLongPress',
                                    target: route.key,
                                });
                            };

                            return (
                                <TouchableWithoutFeedback 
                                    accessibilityRole="button"
                                    accessibilityState={isFocused ? { selected: true } : {}}
                                    accessibilityLabel={options.tabBarAccessibilityLabel}
                                    testID={options.tabBarTestID}
                                    onPress={onPress}
                                    key={index}
                                    onLongPress={onLongPress} >
                                    <View style={isFocused ? styles.activeButton : styles.buttonView} onLayout={event => onLayout(event)}>
                                        <Text style={isFocused ? styles.activeButtonText : styles.buttonText}>{label}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            );
                        })
                    }
                </ScrollView>
            </View>
        
        </View>
    );
}

const styles = StyleSheet.create({
    topContainer: {
        flexDirection: 'column'
    },
    yayin: {
        backgroundColor: '#d33',
        height: 41,
        marginBottom: 1,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    yayinText: {
        textAlign: 'center',
        fontSize: 13,
        color: '#fff'
    },
    container: {
        backgroundColor: '#2a7394',
        height: 42,
    },
    contentContainer: {
        height: 42,
    },
    buttonView: {
        height: 42,
        backgroundColor: '#2a7394',
        padding: 10
    },
    activeButton: {
        height: 42,
        backgroundColor: '#2a7394',
        padding: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#fff'
    },
    buttonText: {
        color: '#ffffff'
    },
    activeButtonText: {
        color: '#fed500'
    }
});
