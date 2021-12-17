import React, {useEffect, useState, useCallback} from 'react'
import { ScrollView, View, Text, StyleSheet, Dimensions, ActivityIndicator} from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Icon, Image } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import YoutubePlayer from "react-native-youtube-iframe";

const width =  Dimensions.get('window').width;

export default function Details({navigation, route}) {
  let {id} = route.params;
  const [img, setImg] = useState('');
  const [show, setShow] = useState([]);
  const [nextEpisode, setNextEpisode] = useState([]);
  const [playing, setPlaying] = useState(false);
  let imgURL = `https://${img}`;

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

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
        getNextEpisode(data['ids'].trakt);
        if (data['ids'].tmdb){
          getImage(data['ids'].tmdb);
        } else {
          setImg('via.placeholder.com/500x500?text=No+Image');
        }
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
        if(!data.poster_path || data.poster_path == null) {
          return setImg('via.placeholder.com/500x500?text=No+Image');
        } else{
          setImg(`image.tmdb.org/t/p/w500/${data.poster_path}`)
        }
      })
      .catch(console.error);
    };

  return (
    <SafeAreaProvider style={styles.safeArea}>
      <ScrollView>
        <View style={styles.card}>
          <View style={styles.container}>
            <Icon name='arrowleft' style={styles.backIcon} onPress={()=> navigation.goBack()}  type='antdesign' size={25} color='white' />
          </View>
          <View style={styles.listItem}>
              {
                img == "via.placeholder.com/500x500?text=No+Image" ? 
                <View style={styles.defaultImgWrapper}>
                    <Image title={show.title} PlaceholderContent={<ActivityIndicator size="large" color="black" />} style={styles.defaultImg} source={{uri: imgURL}} />
                </View>   
                :  
                <View style={styles.imgWrapper}>
                  <Image title={show.title} PlaceholderContent={<ActivityIndicator size="large" color="black" />} style={styles.image} source={{uri: imgURL}} />
                </View>
              }
            <View style={styles.about}>
              <Text style={styles.listItemHeader}>{show.title}</Text>
              <View style={{marginTop:15}}>
                <Text style={styles.basicInfoText}>Status: {show.status}</Text>
                <Text style={styles.basicInfoText}>First Air Date: {new Date(show.first_aired).toLocaleDateString()}</Text>
                <Text style={styles.basicInfoText}>Network: {show['network'] ? show['network'] : 'Not Available'} / {show.country ? show.country.toUpperCase() : show.country}</Text>
              </View>
            </View>
          </View>
          <View style={styles.overview}>
            <Text style={styles.details}>Details</Text>
            <Text style={styles.text} >{show.overview}</Text>
          </View>
          <View style={styles.episode}>
            <Text style={styles.details}>Episode</Text>
            <Text style={styles.basicInfoText}>Total Episodes: {show.aired_episodes}</Text>
            {
              show.airs &&
            <Text style={styles.basicInfoText}>Airs: {show.airs.day} @ {show.airs.time} ({show.airs['timezone'].replace('_', ' ')})</Text>
            }
            { nextEpisode ? <>
              <View>
                <Text style={styles.details}>Next Episode</Text>
                <Text style={styles.text}>Title: {nextEpisode.title ? nextEpisode.title : "Not Available"} </Text>
                <Text style={styles.text}>Date: {nextEpisode.first_aired ? new Date(nextEpisode.first_aired).toLocaleDateString() : "Not Available"}</Text>
              </View>
              </>
              :<> </>
            }
          </View>
          <View>
            {
              show.trailer && <View style={styles.trailer}> 
                <Text style={styles.details}>Trailer</Text>
                <View style={styles.video}>
                  <YoutubePlayer
                    height={200}
                    play={playing}
                    videoId={show.trailer.replace('https://youtube.com/watch?v=', '')}
                    onChangeState={onStateChange}
                  />
                </View>
              </View>
            }
          </View>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
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
  container: {
    flexDirection: "row",
    flex:1,
    marginTop:20,
    paddingLeft:10
  },
  title: {
    flex:3,
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  image:{
    width:200,
    height:200,
    borderRadius: 7,
    marginLeft:5,
    resizeMode:"contain",
  },
  defaultImg:{
    width:130,
    height:200,
    borderRadius: 7,
    marginLeft:5,
  },
  defaultImgWrapper:{
    flex:1.8, alignItems:"flex-end"
  },
  imgWrapper:{
    flex:1.8,
  },
  basicInfoText:{
    marginTop:15,
    color:"gray",
    fontSize:13
  },
  listItem:{
    flex:1,
    flexDirection:"row",
    color: 'white',
    paddingTop: 20,
    paddingBottom: 10,
  },
  about:{
    marginHorizontal:20,
    flex:2,
    justifyContent:"flex-start",
  },
  listItemHeader:{
    fontSize:20,
    marginTop:15,
    color:"white"
  },
  overview:{
    marginHorizontal:10,
    borderBottomColor:"gray",
    borderBottomWidth: 1,
    color: 'white',
    paddingBottom:20
  },
  details:{
    fontSize:18,
    color:"white",
    marginTop:15
  },
  episode:{
    marginHorizontal:10,
    borderBottomColor:"gray",
    borderBottomWidth: 1,
    paddingBottom:20
  },
  text:{
    marginTop:10,
    color:"gray"
  },
  trailer:{
    marginHorizontal:10,
  },
  video:{
    marginVertical:10,
    marginBottom:20
  }
})

