import React, {useContext, useEffect, useRef} from 'react'
import { View, Text, SafeAreaView, StyleSheet, FlatList } from 'react-native'
import GlobalContext from '../utils/globalContext.utils.';
import List from '../List';

export default function Favorites() {
    const componentMounted = useRef(false)
    const {faveData, setFaveData,favorites} = useContext(GlobalContext);

    // console.log(favorites);

    const getFaveData = ()=>{
        favorites.forEach(item => fetchFaveData(item))
    };

    useEffect(() => {
        getFaveData();
        return ()=>{
          componentMounted.current = true
        }
      }, [])

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

    return (
        <SafeAreaView style={styles.safeArea} edges={['right', 'bottom', 'left']}>
               <Text style={styles.header}>Favorites</Text>
               <FlatList 
              data={faveData}
              numColumns={3}
              columnWrapperStyle={{flex:1, justifyContent:"space-around"}}
              renderItem={(item)=>( <List shows={item} />)}
            keyExtractor={item => item.key}
          />
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
        fontFamily:"roboto",
        fontSize: 20,
        color:"#fff",
        textAlign:'left',
        marginLeft:15,
        paddingTop: 15
      },
})