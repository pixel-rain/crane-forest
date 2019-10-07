import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {

  const [notes, setNote] = useState({
    violin_G3_05_forte: false, 
    violin_A3_05_forte: false, 
    violin_B3_05_forte: false, 
    violin_C4_05_forte: false, 
    violin_D4_05_forte: false, 
    violin_E4_05_forte: false, 
    violin_F4_05_forte: false, 
    violin_G4_05_forte: false
  });

  const soundAssets = {
    violin_G3_05_forte: require('./assets/sounds/violin_G3_05_forte.mp3'),
    violin_A3_05_forte: require('./assets/sounds/violin_A3_05_forte.mp3'),
    violin_B3_05_forte: require('./assets/sounds/violin_B3_05_forte.mp3'),
    violin_C4_05_forte: require('./assets/sounds/violin_C4_05_forte.mp3'),
    violin_D4_05_forte: require('./assets/sounds/violin_D4_05_forte.mp3'),
    violin_E4_05_forte: require('./assets/sounds/violin_E4_05_forte.mp3'),
    violin_F4_05_forte: require('./assets/sounds/violin_F4_05_forte.mp3'),
    violin_G4_05_forte: require('./assets/sounds/violin_G4_05_forte.mp3'),
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

  const buttons = [
    'violin_G3_05_forte', 
    'violin_A3_05_forte', 
    'violin_B3_05_forte', 
    'violin_C4_05_forte', 
    'violin_D4_05_forte', 
    'violin_E4_05_forte', 
    'violin_F4_05_forte', 
    'violin_G4_05_forte'
  ].map(i => 
    <TouchableHighlight 
      style={{...styles.key, backgroundColor: notes[i] ? 'black' : 'white'}}
      onPress={() => 
        notes[i] ? setNote(prevState => {return {...prevState, [i]: false}}) : setNote(prevState => {return {...prevState, [i]: true}})
      }
      underlayColor={notes[i] ? "white" : "black"}
      key={i}
    >
      <Text></Text>
    </TouchableHighlight>
  );

  return (
    <View style={styles.container}>
      <View style={styles.keyBox}>
        {buttons}
      </View>
      <TouchableHighlight 
        style={styles.playButton} 
        onPress={() => {
          function runIteration(keys: string[], delay: number) {
            let cnt = 0;
            let numTimes = keys.length;
            function next() {
              if (notes[keys[cnt]]) {
                playSound(keys[cnt]);
              }
              cnt++;
              if (cnt < numTimes) {
                  setTimeout(next, delay);
              }
            }
            next();
          }
          const keys = Object.keys(notes).filter(note => notes[note]);
          runIteration(keys, 500);
        }}
      >
        <Text>Play!</Text>
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
    margin: 2,
    borderWidth: 1
  },
  keyBox: {
    flexDirection: 'row'
  },
  playButton: {
    borderWidth: 1,
    padding: 4,
    paddingLeft: 8,
    paddingRight: 8,
    marginTop: 5
  }
});
