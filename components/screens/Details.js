import { ScrollView } from 'native-base';
import React, {useEffect, useState} from 'react'
import { View, Text, StyleSheet, Dimensions, ActivityIndicator} from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Button, Card, Header, Icon, Image } from 'react-native-elements';

const width =  Dimensions.get('window').width;
const height =  Dimensions.get('window').height;

export default function Details({navigation, route}) {
  let {id} = route.params;
  const [img, setImg] = useState('');
  const [show, setShow] = useState([]);
  const [nextEpisode, setNextEpisode] = useState([]);
  let imgURL = `https://image.tmdb.org/t/p/w500/${img}`;

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
      console.log(data);
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

  return (
    <SafeAreaProvider style={styles.safeArea}>
      <ScrollView>
        <View style={styles.card}>
          <Text style={styles.title}>{show.title}</Text>
          <Image title={show.title} PlaceholderContent={<ActivityIndicator size="large" color="#00ff00" />} style={styles.image} source={{uri: imgURL}} />
          {/* <Text style={styles.title} >Overview</Text> */}
          <Text style={styles.text} >{show.overview}</Text>
          <View style={styles.basicInfo}>
          <Text style={styles.basicInfoText}>First air date: {new Date(show.first_aired).toLocaleDateString()}</Text>
          <Text style={styles.basicInfoText}>Network: {show.network} / {show.country}</Text>
          <Text style={styles.basicInfoText}>Current status: {show.status}</Text>
          <Text style={styles.basicInfoText}>Total Episodes: {show.aired_episodes}</Text>
          </View>
          
          <View style={styles.nextEp}>
            { nextEpisode ? <>
              <Text style={styles.featTitle}>Next Episode</Text>
              <Text style={styles.text}>Title: {nextEpisode.title ? nextEpisode.title : "Not Available"} </Text>
              <Text style={styles.text}>Date: {nextEpisode.first_aired ? new Date(nextEpisode.first_aired).toLocaleDateString() : "Not Available"}</Text>
              </>
              :<> </>
            }
        </View>
          <Button title="Back" titleStyle={{fontWeight: 'bold'}} onPress={()=> navigation.goBack()} icon={
          <Icon name='arrowleft' type='antdesign' size={25} color='white'/>} />
        </View>
      </ScrollView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  safeArea:{
    flex: 1,  
    resizeMode: 'center', 
    backgroundColor:'#202124',
    justifyContent: 'flex-start',
  },
  card:{
    borderRadius: 7,
    margin: 5
  },
  image:{
    borderRadius: 20,
    alignSelf: 'center',
    width:(width/2)-20,
    height:(width)-20,
    margin: 10
  },
  nextEp: {
    marginVertical: 5,
  },
  title: {
    margin: 10,
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
  featTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  basicInfo: {
    margin: 5,
  },
  basicInfoText:{
    color: '#fff',
    textTransform: 'capitalize'
  },
  text: {
    color: '#fff',
    textAlign: 'justify',
    padding: 5
  }
})