import React, {useState, useEffect,useRef, useContext} from 'react'
import { View, Text, SafeAreaView, StyleSheet, FlatList, Alert, Animated, KeyboardAvoidingView,Platform, TextInput, Keyboard, Button} from 'react-native'
import { Input, Icon } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
// search bar
import { Feather, Entypo,Ionicons } from "@expo/vector-icons";
import List from '../List';
// import { HeaderBackButton } from '@react-navigation/elements';
import { HeaderBackButton } from '@react-navigation/stack';

const navigationOptions = (navigation => {
  return{
    headerLeft:(<HeaderBackButton onPress={()=>{navigation.navigate('Favorites')}}/>)
 }
})

export default function Search({navigation}) {
  //TODO: fix spell checker
  const [shows, setShows] = useState([]);
  const [recommended, setRecommended] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const animation = useRef(new Animated.Value(0)).current;

  const [clicked, setClicked] = useState(false);

  // const navigationOptions = (navigation => {
  //   return{
  //     headerLeft:(<HeaderBackButton onPress={()=>{navigation.navigate('Favorites')}}/>)
  //  }
  // })

  const fadeIn = Animated.timing(animation, {
    toValue: 1,
    duration: 700,
    useNativeDriver: true,
  }).start();

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
      Alert.alert(
        "No keyword",
        "Please enter a TV Show/Movie name",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
      return; 
    }else{
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

  }
  useEffect(() => {
    getRecommended();
  }, [])

  return (
    <SafeAreaView style={styles.safeArea} edges={['right', 'bottom', 'left']}>
      <KeyboardAvoidingView enabled behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <Text style={[styles.header,{fontFamily:  Platform.OS === 'ios'? "sansProRegular" : "roboto"}]} > Find a TV Show</Text>
        {/* <Input style={styles.input} placeholder="Enter a TV Show name" onChangeText={(value)=> setSearch(value) } onSubmitEditing={()=> getData(search)}/> */}
        <View style={styles.container}>
          <View style={ !clicked ? styles.searchBar__unclicked : styles.searchBar__clicked}>
            {/* search Icon */}
            { clicked ? <Ionicons name="arrow-back-sharp" size={20} color="black" style={{ marginLeft: 1 }} onPress={()=>{
                Keyboard.dismiss();
                setClicked(false);
                setSearch('');
                setShows([]);
                navigation.navigate('Find');
            }} /> 
              : <Feather name="search" size={20} color="black" style={{ marginLeft: 1 }}/>}
            {/* Input field */}
            <TextInput style={styles.input} placeholder="Search" value={search} onChangeText={(value)=> {setClicked(true);
            setSearch(value)} }
              onSubmitEditing={()=> getData(search)} onFocus={() => {setClicked(true)}}/>
            {/* cross Icon, depending on whether the search bar is clicked or not */}
            {clicked && (<Entypo name="cross" size={26} color="black" style={{ padding: 1 }} 
              onPress={() => { setSearch(""); 
              Keyboard.dismiss();
              setClicked(false);
              navigation.navigate('Find');}}/>)}
          </View>
          {/* {clicked && (
            <View>
              <Button
                title="Cancel"
                onPress={() => {
                  Keyboard.dismiss();
                  setClicked(false);
                }}
              ></Button>
            </View>
          )} */}
        </View>

          { shows.length == 0 ? 
            <> 
              <Text style={styles.subHeader}>Recommended</Text>
              <Animated.View style={{opacity: animation}}>
                <FlatList data={recommended} numColumns={3} columnWrapperStyle={{flex:1, justifyContent:"space-around"}}
                renderItem={(item)=>( <List shows={item} />)}/> 
              </Animated.View>
            </> : 
              <Animated.View style={{opacity: animation}}>
                <FlatList 
                  data={shows}
                  numColumns={3}
                  columnWrapperStyle={{flex:1, justifyContent:"space-around"}}
                  renderItem={(item)=>( <List shows={item} />)}
                keyExtractor={item => item.key}/>
            </Animated.View>
          }
      </KeyboardAvoidingView>
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
    flex: 1,
    color: 'white',
    marginLeft:5,
    fontSize:15
  },
  fadingContainer: {
    padding: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
    paddingBottom: 10,
  },
  backIcon: {
    marginTop:20,
    marginLeft:10
  },
  container: {
    margin: 15,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",

  },
  searchBar__unclicked: {
    padding: 10,
    flexDirection: "row",
    width: "95%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
  },
  searchBar__clicked: {
    padding: 10,
    flexDirection: "row",
    width: "80%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  input: {
    fontSize: 20,
    marginLeft: 10,
    width: "90%",
  },
})
