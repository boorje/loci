import React from 'react';
import {View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import Camera from '../components/camera';

class HomeScreen extends React.Component {
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
    });
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <Camera takePhoto={photo => this.takePhoto(photo)} />
      </View>
    );
  }
}

export default HomeScreen;
