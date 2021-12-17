import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import Details from './components/screens/Details';
import Trending from './components/screens/Trending';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Favorites from './components/screens/Favorites';
import Search from './components/screens/Search';
import GlobalContext from './components/utils/globalContext.utils.';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();


export default function App() {

  const componentMounted = useRef(false)
  const [loading, setLoading] = useState(true);
  const [shows, setShows] = useState([]);
  const [faves, setFaves] = useState([]);
  const [faveData, setFaveData] = useState([]);
  const { getItem, setItem } = useAsyncStorage('FavrtShow');

  //handle storage functions
  const getStorageData = () => {
    getItem()
      .then((item) => {
        //get the value from AsyncStorage and save it in `value`
        item = item === null ? [] : JSON.parse(item);
        console.log(`data coming from storage ${item}`);
        setFaves(item);
        setLoading(false);
      })
      .catch(error => console.log(error));
  };

  const addStorageData = (newValue) => {
    //item in variable is an array
    setFaves((currentArr) => [newValue, ...currentArr]);
    //add the newValue to the array and overwrite it in AsyncStorage
    setItem(JSON.stringify([newValue, ...faves]))
      .catch(error => console.log(error));
  };

  const removeData = (value)=>{
    let newFaves = faves.filter(item => item != value)
      setFaves(newFaves);
      setItem(JSON.stringify(newFaves))
      .then(()=>{
      })
      .catch((error) => console.log(error))
  }

  //get FaveData
  function fetchFaveData(showId){
    let id = 'e9340061974538238c2dc83f40be9ca2201a2f3cc2e0c1f916e1f75c36416300';
    let url = `https://api.trakt.tv/shows/${showId}?extended`;

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
      let results = data;
      results.key = data['ids'].trakt;
      setFaveData((old)=> [results, ...old]);
    })
    .catch((error) => {
      console.log(error);

    });
    }
    const getFaveData = ()=>{
      faves.forEach(item => fetchFaveData(item))
  };
  //add functions and data to userContext
  const globalData = {
    setFaveData,
    setShows,
    removeData,
    addStorageData,
    favorites: faves,
    shows: shows,
    faveData: faveData,
  }

useEffect(() => {
  getStorageData();
  if(loading) return
  else {
    getFaveData();
  }
}, [loading])
  return (
    <GlobalContext.Provider value={globalData}>
      <SafeAreaProvider>
          <NavigationContainer>
            <Tab.Navigator initialRouteName='Home'>
              <Tab.Screen name="Home" component={Trending} options={{
                tabBarIcon: ({ focused, size, color }) => (<Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />)}} />
              <Tab.Screen name="Find" component={Search}  options={{
                tabBarIcon: ({ focused, size, color }) => (<Ionicons name={focused ? 'search' : 'search-outline'} size={size} color={color} />)}}/>
              <Tab.Screen name="Favorites" component={Favorites}  options={{
                tabBarIcon: ({ focused, size, color }) => (<Ionicons name={focused ? 'star' : 'star-outline'} size={size} color={color} />) }}/>
              <Tab.Screen name="Details" component={Details} options={{tabBarButton: () => null,
              tabBarVisible: false}} />
            </Tab.Navigator>
          </NavigationContainer>
      </SafeAreaProvider>
    </GlobalContext.Provider>
  );
}