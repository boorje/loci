import React from 'react';
import {SafeAreaView, View, LayoutAnimation, NativeModules} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-community/async-storage';

// --- Components ---
import Camera from '../components/camera';
import SearchBar from '../components/searchBar';

// --- Helper Functions ---
import ListOfPlaces from '../components/listOfPlaces';
import findNearbyPlaces from '../helpers/googleAPI/findNearbyPlaces';
import getPosition from '../helpers/getPosition';
import getDistanceTo from '../helpers/getDistanceTo';

// So that it works on Android
const {UIManager} = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const springAnimation = {
  duration: 300,
  create: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.scaleXY,
    springDamping: 1,
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 1,
  },
};

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    userLocation: {latitude: '', longitude: ''},
    nearbyPlaces: [],
    showNearbyPlacesList: false,
  };

  componentDidMount = async () => {
    try {
      const foundLocation = await this._getCoordinates();
      if (foundLocation) {
        let nearbyPlaces = await findNearbyPlaces();
        nearbyPlaces = this._addDistanceTo(nearbyPlaces);
        this.setState({nearbyPlaces});
      }
    } catch (error) {
      // TODO: What happens when location isn't found?
      console.log('Could not find location.');
      this.setState({nearbyPlaces: []});
    }
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
    const {latitude, longitude} = coords.coords;
    this.setState({userLocation: {latitude, longitude}});
    return true;
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

  toggleListOfPlaces = () => {
    LayoutAnimation.configureNext(springAnimation);
    this.state.showNearbyPlacesList
      ? this.setState({showNearbyPlacesList: false})
      : this.setState({showNearbyPlacesList: true});
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

  // Show modal with the top 5 results
  searchInfoFor = place => {
    this.props.navigation.navigate('SearchOptionsModal', {
      searchText: place,
    });
  };
  //    -- NAVIGATE TO RESULTS PAGE END --

  render() {
    const {nearbyPlaces} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        <SearchBar searchFor={searchText => this.searchInfoFor(searchText)} />
        <View style={{flex: 5, zIndex: 10}}>
          <Camera takePhoto={photo => this.takePhoto(photo)} />
        </View>
        {nearbyPlaces.length > 0 && (
          <View style={{flex: this.state.showNearbyPlacesList ? 5 : 1}}>
            <ListOfPlaces
              places={this.state.nearbyPlaces}
              navigateToPlace={index => this.showInfoFor(index)}
              toggleListOfPlaces={() => this.toggleListOfPlaces()}
              arrowIconDirection={
                this.state.showNearbyPlacesList ? 'arrow-down' : 'arrow-up'
              }
            />
          </View>
        )}
      </SafeAreaView>
    );
  }
}
