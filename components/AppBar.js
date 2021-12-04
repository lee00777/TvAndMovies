import React from 'react';
import {
  Box,
  HStack,
  Center,
  Pressable,
} from 'native-base';
import { Text, StyleSheet, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function AppBar() {

  const [selected, setSelected] = React.useState(1);
  return (
      <Box flex={1} safeAreaTop  style={styles.navigation}>
        <Center flex={1}></Center>
        <HStack bg="primary.700" alignItems="center" safeAreaBottom shadow={6}>
          <Pressable
            opacity={selected === 0 ? 1 : 0.5}
            py="3"
            flex={1}
            onPress={() => setSelected(0)}>
            <Center>
            <Ionicons style={styles.icons} name={selected === 0 ? 'home' : 'home-outline'} />
              <Text>
                Home
              </Text>
            </Center>
          </Pressable>
          <Pressable
            opacity={selected === 1 ? 1 : 0.5}
            py="2"
            flex={1}
            onPress={() => setSelected(1)}
          >
            <Center>
            <Ionicons style={styles.icons} name={selected === 1 ? 'search' : 'search-outline'} />
              <Text>
                Search
              </Text>
            </Center>
          </Pressable>
          <Pressable
            opacity={selected === 2 ? 1 : 0.6}
            py="2"
            flex={1}
            onPress={() => setSelected(2)}
          >
            <Center>
            <Ionicons style={styles.icons} name={selected === 2 ? 'star' : 'star-outline'} />
              <Text>
                Favorites
              </Text>
            </Center>
          </Pressable>
          <Pressable
            opacity={selected === 3 ? 1 : 0.5}
            py="2"
            flex={1}
            onPress={() => setSelected(3)}
          >
            <Center>
            <Ionicons style={styles.icons} name={selected === 3 ? 'person' : 'person-outline'} />
              <Text>
                Account
              </Text>
            </Center>
          </Pressable>
        </HStack>
      </Box>
  );
}

const styles = StyleSheet.create({
    icons: {
        fontSize: 32,
        color: 'white'
    },
    navigation: {
      position: 'absolute',
      bottom: 0
    }
})
