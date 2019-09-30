import React from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {RNCamera} from 'react-native-camera';
import colors from '../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class AppCamera extends React.Component {
  _renderCameraMenu = () => {
    const {locationPressed, bookmarkPressed} = this.props;
    return (
      <View
        style={{
          width: '100%',
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '15%',
          paddingRight: locationPressed || bookmarkPressed ? '5%' : '10%',
          paddingLeft: locationPressed || bookmarkPressed ? '5%' : '10%',
          bottom: locationPressed || bookmarkPressed ? '-15%' : 0,
          position: 'absolute',
        }}>
        {/* BOOKMARK */}
        {!locationPressed && (
          <View style={styles.icon}>
            <Icon
              style={{padding: 10}}
              name={'bookmark'}
              color={colors.paper}
              size={30}
              onPress={() => {
                this.props.showBookmarkedList();
              }}
            />
          </View>
        )}

        {/* CAMERA */}
        {!bookmarkPressed && !locationPressed && (
          <View style={styles.icon}>
            <Icon
              style={{padding: 15}}
              name="photo-camera"
              color={colors.paper}
              size={60}
              onPress={() => {
                this._takePhoto();
              }}
            />
          </View>
        )}

        {/* NEARBY */}
        {!bookmarkPressed && (
          <View style={styles.icon}>
            <Icon
              style={{padding: 10}}
              name="near-me"
              color={colors.paper}
              size={30}
              onPress={() => {
                this.props.showNearbyPlacesList();
              }}
            />
          </View>
        )}

        {(bookmarkPressed || locationPressed) && (
          <View style={styles.icon}>
            <Icon
              style={{padding: 5}}
              name="close"
              color={colors.paper}
              size={35}
              onPress={() => {
                locationPressed
                  ? this.props.showNearbyPlacesList()
                  : this.props.showBookmarkedList();
              }}
            />
          </View>
        )}
      </View>
    );
  };

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
        <RNCamera
          style={styles.camera}
          ref={ref => {
            this.camera = ref;
          }}
          captureAudio={false}
        />
        {this.props.children}
        {this._renderCameraMenu()}
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
  icon: {
    borderRadius: 50,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
  },
});

AppCamera.proptypes = {
  takePhoto: PropTypes.func.isRequired,
};
