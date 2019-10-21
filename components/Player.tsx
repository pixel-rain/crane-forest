import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import { Audio } from 'expo-av';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../reducers/rootReducer';

export default function Player() {
  
  const dispatch = useDispatch();
  const notes = useSelector((state: State) => state.notes);
  const x = useSelector((state: State) => state.x);
  const y = useSelector((state: State) => state.y);

  const soundAssets = {
    violin_G3_05_forte: require('../assets/sounds/violin_G3_05_forte.mp3'),
    violin_A3_05_forte: require('../assets/sounds/violin_A3_05_forte.mp3'),
    violin_B3_05_forte: require('../assets/sounds/violin_B3_05_forte.mp3'),
    violin_C4_05_forte: require('../assets/sounds/violin_C4_05_forte.mp3'),
    violin_D4_05_forte: require('../assets/sounds/violin_D4_05_forte.mp3'),
    violin_E4_05_forte: require('../assets/sounds/violin_E4_05_forte.mp3'),
    violin_F4_05_forte: require('../assets/sounds/violin_F4_05_forte.mp3'),
    violin_G4_05_forte: require('../assets/sounds/violin_G4_05_forte.mp3'),
  }
  
  async function playSound(key: string) {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(soundAssets[key]);
      const status = await soundObject.playAsync();
      setTimeout(() => {
        soundObject.unloadAsync();
      }, status.playableDurationMillis); //despite typescrypt displays an error it works
    } 
    catch (error) {
      console.log(error.message)
    }
  }

  let buttons = [];

  for (let i = 0; i < y; i++) {
    buttons.push([]);
    for (let j = 0; j < x; j++) {
      buttons[i].push(
        <TouchableWithoutFeedback
          onPress={() =>
            dispatch({ type: 'UPDATE_MELODY', payload: {yPos: i, xPos: j, toPlay: notes[i][j] ? false : true} })
          }
          key={i + String(j) + "inner_key"}
        >
          <View
            style={{...styles.key, backgroundColor: notes[i][j] ? 'black' : 'white'}}
          ></View>
        </TouchableWithoutFeedback>
      );
    }
  }

  buttons = buttons.map((button, i) => <View style={styles.keyLine} key={i + "outer_key"}>{button}</View>);

  return (
    <View>
      <View>
        {buttons}
      </View>
      <TouchableHighlight 
        style={styles.controlButton} 
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
        <Text>Play</Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={styles.controlButton}
        onPress={() => dispatch({ type: 'CLEAR_MELODY', payload: {yPos: null, xPos: null, toPlay: null} })} 
      >
        <Text>Clear</Text>  
      </TouchableHighlight>
    </View>
  );
}
  
const styles = StyleSheet.create({
  key: {
    width: 40,
    height: 40,
    margin: -1,
    borderWidth: 1
  },
  keyLine: {
    flexDirection: 'row'
  },
  controlButton: {
    borderWidth: 1,
    padding: 4,
    paddingLeft: 8,
    paddingRight: 8,
    marginTop: 5
  },
});
  