import React from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {RNCamera} from 'react-native-camera';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../constants/colors';

export default class AppCamera extends React.Component {
  //? Catch error here?
  async _takePhoto() {
    const options = {base64: true};
    try {
      if (this.camera) {
        const response = await this.camera.takePictureAsync(options);
        this.props.takePhoto(response);
      }
    } catch (error) {
      throw 'Could not take a photo. Please try again';
    }
  }

  render() {
    return (
      <View style={styles.cameraView}>
        <RNCamera
          style={styles.camera}
          ref={ref => {
            this.camera = ref;
          }}
          captureAudio={false}
        />
        <View style={styles.cameraButton}>
          <View style={styles.line} />
          <Icon.Button
            backgroundColor={colors.palegold}
            borderRadius={50}
            underlayColor={colors.palegold}
            padding={3}
            marginLeft={10}
            marginTop={10}
            marginBottom={10}
            size={30}
            name="camera"
            color={colors.paper}
            type="Feather"
            onPress={() => this._takePhoto()}
          />
          <View style={styles.line} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cameraView: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  camera: {
    flex: 1,
    alignItems: 'center',
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    position: 'absolute',
    bottom: -29,
  },
  line: {
    flex: 1,
    borderBottomColor: colors.palegold,
    borderBottomWidth: 2,
    borderTopColor: colors.palegold,
    borderTopWidth: 2,
  },
});

AppCamera.proptypes = {
  takePhoto: PropTypes.func.isRequired,
};
