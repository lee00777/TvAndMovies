import React, {useState, useEffect} from 'react'
import { View, SafeAreaView, FlatList, StatusBar, StyleSheet, Image } from 'react-native'
import { Box, Text, AspectRatio, Stack, Heading, ScrollView} from 'native-base';


export default function Trending() {

    const [shows, setShows] = useState([]);

//tv shows data
    function getData(){
        let id = 'e9340061974538238c2dc83f40be9ca2201a2f3cc2e0c1f916e1f75c36416300';
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
            let results = data.map((item, index) => {
                return {...item.show, key: index + 10}
            });
           setShows(results);
        })
        .catch(console.error);
      }



      useEffect(()=>{
        getData();
      }, [])

      return (
        <SafeAreaView>
            <Text style={styles.header} >TRENDING</Text>
       <FlatList 
       data={shows}
       renderItem={(item)=>(
           <Shows shows={item} />
       )}
       ListEmptyComponent={<Text>No Data. Such Sad.</Text>}
       keyExtractor={item => item.key}
       />
       </SafeAreaView>
      );
}


function Shows({shows}){
    //data coming from "shows"
// title = shows.item['title']
//year = shows.item['year']
// ids =  shows.item['ids'] (imdb / slug / tmdb / trakt)

//images / fetching data from TMDB
//tmdb = a1b2f514b71b98f4fdeabd6fae26bd24
//IMG_URL: 'https://image.tmdb.org/t/p/'
//img = APP.IMG_URL + 'w500' + obj.poster_path;

const [img, setImg] = useState('');

let path;
function getDetails(id){
    let api_key = 'a1b2f514b71b98f4fdeabd6fae26bd24';
    let url = `https://api.themoviedb.org/3/tv/${id}?api_key=${api_key}`;
    fetch(url)
      .then((resp)=>{
        if (!resp.ok) throw new Error(resp.statusText);
          return resp.json();
      })
      .then((data) => {
        //   console.log(data.backdrop_path)
       return setImg(data.poster_path)
      })
      .catch(console.error);
    }
    getDetails(shows.item['ids'].tmdb);

let imgURL = `https://image.tmdb.org/t/p/w500${img}`;

    return (
        <Box maxW="80"
        style={styles.list}
        rounded="lg"
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth="1"
        _dark={{
          borderColor: "coolGray.600",
          backgroundColor: "gray.700",
        }}
        _web={{
          shadow: 2,
          borderWidth: 0,
        }}
        _light={{
          backgroundColor: "gray.50",
        }}
      >
          <Box>
        <Stack p='1.5' space={3}>
        <Image style={styles.image} source={{
            uri: imgURL
        }} />

        <Heading size="xs" ml="-1">
       { shows.item['title']}
          </Heading>
        {/* </AspectRatio> */}
        <Text
            fontSize="xs"
            _light={{
              color: "primary.900",
            }}
            _dark={{
              color: "primary.500",
            }}
            fontWeight="500"
            ml="-0.5"
            mt="-1"
          >
                { shows.item['year']}
          </Text>
        </Stack>
        </Box>
        </Box>
    )

}

const styles = StyleSheet.create({
    header:{
        fontSize: 32,
        fontWeight: 'bold',
       textAlign:'center',
       paddingVertical: 20
    },
    list: {
        paddingHorizontal: 10,
        marginLeft: 10
    },
    image: {
        width: 100,
        height: 100
    }
})