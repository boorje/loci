import React from 'react';
import {Alert, LayoutAnimation, NativeModules, View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-community/async-storage';

// --- Components ---
import Camera from '../components/camera';
import SearchBar from '../components/searchBar';

// -- Constants --
import {springAnimation} from '../constants/animations';

// --- Helper Functions ---
import ListOfPlaces from '../components/listOfPlaces';
import findNearbyPlaces from '../helpers/googleAPI/findNearbyPlaces';
import getPosition from '../helpers/getPosition';
import getDistanceTo from '../helpers/getDistanceTo';
import {getStorageItems} from '../helpers/asyncStorage';

// So that it works on Android //? WHAT WORKS?!?
// const {UIManager} = NativeModules;
// UIManager.setLayoutAnimationEnabledExperimental &&
//   UIManager.setLayoutAnimationEnabledExperimental(true);

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    userLocation: {latitude: '', longitude: ''},
    nearbyPlaces: [],
    bookmarkedPlaces: [],
    showNearbyPlacesList: false,
    showBookmarkedPlacesList: false,
  };

  componentDidMount = async () => {
    try {
      const {coords} = await getPosition();
      if (!coords) {
        // TODO: Ask for permission?
        throw 'Could not find location.';
      }
      this.setState({
        userLocation: {
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
      });
    } catch (error) {
      // TODO: What happens when location isn't found?
      this.setState({nearbyPlaces: []});
    }
  };

  // -- PHOTO ACTIONS --
  takePhoto = async photo => {
    try {
      const editedPhoto = await ImagePicker.openCropper({
        path: photo.uri,
        width: 300,
        height: 100,
        includeBase64: true,
        cropperToolbarTitle: 'Make sure the text is in the highlighted area',
      });
      this._navToResultForPhoto(editedPhoto.data);
    } catch (error) {
      // The error is thrown when a user cancels the edit. Should not throw error
    }
  };

  _shoot = props => {};

  _navToResultForPhoto = base64 => {
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
  //END

  // -- NEARBY LOCATION ACTIONS --
  _fetchNearbyPlaces = async () => {
    return new Promise(async (resolve, reject) => {
      if (!this.state.userLocation) {
        reject('Enable user location to see nearby locations');
      }
      const {latitude, longitude} = this.state.userLocation;
      if (!latitude || !longitude) {
        reject('Enable user location to see nearby locations');
      }
      let nearbyPlaces = await findNearbyPlaces();
      if (nearbyPlaces.length < 1) {
        reject('No nearby places found.');
      }
      nearbyPlaces = this._calcDistanceTo(nearbyPlaces);
      resolve(nearbyPlaces);
    });
  };

  _calcDistanceTo = places => {
    const n = 20;
    return places.slice(0, n).map(place => {
      place.distanceTo = getDistanceTo(
        this.state.userLocation,
        place.geometry.location,
      );
      return place;
    });
  };

  navToResultForNearby = placeIndex => {
    this.setState({showNearbyPlacesList: false});
    this.props.navigation.navigate('Results', {
      placeInfo: this.state.nearbyPlaces[placeIndex],
      selectedType: 'NEARBY',
    });
  };

  showNearbyPlacesList = async () => {
    LayoutAnimation.configureNext(springAnimation);
    const {nearbyPlaces, showNearbyPlacesList} = this.state;
    if (!showNearbyPlacesList) {
      this.setState({showNearbyPlacesList: true});
      if (nearbyPlaces.length < 1) {
        const foundPlaces = await this._fetchNearbyPlaces();
        this.setState({showNearbyPlacesList: true, nearbyPlaces: foundPlaces});
      }
    } else {
      this.setState({showNearbyPlacesList: false});
    }
  };
  //END

  // -- BOOKMARKED ACTIONS --
  navToResultForBookmarked = placeIndex => {
    this.setState({showBookmarkedPlacesList: false});
    this.props.navigation.navigate('Results', {
      placeInfo: this.state.bookmarkedPlaces[placeIndex],
      selectedType: 'BOOKMARKED',
    });
  };

  _getBookmarkedPlaces = async () => {
    try {
      const {BOOKMARKED} = await getStorageItems('BOOKMARKED');
      if (BOOKMARKED === null) {
        throw {errorMsg: 'You have not bookmarked any places yet.'};
      }
      return BOOKMARKED;
    } catch (error) {
      Alert.alert(
        'Oops',
        error.errorMsg
          ? error.errorMsg
          : "Something wen't wrong. Please try again",
      );
    }
  };

  _removeBookmarked = async () => {};

  showBookmarkedList = async () => {
    LayoutAnimation.configureNext(springAnimation);
    const {showBookmarkedPlacesList} = this.state;
    if (!showBookmarkedPlacesList) {
      this.setState({showBookmarkedPlacesList: true});
      const bookmarked = await this._getBookmarkedPlaces();
      this.setState({bookmarkedPlaces: bookmarked});
    } else {
      this.setState({showBookmarkedPlacesList: false});
    }
  };
  //END

  // -- SEARCH ACTIONS --
  navToResultForSearch = placeInfo => {
    this.props.navigation.navigate('Results', {
      placeInfo,
      selectedType: 'SEARCH',
    });
  };

  render() {
    const {
      nearbyPlaces,
      bookmarkedPlaces,
      showNearbyPlacesList,
      showBookmarkedPlacesList,
    } = this.state;
    return (
      <View style={{flex: 1}}>
        <Camera
          style={{flex: 1}}
          takePhoto={photo => this.takePhoto(photo)}
          bookmarkPressed={showBookmarkedPlacesList}
          locationPressed={showNearbyPlacesList}
          showNearbyPlacesList={() => this.showNearbyPlacesList()}
          showBookmarkedList={() => this.showBookmarkedList()}>
          <SearchBar
            places={nearbyPlaces}
            navigateToPlace={placeInfo => this.navToResultForSearch(placeInfo)}
          />
        </Camera>
        {showNearbyPlacesList && (
          <ListOfPlaces
            places={nearbyPlaces}
            headline={'Places near you'}
            navigateToPlace={index => this.navToResultForNearby(index)}
          />
        )}
        {showBookmarkedPlacesList && (
          <ListOfPlaces
            places={bookmarkedPlaces}
            headline={'Bookmarked places'}
            navigateToPlace={index => this.navToResultForBookmarked(index)}
          />
        )}
      </View>
    );
  }
}
