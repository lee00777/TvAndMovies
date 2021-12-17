import React, {useState, useEffect, useContext, useRef} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Animated, Text, FlatList, StyleSheet, Platform, RefreshControl} from 'react-native'
import List from '../List';
import * as Font from "expo-font";
import Apploading from "expo-app-loading";
import GlobalState from '../utils/globalContext.utils.';
import { StatusBar } from 'expo-status-bar';

async function getFont(){
  await Font.loadAsync({
    roboto: require("../../assets/fonts/Roboto-Medium.ttf"),
    sansProLight: require("../../assets/fonts/SourceSansPro-Light.ttf"),
    sansProRegular: require("../../assets/fonts/SourceSansPro-Regular.ttf"),
  });
} 

export default function Trending() {
  const {shows, setShows} = useContext(GlobalState);
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const fadeIn = Animated.timing(animation, {
    toValue: 1,
    duration: 700,
    useNativeDriver: true,
  }).start();

  function getShows(){
    let id = 'e9340061974538238c2dc83f40be9ca2201a2f3cc2e0c1f916e1f75c36416300';
    let url = 'https://api.trakt.tv/shows/trending';
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "trakt-api-key": id,
        'trakt-api-version': '2'
      }
    })
    .then((resp)=>{
      if (!resp.ok) throw new Error(resp.statusText);
        return resp.json();
    })
    .then((data) => {
      let results = data.map((item) => {
        return {...item.show, key: item.show['ids'].trakt}
      });
      setShows(results);
      setIsRefreshing(false);
      setLoading(false);
      setError("")
    })
    .catch((error) => {
      console.error;
      setIsRefreshing(false);
      setLoading(true);
      setError(err.message);
      setShows([])
    });
  }

  useEffect(()=>{
    getShows();
  }, [])

  if (isFontLoaded) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['right', 'bottom', 'left']}>
        <Text style={[styles.header,{fontFamily:  Platform.OS === 'ios'? "sansProRegular" : "roboto"}]} >Trending Shows</Text>
        <Animated.View style={{opacity: animation, flex: 1, flexGrow: 1}}>
          <FlatList 
            data={shows}
            numColumns={3}
            columnWrapperStyle={{flex:1, justifyContent:"space-around"}}
            renderItem={(item)=>( <List shows={item} />)}
            refreshControl={<RefreshControl
              colors={["black", "ghostwhite"]}
              tintColor={"ghostwhite"}
              refreshing={isRefreshing}
              progressBackgroundColor={'#fff'}
              onRefresh={()=>{
                setIsRefreshing(true);
                getShows();
              }}/>}
            onscrollEventThrottle={1}
            ListEmptyComponent={<Text> Loading ...</Text>}
            keyExtractor={item => item.key}
            ListFooterComponent={<View style={{height: 30, marginBottom: 50}}/>}
          />
        </Animated.View>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  } else {
    return (
      <Apploading
        startAsync={getFont}
        onFinish={() => {
          setIsFontLoaded(true);
        }}
        onError={console.warn}
      /> 
    );
  }
}

const styles = StyleSheet.create({
  safeArea:{
    flex: 1,  
    resizeMode: 'center', 
    backgroundColor:'#202124',
    justifyContent: 'flex-start',
  },
  header:{
    fontSize: 20,
    color:"#fff",
    textAlign:'left',
    marginLeft:10,
    paddingTop: 15
  },
  subHeader:{
    fontSize: 15,
    color:"#fff",
    textAlign:'left',
    marginLeft:10,
    marginTop:10,
  },
  briefInfo:{
    flexWrap:"wrap",
    flexDirection:"row",
  },
  loading:{
    color:"#000",
    textAlign:"center",
    fontSize:18,
    marginTop:50
  },
})