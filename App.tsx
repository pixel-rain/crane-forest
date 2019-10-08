import React from 'react';
import { StyleSheet, View } from 'react-native';
import Player from './components/Player';
import {Provider} from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers/rootReducer';

export default function App() {

  const store = createStore(rootReducer);

  return (
    <Provider store={store}>
      <View style={styles.container}>
        <Player />
      </View>
    </Provider>
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
