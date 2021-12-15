import React, {useContext} from 'react'
import { View, Text, SafeAreaView, StyleSheet, FlatList } from 'react-native'
import GlobalContext from '../utils/globalContext.utils.';
import List from '../List';

export default function Favorites() {
    const {faveData} = useContext(GlobalContext);


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