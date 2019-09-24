import React from 'react';
import {Button, Text, View} from 'react-native';

// --- Components ---
import ListOfPlaces from '../components/listOfPlaces';

// --- Helper Functions ---
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
    userLocation: this.props.navigation.getParam('userLocation', null),
  };

  componentDidMount = async () => {
    try {
      const information = await this._fetchPlaceInfo();
      this._navigateToDetectedPlace(information);
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

  _fetchPlaceInfo = async () => {
    // const detectedName = await googleOcr(this.state.base64);
    const detectedName = 'Niko Romito Space Milan';
    this.setState({detectedName});
    const detectedPlace = await searchPlace(
      detectedName,
      this.state.userLocation,
    );
    return await getPlaceDetails(detectedPlace);
  };

  _navigateToDetectedPlace = results =>
    this.props.navigation.navigate('Results', {
      results: results,
    });

  navigateToPlace = placeIndex =>
    this.props.navigation.navigate('Results', {
      results: this.state.nearbyPlaces[placeIndex],
      isNearbyPlace: true,
    });

  render() {
    const {loading, detectedName, apiError} = this.state;
    return (
      <View style={{flex: 1}}>
        {loading && <Text>Loading results...</Text>}
        {detectedName.length > 0 && <Text>Found: {detectedName}</Text>}
        {apiError.length > 0 && this._renderErrorSection(apiError)}
      </View>
    );
  }
}

export default ApiScreen;
