import React from 'react';
import {View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

// --- Components ---
import Camera from '../components/camera';

// --- Helper Functions ---
import ListOfPlaces from '../components/listOfPlaces';
import findNearbyPlaces from '../helpers/googleAPI/findNearbyPlaces';
import getPosition from '../helpers/googleAPI/getPosition';

class HomeScreen extends React.Component {
  state = {
    foundLocation: false,
    userLocation: {latitude: '', longitude: ''},
    takenPhoto: {},
    nearbyPlaces: [],
  };

  componentDidMount = async () => {
    try {
      await this._getCoordinates();
      if (this.state.foundLocation) {
        const nearbyPlaces = await findNearbyPlaces();
        this.setState({nearbyPlaces});
      }
    } catch (error) {
      this.setState({foundLocation: false});
    }
  };

  _getCoordinates = async () => {
    try {
      const coords = await getPosition();
      const {latitude, longitude} = coords.coords;
      this.setState({foundLocation: true, userLocation: {latitude, longitude}});
    } catch (error) {
      this.setState({foundLocation: false});
    }
  };

  takePhoto = async photo => {
    try {
      this.setState({takenPhoto: photo});
      const editedPhoto = await ImagePicker.openCropper({
        path: this.state.takenPhoto.uri,
        width: 300,
        height: 100,
        includeBase64: true,
        cropperToolbarTitle: 'Edit photo',
      });
      this._usePhoto(editedPhoto.data);
    } catch (error) {
      // The error is thrown when a user cancels the edit. Should not throw error
      this.setState({takenPhoto: {}});
    }
  };

  _usePhoto = base64 => {
    this.props.navigation.navigate('Api', {
      base64: base64,
      nearbyPlaces: this.state.nearbyPlaces,
      userLocation: {
        latitude: this.state.latitude,
        longitude: this.state.longitude,
      },
    });
  };

  navigateToPlace = placeIndex =>
    this.props.navigation.navigate('Results', {
      results: this.state.nearbyPlaces[placeIndex],
    });

  render() {
    const {nearbyPlaces} = this.state;
    return (
      <View style={{flex: 1}}>
        <Camera takePhoto={photo => this.takePhoto(photo)} />
        {nearbyPlaces.length !== 0 && (
          <ListOfPlaces
            places={this.state.nearbyPlaces}
            navigateToPlace={index => this.navigateToPlace(index)}
          />
        )}
      </View>
    );
  }
}

export default HomeScreen;
