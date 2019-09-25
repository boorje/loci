import React from 'react';
import {SafeAreaView, View, LayoutAnimation, NativeModules} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

// --- Components ---
import Camera from '../components/camera';
import SearchBar from '../components/searchBar';

// --- Helper Functions ---
import ListOfPlaces from '../components/listOfPlaces';
import findNearbyPlaces from '../helpers/googleAPI/findNearbyPlaces';
import getPosition from '../helpers/googleAPI/getPosition';
import getDistanceTo from '../helpers/googleAPI/getDistanceTo';

// So that it works on Android
const {UIManager} = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    foundLocation: false,
    userLocation: {latitude: '', longitude: ''},
    takenPhoto: {},
    nearbyPlaces: [],
    showList: false,
  };

  showList = () => {
    if (this.state.showList === true) {
      LayoutAnimation.configureNext(spring);
      this.setState({showList: false});
    } else {
      LayoutAnimation.configureNext(spring);
      this.setState({showList: true});
    }
  };

  componentDidMount = async () => {
    try {
      const foundLocaiton = await this._getCoordinates();
      if (foundLocation) {
        let nearbyPlaces = await findNearbyPlaces();
        nearbyPlaces = this._addDistanceTo(nearbyPlaces);
        this.setState({nearbyPlaces});
      }
    } catch (error) {
      this.setState({foundLocation: false});
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
    try {
      const coords = await getPosition();
      const {latitude, longitude} = coords.coords;
      this.setState({userLocation: {latitude, longitude}});
      return true;
    } catch (error) {
      return false;
    }
  };

  takePhoto = async photo => {
    try {
      this.setState({takenPhoto: photo});
      const editedPhoto = await ImagePicker.openCropper({
        path: this.state.takenPhoto.uri,
        width: 300,
        height: 100,
        includeBase64: true,
        cropperToolbarTitle: 'Edit photo',
      });
      this._usePhoto(editedPhoto.data);
    } catch (error) {
      // The error is thrown when a user cancels the edit. Should not throw error
      this.setState({takenPhoto: {}});
    }
  };

  _usePhoto = base64 => {
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

  navigateToPlace = placeIndex => {
    this.props.navigation.navigate('Results', {
      nearbyPlace: this.state.nearbyPlaces[placeIndex],
      selectedType: 'NEARBY',
    });
  };

  searchFor = place => {
    this.props.navigation.navigate('Results', {
      searchText: place,
      selectedType: 'SEARCH',
    });
  };

  render() {
    const {nearbyPlaces} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        <SearchBar searchFor={searchText => this.searchFor(searchText)} />
        <View style={{flex: 5, zIndex: 10}}>
          <Camera takePhoto={photo => this.takePhoto(photo)} />
        </View>
        {nearbyPlaces.length !== 0 && (
          <View style={{flex: this.state.showList ? 5 : 1}}>
            <ListOfPlaces
              places={this.state.nearbyPlaces}
              navigateToPlace={index => this.navigateToPlace(index)}
              showList={() => this.showList()}
              name={this.state.showList ? 'arrow-down' : 'arrow-up'}
            />
          </View>
        )}
      </SafeAreaView>
    );
  }
}

let spring = {
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

export default HomeScreen;
