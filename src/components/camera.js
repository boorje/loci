import React from 'react';
import {View, Button} from 'react-native';
import PropTypes from 'prop-types';
import {RNCamera} from 'react-native-camera';

export default class AppCamera extends React.Component {
  async _takePhoto() {
    const options = {base64: true};
    try {
      if (this.camera) {
        const response = await this.camera.takePictureAsync(options);
        this.props.takePhoto(response);
      }
    } catch (error) {
      //TODO: display a message displaying the error
      alert('ERROR:\n ', error);
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <RNCamera
          style={{
            flex: 1,
            alignItems: 'center',
          }}
          ref={ref => {
            this.camera = ref;
          }}
          captureAudio={false}
        />
        <Button title="Take photo" onPress={() => this._takePhoto()} />
      </View>
    );
  }
}

AppCamera.proptypes = {
  takePhoto: PropTypes.func.isRequired,
};
