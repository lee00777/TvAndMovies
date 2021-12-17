import React, {useState, useEffect,useRef, useContext} from 'react'
import { View, Text, SafeAreaView, StyleSheet, FlatList, Alert, Animated, KeyboardAvoidingView,Platform, TextInput, Keyboard, RefreshControl} from 'react-native'
import { Input, Icon } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { Feather, Entypo,Ionicons } from "@expo/vector-icons";
import List from '../List';

export default function Search({navigation}) {
  const [shows, setShows] = useState([]);
  const [recommended, setRecommended] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const animation = useRef(new Animated.Value(0)).current;
  const [clicked, setClicked] = useState(false);

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
        // console.log(results);
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
      <KeyboardAvoidingView enabled behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1, flexGrow: 1}}>
        <View style={styles.container}>
          <View style={ styles.searchBar}>
            { clicked ? <Ionicons name="arrow-back-sharp" size={22} color="black" style={{ marginLeft: 1 }} onPress={()=>{
                Keyboard.dismiss();
                setClicked(false);
                setSearch('');
                setShows([]);
                navigation.navigate('Find');
            }} /> 
              : <Feather name="search" size={22} color="black" style={{ marginLeft: 1 }}/>}
            <TextInput style={styles.input} autoCorrect={false} placeholder="Search" value={search} onChangeText={(value)=> {setClicked(true);
              setSearch(value)} }
              onSubmitEditing={()=> getData(search)} onFocus={() => {setClicked(true)}}/>
            {clicked && (<Entypo name="cross" size={22} color="black" style={{ padding: 1 }} 
              onPress={() => { setSearch("");
                Keyboard.dismiss();
                setClicked(false);
                navigation.navigate('Find');
              }}/>)}
          </View>
        </View>
          { shows.length == 0 ? 
          <View style={{flex: 1}}>
              <Text style={styles.subHeader}>Recommended</Text>
              <Animated.View style={{opacity: animation}}>
                <FlatList data={recommended} numColumns={3} columnWrapperStyle={{flex:1, flexGrow: 1, justifyContent:"space-around"}}
                renderItem={(item)=>( <List shows={item} />)}
                ListFooterComponent={<View style={{height: 30, marginBottom: 50}}/>}
                refreshControl={
                  <RefreshControl
                  colors={["ghostwhite", "#fff"]}
                  tintColor={"ghostwhite"}
                  refreshing={isRefreshing}
                  onRefresh={()=>{
                    setIsRefreshing(true);
                    setShows([]);
                    setSearch('');
                    setClicked(false);
                    getRecommended();
                }}
                  />
                }
                /> 
              </Animated.View>
              </View>: 
              <Animated.View style={{opacity: animation}}>
                <FlatList 
                  data={shows}
                  numColumns={3}
                  columnWrapperStyle={{flex:1, flexGrow: 1,justifyContent:"space-around", marginBottom: 30}}
                  renderItem={(item)=>( <List shows={item} />)}
                  refreshControl={
                    <RefreshControl
                    colors={["ghostwhite", "#fff"]}
                    tintColor={"ghostwhite"}
                    refreshing={isRefreshing}
                    onRefresh={()=>{
                      setIsRefreshing(true);
                      setShows([]);
                      setSearch('');
                      setClicked(false);
                      getRecommended();
                    }}
                    />
                  }
                keyExtractor={item => item.key}
                ListFooterComponent={<View style={{height: 30, marginBottom: 50}}/>}
                />
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
    flexGrow: 1,
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
    marginTop:5,
    color:"#fff",
    textAlign:'left',
    marginLeft:10,
  },
  loading:{
    color:"#000",
    textAlign:"center",
    fontSize:18,
    marginTop:50
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
    margin: 12,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: "97%",
  },
  searchBar: {
    padding: 10,
    marginTop:20,
    flexDirection: "row",
    width: "97%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  input: {
    flex: 1,
    width: "90%",
    marginLeft:5,
    fontSize:15
  },
})
