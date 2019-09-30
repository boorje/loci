import React from 'react';
import {
  Alert,
  Button,
  LayoutAnimation,
  Linking,
  NativeModules,
  SafeAreaView,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-community/async-storage';

// --- Components ---
import Camera from '../components/camera';
import SearchBar from '../components/searchBar';
import CameraMenu from '../components/cameraMenu';

// -- Constants --
import {springAnimation} from '../constants/animations';

// --- Helper Functions ---
import ListOfPlaces from '../components/listOfPlaces';
import findNearbyPlaces from '../helpers/googleAPI/findNearbyPlaces';
import getPosition from '../helpers/getPosition';
import getDistanceTo from '../helpers/getDistanceTo';

// So that it works on Android
const {UIManager} = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

//! DELETE
import {singleObj, arrayObj} from '../constants/mockData';

import {array} from 'prop-types';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    userLocation: {latitude: '', longitude: ''},
    nearbyPlaces: arrayObj, // ! MOCK DATA
    savedPlaces: arrayObj, // ! MOCK DATA
    showNearbyPlacesList: false,
    showFavoritePlacesList: false,
  };

  componentDidMount = async () => {
    try {
      const foundLocation = await this._getCoordinates();
      if (!foundLocation) {
        // TODO: What happens when location isn't found?
        console.log('Could not find location.');
      }
      this.setState({
        userLocation: {
          latitude: foundLocation.latitude,
          longitude: foundLocation.longitude,
        },
      });
    } catch (error) {
      // TODO: What happens when location isn't found?
      console.log('Could not find location.');
      this.setState({nearbyPlaces: []});
    }
  };

  _loadFavorites = async () => {
    try {
      // AsyncStorage.clear();
      const saved = await AsyncStorage.getItem('FAVORITES');
      if (saved === null) {
        throw {errorMsg: 'You have not saved any places yet.'};
      }
      const savedPlaces = JSON.parse(saved);
      this.setState({savedPlaces: savedPlaces});
    } catch (error) {
      Alert.alert(
        'Oops',
        error.errorMsg
          ? error.errorMsg
          : "Something wen't wrong. Please try again",
      );
    }
  };

  showInfoFor = placeIndex => {
    this.props.navigation.navigate('Results', {
      placeInfo: this.state.savedPlaces[placeIndex],
      selectedType: 'FAVORITE',
    });
  };

  _addDistanceTo = places => {
    const n = 20;
    return places.slice(0, n).map(place => {
      place.distanceTo = getDistanceTo(
        this.state.userLocation,
        place.geometry.location,
      );
      return place;
    });
  };

  _getCoordinates = async () => {
    const coords = await getPosition();
    return coords.coords;
  };

  takePhoto = async photo => {
    try {
      const editedPhoto = await ImagePicker.openCropper({
        path: photo.uri,
        width: 300,
        height: 100,
        includeBase64: true,
        cropperToolbarTitle: 'Make sure the text is in the highlighted area',
      });
      this._getInfoFrom(editedPhoto.data);
    } catch (error) {
      // The error is thrown when a user cancels the edit. Should not throw error
    }
  };

  _getNearbyPlaces = async () => {
    if (!this.state.userLocation) {
      Alert.alert(
        'Oops',
        'Enable location service to be able to see places near your location.',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'Settings', onPress: () => Linking.openSettings()},
        ],
      );
    }
    const {latitude, longitude} = this.state.userLocation;
    if (latitude && longitude) {
      let nearbyPlaces = await findNearbyPlaces();
      nearbyPlaces = this._addDistanceTo(nearbyPlaces);
      this.setState({nearbyPlaces});
      this.showNearbyPlaces();
    }
  };

  //    -- NAVIGATATION TO RESULTS PAGE --
  _getInfoFrom = base64 => {
    this.props.navigation.navigate('Results', {
      base64: base64,
      nearbyPlaces: this.state.nearbyPlaces,
      userLocation: {
        latitude: this.state.latitude,
        longitude: this.state.longitude,
      },
      selectedType: 'PHOTO',
    });
  };

  showInfoFor = placeIndex => {
    this.props.navigation.navigate('Results', {
      placeInfo: this.state.nearbyPlaces[placeIndex],
      selectedType: 'NEARBY',
    });
  };

  //   -- NAVIGATE TO SEARCH RESULTS MODAL --
  searchInfoFor = place => {
    this.props.navigation.navigate('SearchOptionsModal', {
      searchText: place,
    });
  };

  showFavorites = () => {
    LayoutAnimation.configureNext(springAnimation);
    this.state.showFavoritePlacesList
      ? this.setState({showFavoritePlacesList: false})
      : this.setState({showFavoritePlacesList: true});
  };

  showNearbyPlaces = () => {
    LayoutAnimation.configureNext(springAnimation);
    this.state.showNearbyPlacesList
      ? this.setState({showNearbyPlacesList: false})
      : this.setState({showNearbyPlacesList: true});
  };

  render() {
    const {
      nearbyPlaces,
      savedPlaces,
      showNearbyPlacesList,
      showFavoritePlacesList,
    } = this.state;
    return (
      <View style={{flex: 1}}>
        <Camera style={{flex: 1}} takePhoto={photo => this.takePhoto(photo)}>
          <SearchBar places={nearbyPlaces} />
          <CameraMenu
            bookmarkPressed={showFavoritePlacesList}
            locationPressed={showNearbyPlacesList}
            showNearby={() => this.showNearbyPlaces()}
            showFavorites={() => this.showFavorites()}
          />
        </Camera>
        {showNearbyPlacesList && (
          <ListOfPlaces places={nearbyPlaces} headline={'Places near you'} />
        )}
        {showFavoritePlacesList && (
          <ListOfPlaces places={savedPlaces} headline={'Bookmarked places'} />
        )}
      </View>
    );
  }
}
