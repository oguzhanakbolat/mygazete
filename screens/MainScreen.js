import React, { useEffect, useState } from 'react';
import {createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import axios from 'axios';

import {useSetting} from "../hooks/use-setting";
import TabBar from '../components/TabBar';
import HomeScreen from "./HomeScreen"
import CategoryScreen from "./CategoryScreen"
import PageScreen from "./PageScreen"

const Tab = createMaterialTopTabNavigator();

export default function MainPage({navigation}) {
  const {setNav, apiURL} = useSetting();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setNav(navigation);
    getCategory();
  }, [navigation]); 

  const getCategory = () => {
    axios.get(apiURL + 'kategori_restapi/kategoriler')
    .then( response => {
      setCategories(response.data)
    })
    .catch(function (error) {
        console.log(error);
    });
  }

  return (
    <>
      <Tab.Navigator lazy={true}  tabBar={props => <TabBar {...props} />} >
        <Tab.Screen name="Guncel" component={HomeScreen} initialParams={{category: {
          kategori_adi: "Güncel",
          kategori_link: "/",
          kategori_tip: "category"}}}/>
        {
          categories &&
          categories.map((item, i) => 
          
              <Tab.Screen key={i} name={item.kategori_adi} component={CategoryScreen} initialParams={{category: item}}/>
        
          )
        }
      </Tab.Navigator>
    </>
  );
}
