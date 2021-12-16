import React, {useState, useEffect,useRef, useContext} from 'react'
import { View, Text, SafeAreaView, StyleSheet, FlatList, Alert } from 'react-native'
import { Input } from 'react-native-elements';
import List from '../List';
import GlobalState from '../utils/globalContext.utils.';

export default function Search() {

  //TODO: fix spell checker
  // const {shows, setShows} = useContext(GlobalState);
  const [shows, setShows] = useState([]);
  const [recommended, setRecommended] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  function getRecommended(){
    let id = 'e9340061974538238c2dc83f40be9ca2201a2f3cc2e0c1f916e1f75c36416300';
    let url = 'https://api.trakt.tv/shows/recommended';
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
      setRecommended(results);
      setIsRefreshing(false);
      setLoading(false);
      setError("")
    })
    .catch((error) => {
      console.error;
      setIsRefreshing(false);
      setLoading(true);
      setError(err.message);
      setRecommended([])
    });
  }

  //tv shows data
  function getData(query){
    if(query.length == 0){
      console.log("없다 임마!!");
      Alert.alert(
        "No keyword",
        "Please enter a TV Show/Movie name",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
    }
      let id = 'e9340061974538238c2dc83f40be9ca2201a2f3cc2e0c1f916e1f75c36416300';
      let url = `https://api.trakt.tv/search/show?query=${query}`;
  
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
    
  useEffect(() => {
    getRecommended();
  }, [])
  return (
    <SafeAreaView style={styles.safeArea} edges={['right', 'bottom', 'left']}>
      <Text style={styles.header}>Find a TV Show</Text>
      <Input style={styles.input} placeholder="Enter a TV Show name" onChangeText={(value)=> setSearch(value) } 
      onSubmitEditing={()=> getData(search)}/>
        { shows.length == 0 ? 
            <> 
              <Text style={styles.subHeader}>Recommended</Text>
              <FlatList data={recommended} numColumns={3} columnWrapperStyle={{flex:1, justifyContent:"space-around"}}
              renderItem={(item)=>( <List shows={item} />)}/> 
            </> : 
          <FlatList 
            data={shows}
            numColumns={3}
            columnWrapperStyle={{flex:1, justifyContent:"space-around"}}
            renderItem={(item)=>( <List shows={item} />)}
          keyExtractor={item => item.key}
        />
        }
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
      fontSize: 20,
      color:"#fff",
      textAlign:'left',
      marginLeft:15,
      paddingTop: 15
    },
    subHeader:{
      fontSize: 15,
      color:"#fff",
      textAlign:'left',
      marginLeft:15,
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
    input:{
        color: 'white',
        marginLeft:5,
        fontSize:15
    },
    fadingContainer: {
        padding: 20,
      },
  })