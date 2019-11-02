import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, TouchableWithoutFeedback, Picker } from 'react-native';
import { Audio } from 'expo-av';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../reducers/rootReducer';
import soundAssets from '../assets/sounds/soundAssets';

export default function Player() {
  
  const dispatch = useDispatch();
  const notes = useSelector((state: State) => state.notes);
  const x = useSelector((state: State) => state.x);
  const y = useSelector((state: State) => state.y);
  const instrument = useSelector((state: State) => state.instrument);
  
  const instrumentKeys = {
    violin: [
      'violin_G3_05_forte',
      'violin_A3_05_forte',
      'violin_B3_05_forte',
      'violin_C4_05_forte',
      'violin_D4_05_forte',
      'violin_E4_05_forte',
      'violin_F4_05_forte',
      'violin_G4_05_forte',
    ],
    flute: [
      'flute_G4_05_forte',
      'flute_A4_05_forte',
      'flute_B4_05_forte',
      'flute_C5_05_forte',
      'flute_D5_05_forte',
      'flute_E5_05_forte',
      'flute_F5_05_forte',
      'flute_G5_05_forte',      
    ],
    contrabassoon: [
      'contrabassoon_G2_05_mezzo_forte',
      'contrabassoon_A2_05_forte',
      'contrabassoon_B2_05_forte',
      'contrabassoon_C2_05_forte',
      'contrabassoon_D3_05_forte',
      'contrabassoon_E3_05_forte',
      'contrabassoon_F3_05_forte',
      'contrabassoon_G3_05_forte',
    ],
  };

  const instrumentColors = {violin: 'mediumpurple', flute: 'lime', contrabassoon: 'orangered'}

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
            dispatch({ type: 'UPDATE_MELODY', payload: {yPos: i, xPos: j, instrumentToPlay: notes[i][j] !== 'none' ? 'none' : instrument} })
          }
          key={i + String(j) + 'inner_key'}
        >
          <View
            style={{...styles.key, backgroundColor: notes[i][j] !== 'none' ? instrumentColors[notes[i][j]] : 'white'}}
          ></View>
        </TouchableWithoutFeedback>
      );
    }
  }

  buttons = buttons.map((button, i) => <View style={styles.keyLine} key={i + 'outer_key'}>{button}</View>);

  return (
    <View>
      <View>
        {buttons}
      </View>
      <TouchableHighlight 
        style={styles.controlButton} 
        onPress={() => {
          function runIteration(melody: string[][], delay: number) {
            let cnt = 0;
            let numTimes = melody.length;
            function next() {
              for (let i = 0; i < x; i++) {
                let currentInstrument = melody[cnt][i];
                if (currentInstrument !== 'none') {
                  playSound(instrumentKeys[currentInstrument][i]);
                }
              }
              cnt++;
              if (cnt < numTimes) {
                  setTimeout(next, delay);
              }
            }
            next();
          }
          const melody = notes.filter(line => line.some(el => el !== 'none'));
          runIteration(melody, 500);
        }}
      >
        <Text>Play</Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={styles.controlButton}
        onPress={() => dispatch({ type: 'CLEAR_MELODY', payload: {} })} 
      >
        <Text>Clear</Text>  
      </TouchableHighlight>
      <Picker
        selectedValue={instrument}
        onValueChange={value => dispatch({ type: 'CHANGE_INSTRUMENT', payload: {instrumentToSelect: value} })}
      >
        <Picker.Item label="Violin" value="violin" />
        <Picker.Item label="Flute" value="flute" />
        <Picker.Item label="Contrabassoon" value="contrabassoon" />
      </Picker>
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
  