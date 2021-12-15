import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NativeBaseProvider, Box, Container, VStack } from 'native-base';
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
  const { getItem, setItem } = useAsyncStorage('objtest5');

  //handle storage functions
  const getStorageData = () => {
    getItem()
      .then((item) => {
        //get the value from AsyncStorage and save it in `value`
       item = item === null ? [] : JSON.parse(item);
       setFaves(item);
      //  console.log(item);
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
     setItem(JSON.stringify(faves))
     .then(()=>{
     })
     .catch((error) => console.log(error))
  }

  
  //add functions and data to userContext
  const globalData = {
    favorites: faves,
    shows: shows,
    faveData: faveData,
    setFaveData,
    setShows,
    removeData,
    addStorageData
  }

useEffect(() => {
  getStorageData();
  return ()=>{
    componentMounted.current = true
  }
}, [])

  return (
    <GlobalContext.Provider value={globalData}>
    <SafeAreaProvider>
      <NativeBaseProvider>
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
      </NativeBaseProvider>
    </SafeAreaProvider>
    </GlobalContext.Provider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
