import React from 'react';
import {Button, Text, SafeAreaView, View} from 'react-native';

import ListOfPlaces from '../components/listOfPlaces';

import searchTextPlaces from '../helpers/googleAPI/searchTextPlaces';

export default class SearchOptionsScreen extends React.Component {
  state = {
    foundPlaces: [],
  };

  componentDidMount = async () => {
    try {
      const searchText = this.props.navigation.getParam('searchText', null);
      const foundPlaces = await searchTextPlaces(searchText);
      this.setState({foundPlaces});
    } catch (error) {
      alert('Could not find any places. Please try again');
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
        <Text style={{fontSize: 30, textAlign: 'center'}}>
          Select restaurant
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
