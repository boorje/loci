import React from 'react';
import {
  Alert,
  ActionSheetIOS,
  LayoutAnimation,
  Linking,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

// --- Components ---
import Camera from '../components/camera';
import SearchBar from '../components/searchBar';
import Button from '../components/button';

// -- Constants --
import {springAnimation} from '../constants/animations';
import fonts from '../constants/fonts';

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
    locationFound: false,
    nearbyPlaces: [],
    bookmarkedPlaces: [],
    showNearbyPlacesList: false,
    showBookmarkedPlacesList: false,
    showSearchBar: false,
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
        locationFound: true,
      });
    } catch (error) {
      // TODO: What happens when location isn't found?
      this.setState({locationFound: false});
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
    if (this.state.locationFound) {
      const {latitude, longitude} = this.state.userLocation;
      if (latitude && longitude) {
        let nearbyPlaces = await findNearbyPlaces();
        if (nearbyPlaces.length > 0) {
          nearbyPlaces = await this._calcDistanceTo(nearbyPlaces);
          return nearbyPlaces;
        }
      }
    }
    return null;
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
    const {showNearbyPlacesList} = this.state;
    if (!showNearbyPlacesList) {
      this.setState({showNearbyPlacesList: true});
      const {nearbyPlaces} = this.state;
      if (nearbyPlaces.length < 1) {
        const foundPlaces = await this._fetchNearbyPlaces();
        if (foundPlaces !== null) {
          this.setState({
            showNearbyPlacesList: true,
            nearbyPlaces: foundPlaces,
          });
        }
      }
    } else {
      this.setState({showNearbyPlacesList: false});
    }
  };

  enableLocation = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Settings'],
        cancelButtonIndex: 0,
      },
      buttonIndex => {
        if (buttonIndex === 1) {
          Linking.openSettings();
        }
      },
    );
  };
  //END

  // -- BOOKMARKED ACTIONS --
  navToResultForBookmarked = placeIndex => {
    this.props.navigation.navigate('Results', {
      placeInfo: this.state.bookmarkedPlaces[placeIndex],
      selectedType: 'BOOKMARKED',
    });
    this.setState({showBookmarkedPlacesList: false});
  };

  _getBookmarkedPlaces = async () => {
    try {
      const {BOOKMARKED} = await getStorageItems('BOOKMARKED');
      if (BOOKMARKED === null) {
        throw {errorMsg: 'You have not bookmarked any places yet.'};
      }
      return BOOKMARKED;
    } catch (error) {
      return null;
    }
  };

  _removeBookmarked = async () => {};

  showBookmarkedList = async () => {
    LayoutAnimation.configureNext(springAnimation);
    const {showBookmarkedPlacesList} = this.state;
    if (!showBookmarkedPlacesList) {
      this.setState({showBookmarkedPlacesList: true});
      const bookmarked = await this._getBookmarkedPlaces();
      if (bookmarked !== null) this.setState({bookmarkedPlaces: bookmarked});
    } else {
      this.setState({showBookmarkedPlacesList: false});
    }
  };
  //END

  // -- SEARCH ACTIONS --
  navToResultForSearch = placeInfo => {
    this.setState({showSearchBar: false});
    this.props.navigation.navigate('Results', {
      placeInfo,
      selectedType: 'SEARCH',
    });
  };

  showSearchBar = () => {
    LayoutAnimation.configureNext(springAnimation);
    this.setState({
      showNearbyPlacesList: false,
      showBookmarkedPlacesList: false,
    });
    this.state.showSearchBar
      ? this.setState({showSearchBar: false})
      : this.setState({showSearchBar: true});
  };

  untoggleAll = () => {
    LayoutAnimation.configureNext(springAnimation);
    this.setState({
      showNearbyPlacesList: false,
      showBookmarkedPlacesList: false,
      showSearchBar: false,
    });
  };

  render() {
    const {
      nearbyPlaces,
      bookmarkedPlaces,
      showNearbyPlacesList,
      showBookmarkedPlacesList,
      locationFound,
    } = this.state;
    return (
      <View style={{flex: 1}}>
        <Camera
          style={{flex: 1}}
          takePhoto={photo => this.takePhoto(photo)}
          untoggleAll={() => this.untoggleAll()}
          bookmarkPressed={showBookmarkedPlacesList}
          locationPressed={showNearbyPlacesList}
          showNearbyPlacesList={() => this.showNearbyPlacesList()}
          showBookmarkedList={() => this.showBookmarkedList()}>
          <SearchBar
            places={nearbyPlaces}
            showSearchBar={() => this.showSearchBar()}
            searchBarVisible={this.state.showSearchBar}
            navigateToPlace={placeInfo => this.navToResultForSearch(placeInfo)}
          />
        </Camera>
        {showNearbyPlacesList && (
          <View style={{flex: 1, zIndex: -1}}>
            <Text style={styles.headlineText}>
              {this.state.nearbyPlaces === null
                ? 'No places nearby...'
                : 'Places near you'}
            </Text>
            {locationFound ? (
              <ListOfPlaces
                places={nearbyPlaces}
                showBookmark={false}
                navigateToPlace={index => this.navToResultForNearby(index)}
              />
            ) : (
              <Button title="Enable location" onPress={this.enableLocation} />
            )}
          </View>
        )}
        {showBookmarkedPlacesList && (
          <View style={{flex: 1, zIndex: -1}}>
            <Text style={styles.headlineText}>Bookmarked places</Text>
            {bookmarkedPlaces.length > 0 ? (
              <ListOfPlaces
                showBookmark={false}
                places={bookmarkedPlaces}
                navigateToPlace={index => this.navToResultForBookmarked(index)}
              />
            ) : (
              <Text style={{marginTop: '10%', alignSelf: 'center'}}>
                You don't have any bookmarked places
              </Text>
            )}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headlineText: {
    fontFamily: fonts.avenirNext,
    fontSize: 18,
    marginLeft: '3%',
    marginTop: '10%',
    fontWeight: 'bold',
    color: 'black',
  },
});
