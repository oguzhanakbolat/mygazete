import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback, Text} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {Drawer} from 'react-native-paper';
import {useSetting} from "../hooks/use-setting";

export function DrawerContent({menu}) {
    const {tabNav, nav} = useSetting();

    return (
        <DrawerContentScrollView {...menu}>
            <View style={styles.drawerContent}>
                <Drawer.Section style={styles.drawerSection}>

                    {
                        menu.map((item, i) =>
                            <TouchableWithoutFeedback key={i}
                                onPress={() => {
                                    nav.navigate('MainPages');
                                    setTimeout(() => {

                                        if(tabNav) {
                                            const event = tabNav.emit({
                                                type: 'tabPress',
                                                target: item.key,
                                                canPreventDefault: true,
                                            });
                
                                            if (!event?.defaultPrevented) {
                                                tabNav.navigate(item.name);
                                            }
                                        }
                                    }, 100)
                                }}>
                                <View style={styles.menuButton}>
                                    <Text style={styles.menuText}>{item.name}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    }
                    <TouchableWithoutFeedback
                        onPress={() => {
                            nav.navigate('Detail');
                        }}>
                        <View style={styles.menuButton}>
                            <Text style={styles.menuText}>Detay </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </Drawer.Section>
            </View>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  drawerSection: {
    paddingHorizontal: 12,
    flex: 1
  },
  menuButton: {
    paddingVertical: 10,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
  },
  menuText: {
      color: '#444'
  }
});