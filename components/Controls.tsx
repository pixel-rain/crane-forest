import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, TouchableWithoutFeedback, Picker } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../reducers/rootReducer';
import { Audio } from 'expo-av';
import soundAssets from '../assets/sounds/soundAssets';

export default function Controls() {

    const dispatch = useDispatch();
    const notes = useSelector((state: State) => state.notes);
    const x = useSelector((state: State) => state.x);
    const y = useSelector((state: State) => state.y);
    const instrument = useSelector((state: State) => state.instrument);
    const randomInstruments = useSelector((state: State) => state.random_instruments);
  
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
  
    const instrumentColors = {violin: 'mediumpurple', flute: 'lime', contrabassoon: 'orangered'};

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

    function composeRandomMuelody() { //a simple random music generation with random seeding and some cellular automata
        function gameOfLife(field: string[][], times: number) {
            for (let t = 0; t < times; t++) {
                for (let i = 0; i < y; i++) {
                    for (let j = 0; j < x; j++) {
                        let neighbors = 0;
                        if (i - 1 >= 0 && j - 1 >= 0 && field[i - 1][j - 1] !== "none") neighbors++;
                        if (i + 1 < y && j - 1 >= 0 && field[i + 1][j - 1] !== "none") neighbors++;
                        if (i - 1 >= 0 && j + 1 < x && field[i - 1][j + 1] !== "none") neighbors++;
                        if (i - 1 >= 0 && field[i - 1][j] !== "none") neighbors++;
                        if (i + 1 < y && field[i + 1][j] !== "none") neighbors++;
                        if (j - 1 >= 0 && field[i][j - 1] !== "none") neighbors++;
                        if (j + 1 < x && field[i][j + 1] !== "none") neighbors++;
                        if (i + 1 < y && j + 1 < x && field[i + 1][j + 1] !== "none") neighbors++;
                        if (field[i][j] !== "none") {
                            if (neighbors < 2 || neighbors > 3) {
                                field[i][j] = "none";
                            }
                        }
                        else if (neighbors === 3) {
                            field[i][j] = instruments[Math.floor(Math.random() * instruments.length)];	
                        }
                    }
                }
            }
            return field;
        }
        const instruments = Object.keys(randomInstruments).filter(i => randomInstruments[i]);
        if (instruments.length === 0) return;
        const field = [];
        for (let i = 0; i < y; i++) {
            const temp = [];
            for (let j = 0; j < x; j++) {
                if (Math.floor(Math.random() * 3) === 1) {
                    temp.push(instruments[Math.floor(Math.random() * instruments.length)]);
                }
                else {
                    temp.push("none");
                }
            }
            field.push(temp);
        }
        dispatch({ type: 'RANDOM_MELODY', payload: {newNotes: gameOfLife([...field], 3)} })
    }

    return (
        <View>
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
            <View style={styles.randomRow}>
                <TouchableHighlight
                style={styles.controlButton}
                onPress={() => composeRandomMuelody()} 
                >
                <Text>Random Melody</Text>  
                </TouchableHighlight>
                <TouchableWithoutFeedback
                onPress={() =>
                    dispatch({ type: 'SELECT_INSTRUMENT_FOR_RANDOM_MELODY', payload: {randomInstrumentToChange: 'violin'} })
                }
                >
                <View
                    style={{...styles.tempRandomKey, backgroundColor: randomInstruments['violin'] ? instrumentColors['violin'] : 'white'}}
                ></View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                onPress={() =>
                    dispatch({ type: 'SELECT_INSTRUMENT_FOR_RANDOM_MELODY', payload: {randomInstrumentToChange: 'flute'} })
                }
                >
                <View
                    style={{...styles.tempRandomKey, backgroundColor: randomInstruments['flute'] ? instrumentColors['flute'] : 'white'}}
                ></View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                onPress={() =>
                    dispatch({ type: 'SELECT_INSTRUMENT_FOR_RANDOM_MELODY', payload: {randomInstrumentToChange: 'contrabassoon'} })
                }
                >
                <View
                    style={{...styles.tempRandomKey, backgroundColor: randomInstruments['contrabassoon'] ? instrumentColors['contrabassoon'] : 'white'}}
                ></View>
                </TouchableWithoutFeedback>
            </View>
            <View style={styles.picker}>
                <Picker
                style={styles.pickerItem}
                selectedValue={instrument}
                onValueChange={value => dispatch({ type: 'CHANGE_INSTRUMENT', payload: {instrumentToSelect: value} })}
                >
                <Picker.Item label="Violin" value="violin" />
                <Picker.Item label="Flute" value="flute" />
                <Picker.Item label="Contrabassoon" value="contrabassoon" />
                </Picker>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    controlButton: {
      borderWidth: 1,
      padding: 4,
      paddingLeft: 8,
      paddingRight: 8,
      marginTop: 5,
    },
    picker: {
      borderWidth: 1,
      marginTop: 5,
    },
    pickerItem: {
      height: 25,
    },
    randomRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    tempRandomKey: { //a temporary layout
      borderWidth: 1,
      width: 44,
      height: 29,
      marginLeft: 7,
    },
    tempPurple: {
      backgroundColor: 'mediumpurple',
    },
    tempLime: {
      backgroundColor: 'lime',
    },
    tempRed: {
      backgroundColor: 'orangered',
    },
  });  
