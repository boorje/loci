import React from 'react';
import {Alert, Button, Text, SafeAreaView, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import ListOfPlaces from '../components/listOfPlaces';

export default class SearchOptionsModal extends React.Component {
  state = {
    savedPlaces: [],
  };

  componentDidMount = async () => {
    try {
      // AsyncStorage.clear();
      const saved = await AsyncStorage.getItem('FAVORITES');
      if (saved === null) {
        throw {errorMsg: 'You have not saved any places yet.'};
      }
      const savedPlaces = JSON.parse(saved);
      this.setState({savedPlaces: savedPlaces});
    } catch (error) {
      Alert.alert(
        'Oops',
        error.errorMsg
          ? error.errorMsg
          : "Something wen't wrong. Please try again",
      );
    }
  };

  showInfoFor = placeIndex => {
    this.props.navigation.navigate('Results', {
      placeInfo: this.state.savedPlaces[placeIndex],
      selectedType: 'FAVORITE',
    });
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Text style={{fontSize: 20, textAlign: 'center', marginBottom: 20}}>
          Your favorite places
        </Text>
        {this.state.savedPlaces.length > 0 && (
          <ListOfPlaces
            places={this.state.savedPlaces}
            navigateToPlace={index => this.showInfoFor(index)}
          />
        )}
        <Button onPress={() => this.props.navigation.goBack()} title="Back" />
      </SafeAreaView>
    );
  }
}
