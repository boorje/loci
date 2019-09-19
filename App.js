import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import HomeScreen from './src/screens/homeScreen';
import ApiScreen from './src/screens/apiScreen';
import ResultScreen from './src/screens/resultScreen';

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
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
