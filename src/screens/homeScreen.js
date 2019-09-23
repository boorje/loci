import React from 'react';
import {Text, View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import Camera from '../components/camera';
import findNearbyPlaces from '../helpers/googleAPI/findNearbyPlaces';
import getPosition from '../helpers/googleAPI/getPosition';

class HomeScreen extends React.Component {
  state = {
    foundLocation: false,
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
      this.setState({foundLocation: true});
      return {latitude, longitude};
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
      alert(error);
    }
  };

  _usePhoto = base64 => {
    this.props.navigation.navigate('Api', {
      base64: base64,
      nearbyPlaces: this.state.nearbyPlaces,
    });
  };

  _renderNearbyPlaces = () => {
    return (
      //TODO: Create a component which takes the array of places as prop
      <View style={{display: 'flex', height: 100, alignItems: 'center'}}>
        <Text>Places near you.</Text>
      </View>
    );
  };

  render() {
    console.log(this.state.nearbyPlaces);
    return (
      <View style={{flex: 1}}>
        <Camera takePhoto={photo => this.takePhoto(photo)} />
        {this.state.nearbyPlaces && this._renderNearbyPlaces()}
      </View>
    );
  }
}

export default HomeScreen;
