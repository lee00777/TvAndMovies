import React, {useState, useEffect, useContext} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, FlatList, StyleSheet, Dimensions} from 'react-native'
import List from '../List';
//  app-loading & font
import * as Font from "expo-font";
import Apploading from "expo-app-loading";
import GlobalState from '../utils/globalContext.utils.';

const width =  Dimensions.get('window').width;

const getFont = () =>
Font.loadAsync({
  roboto: require("../../assets/fonts/Roboto-Medium.ttf"),
});

export default function Trending() {

  const {shows, setShows} = useContext(GlobalState);

  // const [shows, setShows] = useState([]);
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false);

  //tv shows data
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
      let results = data.map((item, index) => {
        return {...item.show, key: index + 10}
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
      <Text style={styles.header}>Trending Shows</Text>
      <FlatList 
        data={shows}
        numColumns={3}
        columnWrapperStyle={{flex:1, justifyContent:"space-around"}}
        renderItem={(item)=>( <List shows={item} />)}
        refreshing={isRefreshing}
        onRefresh={()=>{
          setIsRefreshing(true);
          getShows();
        }}
        on
        scrollEventThrottle={1}
        ListEmptyComponent={<Text> Loading ...</Text>}
        keyExtractor={item => item.key}
      />
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
    /> );
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
    fontFamily:"roboto",
    fontSize: 20,
    color:"#fff",
    textAlign:'left',
    marginLeft:15,
    paddingTop: 15
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