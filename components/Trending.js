import React, {useState, useEffect} from 'react'
import { View, Text, SafeAreaView } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { VStack } from 'native-base';


export default function Trending() {

    const [shows, setShows] = useState([]);

    function getData(){
        let id = 'e9340061974538238c2dc83f40be9ca2201a2f3cc2e0c1f916e1f75c36416300';
        let secret = 'd08448ce43ce1111aea11a86e5c8c7625226f56005c69be8d0c9756b849a960b';
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
            for (item in data){
             return setShows(data[item])
            }
            console.log(shows);
        })
        .catch(console.error);
      }
    

      useEffect(()=>{
        getData();
      }, [shows])

      return (
          <SafeAreaView>
        <View>
          <Text>Open up App.js to start working on your app!</Text>
          <StatusBar style="auto" />
        </View>
        </SafeAreaView>
      );
}


function Cards(){


}