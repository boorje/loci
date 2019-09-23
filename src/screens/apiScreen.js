import React from 'react';
import {Button, Text, View} from 'react-native';

import ListOfPlaces from '../components/listOfPlaces';

import googleOcr from '../helpers/googleAPI/googleOcr';
import searchPlace from '../helpers/googleAPI/searchPlace';
import getPlaceDetails from '../helpers/googleAPI/getPlaceDetails';

class ApiScreen extends React.Component {
  state = {
    loading: true,
    detectedName: '',
    apiError: '',
    base64: this.props.navigation.getParam('base64', null),
    nearbyPlaces: this.props.navigation.getParam('nearbyPlaces', null),
  };

  componentDidMount = async () => {
    try {
      await this._getCoordinates();
      const information = await this._fetchPlaceInfo();
      this._navigateToResultsPage(information);
    } catch (error) {
      /* Errors come from the specific API methods.
      --- ERRORS ---
      1. googleOcr text recognition - no text detected
      2. placeSearchGMP - The "place text" wasn't found
      3. placeDetailsGMP - no details found of the place
      */
      this._renderNearbyPlaces();
      this.setState({apiError: error});
    }
    this.setState({loading: false});
  };

  _navigateToResultsPage = results =>
    this.props.navigation.navigate('Results', {
      results: results,
    });

  _fetchPlaceInfo = async () => {
    // const detectedName = await googleOcr(this.state.base64);
    const detectedName = 'Niko Romito Space Milan';
    this.setState({detectedName});
    const detectedPlace = await searchPlace(detectedName);
    return await getPlaceDetails(detectedPlace);
  };

  _renderNearbyPlaces = () => {
    const nearbyPlaces = this.state.nearbyPlaces;
    return (
      //TODO: Create a component which takes the array of places as prop
      <View style={{display: 'flex', height: 100, alignItems: 'center'}}>
        <Text>Places near you.</Text>
      </View>
    );
  };

  // Returns a section with actions if nothing was found by API.
  _renderErrorSection = apiError => {
    return (
      <View>
        <Text>{apiError}</Text>
        <Button
          title="New Photo"
          onPress={() => this.props.navigation.navigate('Home')}
        />
        {this._renderNearbyPlaces()}
      </View>
    );
  };

  render() {
    const {loading, detectedName, apiError, nearbyPlaces} = this.state;
    return (
      <View style={{flex: 1}}>
        {loading && <Text>Loading results...</Text>}
        {detectedName.length > 0 && <Text>Found: {detectedName}</Text>}
        {apiError.length > 0 && this._renderErrorSection(apiError)}
        {nearbyPlaces.length !== 0 && (
          <ListOfPlaces places={this.state.nearbyPlaces} />
        )}
      </View>
    );
  }
}

export default ApiScreen;
