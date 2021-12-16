
import { View, Text, SafeAreaView, StyleSheet, FlatList, Platform, Animated} from 'react-native'
import React, {useState, useEffect, useContext, useRef} from 'react'
import GlobalContext from '../utils/globalContext.utils.';
import List from '../List';
import * as StoreReview from 'expo-store-review';
import { StatusBar } from 'expo-status-bar';

export default function Favorites() {
  const {faveData, favorites} = useContext(GlobalContext);
  const animation = useRef(new Animated.Value(0)).current;
  const fadeIn = Animated.timing(animation, {
    toValue: 1,
    duration: 700,
    useNativeDriver: true,
  }).start();

  useEffect(() => {
    if(favorites.length === 3){
      StoreReview.requestReview()
    }
  }, [favorites])

  return (
    <SafeAreaView style={styles.safeArea} edges={['right', 'bottom', 'left']}>
      <Text style={styles.header}>Favorites</Text>
      <Animated.View style={{opacity: animation}}>
        <FlatList 
          data={faveData}
          numColumns={3}
          columnWrapperStyle={{flex:1, justifyContent:"space-around"}}
          renderItem={(item)=>( <List shows={item} />)}
          ListEmptyComponent={<Text style={styles.noFavItemMsg}> No Favorite Item </Text>}
          keyExtractor={item => item.key}
        />
      </Animated.View>
      <StatusBar style="auto" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea:{
    flex: 1,  
    resizeMode: 'center', 
    backgroundColor:'#202124',
    justifyContent: 'flex-start',
  },
  header:{
    fontFamily:"roboto",
    fontSize: 20,
    color:"#fff",
    textAlign:'left',
    marginLeft:15,
    paddingTop: 15
  },
  noFavItemMsg:{
    color:"#fff",
    fontSize: 18,
    textAlign:'center',
    marginTop:100
  }
})
