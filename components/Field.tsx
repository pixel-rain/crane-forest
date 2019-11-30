import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../reducers/rootReducer';

export default function Field() {

    const dispatch = useDispatch();
    const notes = useSelector((state: State) => state.notes);
    const x = useSelector((state: State) => state.x);
    const y = useSelector((state: State) => state.y);
    const instrument = useSelector((state: State) => state.instrument);

    const instrumentColors = {violin: 'mediumpurple', flute: 'lime', contrabassoon: 'orangered'};

    let buttons = [];
    for (let i = 0; i < y; i++) {
      buttons.push([]);
      for (let j = 0; j < x; j++) {
        buttons[i].push(
          <TouchableWithoutFeedback
            onPress={() =>
              dispatch({ type: 'UPDATE_MELODY', payload: {yPos: i, xPos: j, instrumentToPlay: notes[i][j] === instrument ? 'none' : instrument} })
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

    return(
        <View style={styles.outerButtonBox}>
            <ScrollView persistentScrollbar={true /*despite typescrypt displays an error it works*/}>
                {buttons}
            </ScrollView>
        </View>
    );

}

const styles = StyleSheet.create({
    outerButtonBox: {
      borderWidth: 1,
      height: 458, 
    },
    key: {
      width: 40,
      height: 40,
      margin: -1, //to make their borders collapse
      borderWidth: 1
    },
    keyLine: {
      flexDirection: 'row'
    },
  });
