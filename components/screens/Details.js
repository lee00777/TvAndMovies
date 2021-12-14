import { ScrollView } from 'native-base';
import React, {useEffect, useState} from 'react'
import { View, Text, StyleSheet, Dimensions, Image} from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Button, Icon } from 'react-native-elements';

const width =  Dimensions.get('window').width;

export default function Details({navigation, route}) {
  //TODO: fix JSON Parse error: Unexpected EOF

  let {id} = route.params;

    const [img, setImg] = useState('');
    const [show, setShow] = useState([]);
    const [nextEpisode, setNextEpisode] = useState([]);

    function getDetails(showId){
        let id = 'e9340061974538238c2dc83f40be9ca2201a2f3cc2e0c1f916e1f75c36416300';
        let url = `https://api.trakt.tv/shows/${showId}?extended=full`;
    
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
            setShow(data);
            getImage(data['ids'].tmdb);
            getNextEpisode(data['ids'].trakt);
        })
        .catch((error) => {
            console.log(error)
        });
    }
    function getNextEpisode(showId){
        let id = 'e9340061974538238c2dc83f40be9ca2201a2f3cc2e0c1f916e1f75c36416300';
        let url = `https://api.trakt.tv/shows/${showId}/next_episode?extended=full`;
    
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
            setNextEpisode(data);
        })
        .catch((error) => {
            console.log(error)
        });
    }

    useEffect(()=>{
        getDetails(id);
    }, [id])

    function getImage(id){
        let api_key = 'a1b2f514b71b98f4fdeabd6fae26bd24';
        let url = `https://api.themoviedb.org/3/tv/${id}?api_key=${api_key}`;
        fetch(url)
          .then((resp)=>{
            if (!resp.ok) throw new Error(resp.statusText);
              return resp.json();
          })
          .then((data) => {
            return setImg(data.poster_path)
          })
          .catch(console.error);
        };
    let imgURL = `https://image.tmdb.org/t/p/w500${img}`;
    
    return (
        <SafeAreaProvider>
          <Button title="Back" titleStyle={{fontWeight: 'bold'}} onPress={()=> navigation.goBack()} icon={
            <Icon name='arrowleft' type='antdesign' size={25} color='white'/>
          } />
          <ScrollView style={styles.card}>
              <Image style={styles.image} source={{uri: imgURL}} />
              <View style={styles.overview}>
              <Text style={styles.overviewTitle} >Overview:</Text>
              <Text>{show.overview}</Text>
              </View>
              <Text>First air date: {new Date(show.first_aired).toLocaleDateString()}</Text>
              <Text>Network: {show.network} / {show.country}</Text>
              <Text>Current status: {show.status}</Text>
              <Text>Total Episodes: {show.aired_episodes}</Text>
              <View style={styles.nextEp}>
                  <Text>Next Episode</Text>
                  <Text>Title: {nextEpisode.title} </Text>
                  <Text>Next Episode: {new Date(nextEpisode.first_aired).toLocaleDateString()}</Text>
              </View>
          </ScrollView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    // card:{
    //   alignSelf:"flex-start",
    //   flexShrink: 1,
    //   width:(width/3)-20,
    // },
    image: {
      width:(width/2)-20,
      height:(width/1)-20,
      borderRadius:7,
      marginLeft: 10,
      marginTop:20,
      justifyContent: 'center'
    },
    overview: {
      
    },
    overviewTitle: {
        fontWeight: 'bold'
    },
})