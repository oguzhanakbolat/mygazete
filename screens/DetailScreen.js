import React, {useState, useEffect} from 'react';
import { StyleSheet, ActivityIndicator, View, Dimensions, FlatList } from 'react-native';
import DetailsItem from "../components/DetailsItem";
import {useSetting} from "../hooks/use-setting";

const { width } = Dimensions.get('screen');

export default function DetailScreen(props) {
  const [index, setIndex] = useState(0);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [items, setItems] = useState([]);
  const {loading, scrolling, setScrolling} = useSetting();

  useEffect(() => {
    const idIndex = (props.route.params.list).findIndex(x => x.id === props.route.params.id);
    setIndex(idIndex);
    setItems(props?.route?.params?.list);
  }, [props]);


  const handleScroll = (event) => {
    const pos = event.nativeEvent.contentOffset.x;
    setScrollIndex(Math.round(pos / width));
  }

  useEffect(() => {
    setScrolling(0);
  }, [])

  return (
    <View style={styles.container}>
      {
        items.length > 0 && 
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          renderItem={({ item }) => ( <DetailsItem id={item.id} nav={props?.navigation}/> )}
          horizontal
          pagingEnabled
          key={props?.route?.params?.key}
          onScroll={handleScroll}
          windowSize={1}
          snapToInterval={width}
          decelerationRate="fast"
          initialNumToRender={1}
          initialScrollIndex={index}
          maxToRenderPerBatch={1}
          lazy={true}
          getItemLayout={(data, index) => (
              {length: width, offset: width * index, index}
          )}
      />
      }
      {
        loading &&
        <View style={styles.containerLoading}><ActivityIndicator size="large" color="#0000ff" /></View>
      }

      {
        scrolling > 100 &&
        <View style={styles.circleContainer}>
          {
            items.map((item, i) =>
              <View style={scrollIndex === i ? styles.circleActive : styles.circle} key={item.id} />
            )
          }
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative'
    },
    containerLoading: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10,
      backgroundColor: '#0005',
      alignItems: 'center',
      justifyContent: 'center'
    },
    circleContainer: {
      width,
      height: 20,
      position: 'absolute',
      top: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: '#eee',
      zIndex: 10,
      paddingTop: 7
    },
    circleActive: {
        width: 7,
        height: 7,
        borderRadius: 5,
        backgroundColor: '#f00',
        marginLeft: 1
    },
    circle: {
        width: 7,
        height: 7,
        borderRadius: 5,
        backgroundColor: '#f005',
        marginLeft: 1
    }
});
