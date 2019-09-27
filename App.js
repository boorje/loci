import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import HomeScreen from './src/screens/homeScreen';
import ResultScreen from './src/screens/resultScreen';

// Modal
import SearchOptionsModal from './src/screens/searchOptionsModal';
import FavoritesModal from './src/screens/favoritesModal';

//Icon.loadFont();

const MainStack = createStackNavigator(
  {
    Home: {
      screen: ResultScreen,
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

const RootStack = createStackNavigator(
  {
    Main: {
      screen: MainStack,
    },
    SearchOptionsModal: {
      screen: SearchOptionsModal,
    },
    FavoritesModal: {
      screen: FavoritesModal,
    },
  },
  {
    //card or modal
    mode: 'card',
    headerMode: 'none',
  },
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
