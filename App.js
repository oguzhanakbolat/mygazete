import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import { enableScreens } from 'react-native-screens';

import {SettingContext} from "./hooks/use-setting";
import Header from "./components/Header";
import {DrawerContent} from "./components/DrawerContent";
import MainPages from './screens/MainScreen';
import DetailScreen from './screens/DetailScreen';
const Drawer = createDrawerNavigator();

enableScreens();

export default function App() {
  const [apiURL] = useState('http://mygazete.com/wp-json/');
  const [menuList, setMenuList] = useState([]);
  const [nav, setNav] = useState(null);
  const [screen, setScreen] = useState(null);
  const [tabNav, setTabNav] = useState(null);
  const [tabState, setTabState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scrolling, setScrolling] = useState(0);
  const [shareItem, setShareItem] = useState({id: 0, list: []});

  return (
    <>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" hidden={false}/>
      <SettingContext.Provider value={{ apiURL, shareItem, setShareItem, setMenuList, nav, setNav, tabNav, setTabNav, screen, setScreen,tabState, setTabState, loading, setLoading, scrolling, setScrolling }}>
        <Header/>
        <NavigationContainer>
          <Drawer.Navigator drawerContent={() => <DrawerContent menu={menuList} />} screenOptions={{headerShown: false, unmountOnBlur: true}}>
            <Drawer.Screen name="MainScreen" component={MainPages}/>
            <Drawer.Screen name="DetailScreen" component={DetailScreen}/>
          </Drawer.Navigator>
        </NavigationContainer>
      </SettingContext.Provider>
    </>
  );
}
