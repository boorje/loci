import React from 'react';
import {Text, View, Button} from 'react-native';
import PropTypes from 'prop-types';
import ImagePicker from 'react-native-image-crop-picker';

export default class AppCamera extends React.Component {
  state = {
    hasCameraPermission: null,
  };

  async componentDidMount() {
    //TODO: Ask for permissions
    // const { status } = await Permissions.askAsync(Permissions.CAMERA);
    // this.setState({ hasCameraPermission: status === "granted" });
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);
    });
  }

  //TODO: 1. Send for review.
  //TODO: 2. Send information further to Google Text detection API on success.
  async _snap() {
    const options = {base64: true};
    try {
      if (this.camera) {
        const response = await this.camera.takePictureAsync(options);
        this.props.addPhoto(response);
      }
    } catch (error) {
      alert('ERROR:\n ', error);
    }
  }

  render() {
    const {hasCameraPermission} = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      // TODO: Render a guide to enable this
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{flex: 1}}>
          <Button title="Take photo" onPress={() => this._snap()} />
        </View>
      );
    }
  }
}

AppCamera.proptypes = {
  addPhoto: PropTypes.func.isRequired,
};
