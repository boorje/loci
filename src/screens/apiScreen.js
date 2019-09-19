import React from 'react';
import {Text, View} from 'react-native';
import googleOcr from '../helpers/googleOcr';
import placeSearchGMP from '../helpers/placeSearchGMP';
import placeDetailsGMP from '../helpers/placeDetailsGMP';

class ApiScreen extends React.Component {
  state = {
    base64: this.props.navigation.getParam('base64', null),
    detectedName: '',
  };

  componentDidMount = async () => {
    try {
      const information = await this._fetchInformation();
      this._navigateToResultsPage(information);
    } catch (error) {
      alert(error);
    }
  };

  _fetchInformation = async () => {
    try {
      // Detects text from taken picture
      const detectedName = await googleOcr(this.state.base64);
      this.setState({detectedName});

      // Searches for a place_id in GMP from the name detected
      const detectedPlace = await placeSearchGMP(detectedName);

      // Searches for the details of the location from the place_id
      const results = await placeDetailsGMP(detectedPlace);

      // returns the result
      return results;
    } catch (error) {
      alert(error);
    }
  };

  _navigateToResultsPage = results =>
    this.props.navigation.navigate('Results', {
      results: results,
    });

  render() {
    return (
      <View style={{flex: 1}}>
        <Text>Loading results...</Text>
        <Text>Found: {this.state.detectedName}</Text>
      </View>
    );
  }
}

export default ApiScreen;
