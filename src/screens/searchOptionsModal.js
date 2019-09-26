import React from 'react';
import {Alert, Button, Text, SafeAreaView, View} from 'react-native';

import ListOfPlaces from '../components/listOfPlaces';

import searchTextPlaces from '../helpers/googleAPI/searchTextPlaces';

export default class SearchOptionsModal extends React.Component {
  state = {
    foundPlaces: [],
  };

  componentDidMount = async () => {
    try {
      const searchText = this.props.navigation.getParam('searchText', null);
      const foundPlaces = await searchTextPlaces(searchText);
      if (foundPlaces.length < 1) {
        throw `Found no matches`;
      }
      this.setState({foundPlaces});
    } catch (error) {
      Alert.alert(error, 'Please try again.', [
        {text: 'Search again', onPress: () => this.props.navigation.goBack()},
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ]);
    }
  };

  showInfoFor = placeIndex => {
    this.props.navigation.navigate('Results', {
      placeInfo: this.state.foundPlaces[placeIndex],
      selectedType: 'SEARCH',
    });
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Text style={{fontSize: 20, textAlign: 'center', marginBottom: 20}}>
          Result from search
        </Text>
        <ListOfPlaces
          places={this.state.foundPlaces}
          navigateToPlace={index => this.showInfoFor(index)}
        />
        <Button onPress={() => this.props.navigation.goBack()} title="Back" />
      </SafeAreaView>
    );
  }
}