import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {

  const soundAssets = {
    violin_A3_forte: require('./assets/sounds/violin_A3_forte.mp3'),
    violin_B3_forte: require('./assets/sounds/violin_B3_forte.mp3'),
    violin_C4_forte: require('./assets/sounds/violin_C4_forte.mp3'),
  }

  async function playSound(key: string) {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(soundAssets[key]);
      await soundObject.playAsync();
    } 
    catch (error) {
      console.log(error.message)
    }
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <TouchableHighlight style={styles.key} onPress={() => playSound('violin_A3_forte')}>
        <Text></Text>
      </TouchableHighlight>
      <TouchableHighlight style={styles.key} onPress={() => playSound('violin_B3_forte')}>
        <Text></Text>
      </TouchableHighlight>
      <TouchableHighlight style={styles.key} onPress={() => playSound('violin_C4_forte')}>
        <Text></Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  key: {
    width: 40,
    height: 40,
    backgroundColor: 'grey',
    margin: 2
  }
});
