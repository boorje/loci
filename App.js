import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/FontAwesome';

import HomeScreen from './src/screens/homeScreen';
import ApiScreen from './src/screens/apiScreen';
import ResultScreen from './src/screens/resultScreen';

Icon.loadFont();

const AppNavigator = createStackNavigator({
  Home: {
    screen: ResultScreen,
  },
  Api: {
    screen: ApiScreen,
  },
  Results: {
    screen: ResultScreen,
  },
});

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
