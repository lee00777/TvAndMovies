import { ScrollView } from 'native-base';
import React, {useEffect, useState} from 'react'
import { View, Text, StyleSheet, Dimensions, ActivityIndicator} from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Button, Card, Header, Icon } from 'react-native-elements';

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
            getNextEpisode(show['ids'].trakt);
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
        <SafeAreaProvider style={styles.safeArea}>
          <ScrollView>
            <Card containerStyle={{fontFamily: 'roboto', borderRadius: 7}}>
              <Card.Title style={styles.title}>{show.title}</Card.Title>
              <Card.Image title={show.title} PlaceholderContent={<ActivityIndicator size="large" color="#00ff00" />} style={styles.image} source={{uri: imgURL}} />
              {/* <Text style={styles.title} >Overview</Text> */}
              <Text style={styles.text} >{show.overview}</Text>
              <Card.Divider/>
              <Text style={styles.text}>First air date: {new Date(show.first_aired).toLocaleDateString()}</Text>
              <Text style={styles.text}>Network: {show.network} / {show.country}</Text>
              <Text style={styles.text}>Current status: {show.status}</Text>
              <Text style={styles.text}>Total Episodes: {show.aired_episodes}</Text>
              <Card.Divider/>
              
              <View style={styles.nextEp}>
                {
                  console.log(nextEpisode),
                  nextEpisode ? <>
                  <Card.FeaturedTitle  style={styles.featTitle}>Next Episode</Card.FeaturedTitle>
                  <Text  style={styles.text}>Title: {nextEpisode.title ? nextEpisode.title : "Not Available"} </Text>
                  <Text  style={styles.text}>Date: {nextEpisode.first_aired ? new Date(nextEpisode.first_aired).toLocaleDateString() : "Not Available"}</Text>
                  </>
                  :
                  <>
                  </>
                }
            </View>
              <Card.Divider/>
              <Button title="Back" titleStyle={{fontWeight: 'bold'}} onPress={()=> navigation.goBack()} icon={
            <Icon name='arrowleft' type='antdesign' size={25} color='white'/>
          } />
              </Card>
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
  image:{
    borderRadius: 20,
    alignContent: 'center',
    width:(width/2)-20,
    height:(width)-20,
    marginBottom: 10
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
  },
  featTitle: {
    color: 'black',
    textAlign: 'center'
  },
  text: {
    textTransform: 'capitalize'
  }
})