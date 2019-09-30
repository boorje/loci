import React from 'react';
import {View, StyleSheet, Button, Image} from 'react-native';
import PropTypes from 'prop-types';
import {RNCamera} from 'react-native-camera';
import CameraMenu from '../components/cameraMenu';
import colors from '../constants/colors';
import SearchBar from './searchBar';
import ListOfPlaces from './listOfPlaces';
import mockData from '../constants/mockData';

const url =
  'https://images.unsplash.com/photo-1520440229-6469a149ac59?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=675&q=80';

export default class AppCamera extends React.Component {
  //? Catch error here?
  async _takePhoto() {
    const cameraOptions = {base64: true};
    try {
      if (!this.camera) {
        throw 'Could not take a photo. Please try again';
      }
      const response = await this.camera.takePictureAsync(cameraOptions);
      this.props.takePhoto(response);
    } catch (error) {
      throw 'Could not take a photo. Please try again';
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <RNCamera
          style={styles.camera}
          ref={ref => {
            this.camera = ref;
          }}
          captureAudio={false}
        /> */}

        <Image style={styles.camera} source={{uri: url}} />
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
});

AppCamera.proptypes = {
  takePhoto: PropTypes.func.isRequired,
};
