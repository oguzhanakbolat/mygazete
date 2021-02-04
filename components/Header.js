import React from 'react';
import { StyleSheet, Image, View, TouchableOpacity, Dimensions, Share } from 'react-native';
import * as Sharing from 'expo-sharing';
import { DrawerActions } from '@react-navigation/native';
import {useSetting} from "../hooks/use-setting";

const window = Dimensions.get('screen');

export default function Header() {
    const {nav, screen, setScreen, tabNav, shareItem} = useSetting();

    const back = () => {
      setScreen('MainScreen');
      nav.navigate('MainScreen');
      tabNav.navigate('Guncel');
    }
    const iletisim = () => {
      setScreen('MainScreen');
      nav.navigate('MainScreen');
      tabNav.navigate('İletişim');
    }
    const onShare = async () => {
  
      Share.share(
        {
          title: 'test title',
          url: shareItem.media,
        },
        {
          excludedActivityTypes: [
            'com.apple.UIKit.activity.PostToWeibo',
'com.apple.UIKit.activity.Print',
'com.apple.UIKit.activity.CopyToPasteboard',
'com.apple.UIKit.activity.AssignToContact',
'com.apple.UIKit.activity.SaveToCameraRoll',
'com.apple.UIKit.activity.AddToReadingList',
'com.apple.UIKit.activity.PostToFlickr',
'com.apple.UIKit.activity.PostToVimeo',
'com.apple.UIKit.activity.PostToTencentWeibo',
'com.apple.UIKit.activity.AirDrop',
'com.apple.UIKit.activity.OpenInIBooks',
'com.apple.UIKit.activity.MarkupAsPDF',
'com.apple.reminders.RemindersEditorExtension',
'com.apple.mobilenotes.SharingExtension',
'com.apple.mobileslideshow.StreamShareService',
'com.linkedin.LinkedIn.ShareExtension',
'pinterest.ShareExtension',
'com.google.GooglePlus.ShareExtension',
'com.tumblr.tumblr.Share-With-Tumblr',
'net.whatsapp.WhatsApp.ShareExtension'
          ],
        }
      );
    };


    return (
        <View style={styles.menuContainer}>
          {
            screen === 'DetailScreen' &&
            <TouchableOpacity onPress={back}>
              <Image style={styles.backIcons} source={require('../assets/arrow.png')}/>
            </TouchableOpacity>
          }
          {
            screen !== 'DetailScreen' &&
            <TouchableOpacity onPress={() => nav.dispatch(DrawerActions.toggleDrawer())}>
              <Image style={styles.menuIcons} source={require('../assets/menu.png')}/>
            </TouchableOpacity>
          }

          <TouchableOpacity onPress={back}>
            <View style={styles.menuLogoContainer}>
                <Image style={styles.menuLogo} source={require('../assets/logo.png')}/>
            </View>
          </TouchableOpacity>

          {
            screen !== 'DetailScreen' &&
            <TouchableOpacity onPress={iletisim}>
              <Image style={styles.menuIcons} source={require('../assets/mail.png')}/>
            </TouchableOpacity>
          }

          {
            screen === 'DetailScreen' &&
            <TouchableOpacity onPress={onShare}>
              <Image style={styles.menuIcons} source={require('../assets/share.png')}/>
            </TouchableOpacity>
          }
        </View>
    );
}

const styles = StyleSheet.create({
  menuContainer: {
    height: 46,
    backgroundColor: '#fff',
    marginTop: 35,
    padding: 5,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  menuLogoContainer: {
    width: window.width - 82,
    justifyContent: 'center',
    alignItems: 'center'
  },
  menuLogo: {
    height: 36,
    width: 100
  },
  menuIcons:   {
    width: 36,
    height: 36,
  },
  backIcons:   {
    width: 36,
    height: 36,
  }
});
