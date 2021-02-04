import React, { useCallback, useEffect, useState} from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Dimensions, useWindowDimensions, TouchableOpacity, TextInput} from 'react-native';
import HTML from "react-native-render-html";
import Slider from '@react-native-community/slider';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import {useSetting} from "../hooks/use-setting";
import Advertisement from "./Advertisement";
import ItemList from "./ItemList";

const { width, height } = Dimensions.get('screen');

export default function SettingScreen(props) {

  const {apiURL, setLoading, setScrolling, setShareItem} = useSetting();
  const [news, setNews] = useState();
  const [yorumKontrol, setYorumKontrol] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [fontControl, setFontControl] = useState(false);
  const [otherNews, setOtherNews] = useState([]);
  const [haberID, setHaberID] = useState(null);

  const contentWidth = useWindowDimensions().width;

  const onChangeText = text => {

  }

  useEffect(() => {
    setHaberID(props?.id);
  }, [props])

  useFocusEffect(


    useCallback(() => {

    console.log(haberID);
      let isActive = true;
      setLoading(true);
      const fetchData = () => {
        axios.get(apiURL + 'haberdetay_restapi/detay?id=' + haberID)
        .then( response => {
          if(response.data.haber && isActive) {
            setShareItem(response.data.haber[0]);
            setNews(response.data.haber[0]);
            setOtherNews(response.data.digerhaberler);
            setLoading(false);
          }
        })
        .catch(error => console.log(error));
      };
  
      fetchData();
  
      return () => {
        isActive = false;
      };
    }, [haberID])
  );

  function convertBlobToBase64 (blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader;
      reader.onerror = reject;
      reader.onload = () => {
          resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    })
  }
  
  async function shareImage({ message, url }) {
    const r = await fetch(url)
    const blob = await r.blob();
    const base64image = await convertBlobToBase64(blob)
    console.log(base64image)
    return await Share.share({
      url: base64image,
      message
    });
  }

  const tepkiKoy = value => {
    axios.post('https://www.mygazete.com/wp-admin/admin-ajax.php', {
      action: 'tepki_ekle',
      post_id : props.id,
			tepkisi : value
    })
    .then( response => {
     
      
    })
    .catch(error => console.log(error));
  }

  const handleScroll = (event) => {
    const pos = event.nativeEvent.contentOffset.y;
    setScrolling(pos);
  }
  
  return (
    <View style={styles.container}>
      <ScrollView onScroll={handleScroll}>
        { !!news?.title &&<Advertisement advertisement="haber_ust"/> }
        {
        fontControl &&
          <View style={styles.fontConrolContainer}>
            <View style={styles.fontConrol}>
              <Text style={styles.fontControlTitle}>Metin Büyüklüğü</Text>
              <View style={styles.fontControlSlider}>
                <Text style={{fontSize: 13}}>aA</Text>
                <Slider
                  style={{width: width - 120}}
                  minimumValue={12}
                  maximumValue={24}
                  step={0.5}
                  minimumTrackTintColor="#555"
                  maximumTrackTintColor="#000"
                  onValueChange={value => setFontSize(value)}
                />
                <Text style={{fontSize: 16}}>aA</Text>
              </View>
              <TouchableOpacity style={styles.fontContolButton} onPress={() => setFontControl(false)}>
                <Text>Tamam</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        
        { !!news?.media && <Image source={{uri: news.media}} style={[styles.image, {height: width * news.mediaHeight / news.mediaWidth}]} resizeMode={'contain'}/> }
        {
          !!news?.title && 
          <View style={styles.textContainer}>
            <Text style={styles.title}>{news?.title}</Text>

          
            <View style={styles.dateContainer}>
              <Text style={styles.date}>{news?.date}</Text>
              <TouchableOpacity  style={styles.fontContainer} onPress={() => setFontControl(true)}>
                <Text style={[styles.fontButton, {fontSize: 16}]}>A</Text>
                <Text style={[styles.fontButton, {fontSize: 12, paddingTop: 19}]}>A</Text>
              </TouchableOpacity>
            </View>
      
            {
              !!news?.alt_baslik &&
              <Text style={[styles.text, {fontSize}]}>{news?.alt_baslik}</Text>
            }
                      
            {
              !!news?.content &&
              <HTML source={{ html: news?.content }}
                    baseFontStyle={{ fontFamily: "Roboto" }}
                    ignoredStyles={["font-family", "letter-spacing"]}
                    contentWidth={contentWidth - 40}
                    tagsStyles={{ p: { marginTop: 5, marginBottom: 5, fontSize, lineHeight: 20 }, iframe: {}, blockquote: { backgroundColor: "#f1f1f1", padding: 12, paddingBottom: 0, marginTop: 6 } }}/>
            }
          </View>
        }
        {
          !!news?.etiketler &&
            <View style={styles.etiketlerContainer}>
              {
                news.etiketler.map((item, i) => 
                  <Text key={i} style={styles.etiket}>{item.name}</Text>
                )
              }
            </View>
        }

        { !!news?.title && <Advertisement advertisement="haber_alt"/> }
        {!!news?.title && 
        <View style={{backgroundColor: '#fff', marginVertical: 10}}>
          {
            !!news?.title &&
            <View style={styles.yorumHeader}>
              <Text style={styles.yorumTitle}>Yorumlar</Text>
              <TouchableOpacity style={styles.yorumButton} onPress={() => setYorumKontrol(true)}>
                <Text style={styles.yorumText}>Yorum Yap</Text>
              </TouchableOpacity>
            </View>
          }

          {
            !news?.yorumlar &&
            <View style={{padding: 20}}>
              <Text>Bu habere ilk yorumu sen yap...</Text>
              </View>
          }

          {
            !!news?.yorumlar &&

            news?.yorumlar.map(yorum =>
              <View style={styles.yorumContainer}>
                <View style={styles.yorumRow}>
                  <Text style={styles.yorumName}>{yorum.yorum_yapan}</Text>
                  <Text style={styles.yorumTarih}>{yorum.yorum_tarih}</Text>
                </View>
                
                <HTML source={{ html: yorum.yorum_icerik }}
                      baseFontStyle={{ fontFamily: "Roboto" }}
                      ignoredStyles={["font-family", "letter-spacing", "width"]}
                      contentWidth={contentWidth - 40}
                      staticContentMaxWidth={contentWidth - 40}
                      imagesMaxWidth={contentWidth - 40}
                      debug = {true}
                      tagsStyles={{ p: { marginTop: 5, marginBottom: 5, fontSize, lineHeight: 20, display: 'none', color: 'red' }, figure: {display: 'none'}, figcaption: {display: 'none'},  iframe: {display: 'none'}, blockquote: { backgroundColor: "#f1f1f1", padding: 12, paddingBottom: 0, marginTop: 6 } }}/>

                <View style={styles.yorumBegeni}>
                  <TouchableOpacity style={[styles.yorumBegeniButton, {marginRight: 10}]}>
                    <Text>5</Text>
                    <Image style={styles.yorumBegenIcon} source={require('../assets/like.png')}/>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.yorumBegeniButton}>
                    <Text>5</Text>
                    <Image style={styles.yorumBegenIcon} source={require('../assets/dislike.png')}/>
                  </TouchableOpacity>
                </View>
              </View>
            )
          }
        </View>
      }
        { otherNews && <ItemList news={otherNews} navigation={props?.nav}/> }

        { !!news?.title  && <Advertisement advertisement="haber_resim_alt"/> }
      </ScrollView>
      {

        yorumKontrol && 

        <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.yorumYapContainer}>
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1, padding: 10, marginBottom: 10, zIndex: 20 }}
              onChangeText={text => onChangeText(text)}
              value={222}
              placeholder="İsim"
              placeholderTextColor="#444"
            />
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1, padding: 10, marginBottom: 10, zIndex: 20 }}
              onChangeText={text => onChangeText(text)}
              value={222}
              placeholder="Eposta"
              placeholderTextColor="#444"
            />

            <TextInput
              style={{ height: 90, borderColor: 'gray', borderWidth: 1, padding: 10, marginBottom: 10, zIndex: 20, justifyContent: "flex-start" }}
              onChangeText={text => onChangeText(text)}
              value={222}
              placeholder="Yorum"
              placeholderTextColor="#444"
              multiline={true}
              numberOfLines={4}
            />
            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
              <TouchableOpacity style={styles.yorumYapButton} onPress={() => setYorumKontrol(false)}>
                  <Text>İptal</Text>
                </TouchableOpacity>
              <TouchableOpacity style={styles.yorumYapButton} onPress={() => setYorumKontrol(false)}>
                  <Text>Tamam</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    


      }

    
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    width,
    flex: 1
  },
  footerContent: {
    height: height - 115,
    width,
    backgroundColor: '#000A',
    justifyContent: 'center',
    alignItems: 'center'
  },
  yorumYapContainer: {
    backgroundColor: '#fff',
    width: width - 60,
    padding: 30,
    zIndex: 40
  },
  yorumYapButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 10
  },
  etiketlerContainer: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  etiket: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: '#eee',
    margin: 3,
    borderRadius: 22
  },
  yorumBegeniButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  yorumBegeni: {
    flexDirection: 'row',
    alignItems:'flex-end',
    justifyContent: 'flex-end'
  },
  yorumBegenIcon: {
    width: 32,
    height: 32
  },
  yorumContainer: {
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 15
  },
  yorumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  yorumRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  yorumTitle: {
    fontSize: 21,
    padding: 3,
    fontWeight: 'bold'
  },
  yorumButton: {
    borderRadius: 5,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 7,
    backgroundColor: '#0086f7'
  },
  yorumText: {
    color: '#fff'
  },
  yorumTarih: {
    color: '#aaa',
    paddingTop: 5,
    paddingBottom: 10
  },
  yorumName: {
    fontSize: 16,
    fontWeight: 'bold'
  }, 
  tepkiler: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 20
  },
  tepki: {
    flex: 1,
    height: 60,
    alignItems: 'center'
  },
  tepkiIcon: {
    width: 30,
    height: 30,
    marginBottom: 10
  },
  fontConrolContainer: {
    backgroundColor: '#000A',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 5,
  },
  fontConrol: {
    backgroundColor: '#fff',
    width: width - 50,
    marginHorizontal: 25,
    padding: 15,
    marginTop: 200
  },
  fontControlTitle: {
    fontWeight: 'bold',
    width: width - 50,
    textAlign: 'center',
    fontSize: 16,
  },
  fontControlSlider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20
  }, 
  fontContolButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: width - 150
  },
  container: {
    flex: 1,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    width, 
    height: height - 115
  },
  image: {

    width,
    height: null,
    resizeMode: 'contain'
  },
  textContainer: {
    backgroundColor: '#fff',
    padding: 20,
    minHeight: 300
  },
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingBottom: 10,
    lineHeight: 21,
  },
  date: {
    fontSize: 12,
    color: '#777',
    paddingVertical: 15,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  fontContainer: {
    flexDirection: 'row',
  },
  fontButton: {
    paddingHorizontal: 3,
    paddingTop: 15,
    fontWeight: 'bold',
    color: '#0084f6',
    textAlign: 'right'
  },
  buttonContainer: {
    backgroundColor: '#fff',
    width,
    flexDirection: 'row',

    borderTopWidth: 1,
    borderTopColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: 'red',
    borderRadius: 25,
    height: 42,
    width: 42,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: 32,
    height: 32
  }

});