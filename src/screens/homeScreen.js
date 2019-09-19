import React from 'react';
import {Text, View} from 'react-native';

import Camera from '../components/camera';
import PreviewPhoto from '../components/previewPhoto';

class HomeScreen extends React.Component {
  state = {
    takenPhoto: {},
  };

  addPhotoToState = photo => {
    this.setState({takenPhoto: photo});
  };

  retakePhoto = () => {
    this.setState({takenPhoto: {}});
  };

  usePhoto = () => {
    this.props.navigation.navigate('Api', {
      base64: this.state.takenPhoto.base64,
    });
  };

  render() {
    return (
      <View style={{flex: 1}}>
        {/* {this.state.takenPhoto.uri ? (
          <PreviewPhoto
            uri={this.state.takenPhoto.uri}
            retakePhoto={this.retakePhoto}
            usePhoto={this.usePhoto}
          />
        ) : (
          <Camera addPhoto={photo => this.addPhotoToState(photo)} />
        )} */}
        <Camera addPhoto={photo => this.addPhotoToState(photo)} />
        <Text>This is the home screen.</Text>
      </View>
    );
  }
}

export default HomeScreen;
