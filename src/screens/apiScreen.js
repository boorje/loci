import React from 'react';
import {Button, Text, View} from 'react-native';
import googleOcr from '../helpers/googleAPI/googleOcr';
import searchPlace from '../helpers/googleAPI/searchPlace';
import searchNearbyPlace from '../helpers/googleAPI/searchNearbyPlace';
import getPlaceDetails from '../helpers/googleAPI/getPlaceDetails';
import getPosition from '../helpers/googleAPI/getPosition';

class ApiScreen extends React.Component {
  state = {
    loading: true,
    detectedName: '',
    apiError: '',
    location: false,
    base64: this.props.navigation.getParam('base64', null),
  };

  componentDidMount = async () => {
    try {
      const information = await this._fetchInformation();
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

  //Error on fetching is not catched?
  _getCoordinates = async () => {
    try {
      const coords = await getPosition();
      const {latitude, longitude} = coords.coords;
      this.setState({location: true});
      return {latitude, longitude};
    } catch (error) {
      this.setState({location: false});
    }
  };

  _fetchInformation = async () => {
    // Detects text from taken picture

    // const detectedName = await googleOcr(this.state.base64);
    const detectedName = 'Niko Romito Space Milan';
    this.setState({detectedName});

    if (!this.state.location) {
      // Searches for a place_id in GMP from the name detected
      const detectedPlace = await searchPlace(detectedName);

      // Searches for the details of the location from the place_id
      return await getPlaceDetails(detectedPlace);
    }

    return await searchNearbyPlace();
  };

  //TODO: Create a component which takes in the nearby places (top 5?) and renders
  _renderNearbyPlaces = () => {
    return <Text>Are you looking for?</Text>;
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
