import React from 'react';
import {Button, Text, View} from 'react-native';
import googleOcr from '../helpers/googleAPI/googleOcr';
import placeSearchGMP from '../helpers/googleAPI/placeSearchGMP';
import placeDetailsGMP from '../helpers/googleAPI/placeDetailsGMP';

class ApiScreen extends React.Component {
  state = {
    loading: true,
    detectedName: '',
    apiError: '',
    base64: this.props.navigation.getParam('base64', null),
  };

  componentDidMount = async () => {
    try {
      const information = await this._fetchInformation();
      console.log(information);
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

  _fetchInformation = async () => {
    // Detects text from taken picture

    // const detectedName = await googleOcr(this.state.base64);
    const detectedName = 'Niko Romito Space Milan';
    this.setState({detectedName});

    // Searches for a place_id in GMP from the name detected
    const results = await placeSearchGMP(detectedName);

    return results;
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
