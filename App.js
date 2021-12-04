import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeBaseProvider, Box } from 'native-base';
import Trending from './components/Trending';
import AppBar from './components/AppBar';

export default function App() {
  return (
    <NativeBaseProvider>
    <Trending />
    <AppBar />
    </NativeBaseProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
