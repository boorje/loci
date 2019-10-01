import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import HomeScreen from './src/screens/homeScreen';
import ResultScreen from './src/screens/resultScreen';

Icon.loadFont();

const MainStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Results: {
      screen: ResultScreen,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  },
);

const AppContainer = createAppContainer(MainStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
