import React from 'react';
import {
  ActionSheetIOS,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// -- Components --
import PlaceInformation from '../components/placeInformation';
import Slideshow from '../components/slideshow';
import Review from '../components/review';
import Header from '../components/header';

// -- Constants --
import colors from '../constants/colors';

// -- Helper Functions --
import googleOcr from '../helpers/googleAPI/googleOcr';
import searchPlace from '../helpers/googleAPI/searchPlace';
import getPlaceDetails from '../helpers/googleAPI/getPlaceDetails';
import getReviews from '../helpers/googleAPI/getReviews';

class ResultScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    loading: true,
    apiError: '',
    showPhotos: true,
    height: 0,
    selectedType: this.props.navigation.getParam('selectedType', null),
    placeInfo: {
      name: '',
      type: '',
      rating: null,
      user_ratings_total: '',
      price_level: '',
      photos: [],
      reviews: [],
    },
  };

  componentDidMount = async () => {
    try {
      const placeInfo = await this._fetchInfoAboutPlace();
      await this._updateStateWith(placeInfo);
    } catch (error) {
      // OCR - text not found -> present nearby locations or retake photo
      // Google API - name not found -> present nearby locations or retake photo. Add description on how to take proper photo
      this.setState({apiError: error});
      Alert.alert(error, 'Please try again.', [
        {text: 'Search again', onPress: () => this.props.navigation.goBack()},
        {
          text: 'Nearby places',
          onPress: () => console.log('Show nearby places'),
        },
      ]);
    }
    this.setState({loading: false});
  };

  _fetchInfoAboutPlace = async () => {
    let thePlaceInfo;
    const {selectedType} = this.state;
    if (selectedType === 'PHOTO') {
      const base64 = this.props.navigation.getParam('base64', null);
      const userLocation = this.props.navigation.getParam('userLocation', null);
      //? Why is await not affecting?
      const detectedName = await googleOcr(base64);
      const detectedPlace = await searchPlace(detectedName, userLocation);
      thePlaceInfo = await getPlaceDetails(detectedPlace);
    } else if (selectedType === 'NEARBY' || 'SEARCH') {
      thePlaceInfo = this.props.navigation.getParam('placeInfo', null);
      //? Why is await not affecting?
      thePlaceInfo.reviews = await getReviews(thePlaceInfo.place_id);
    } else {
      throw 'Could not load any information. Please try again.';
    }
    return thePlaceInfo;
  };

  _updateStateWith = async placeInfo => {
    const {
      name,
      types,
      rating,
      user_ratings_total,
      price_level,
      photos,
      reviews,
    } = placeInfo;

    this.setState({
      placeInfo: {
        name,
        type: types ? types[0] : null,
        rating: rating ? rating : null,
        user_ratings_total: user_ratings_total ? user_ratings_total : null,
        price_level: price_level ? price_level : null,
        photos: photos ? photos : null,
        reviews: reviews ? reviews : null,
      },
    });
  };

  _toggleTabMenu = () => {
    this.state.showPhotos === true
      ? this.setState({showPhotos: false})
      : this.setState({showPhotos: true});
  };

  //? What is this?
  _onLayout = e => {
    this.setState({
      height: e.nativeEvent.layout.height,
    });
  };

  render() {
    const {loading, height, showPhotos, placeInfo} = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View>
          {!loading && <Header placeInfo={placeInfo} />}
          <PlaceInformation placeInfo={this.state.placeInfo} />
          <View style={styles.menu}>
            <TouchableOpacity
              style={showPhotos ? styles.container : styles.container2}
              onPress={this._toggleTabMenu}>
              <Text style={{fontFamily: 'Avenir Next'}}> Bilder </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={!showPhotos ? styles.container : styles.container2}
              onPress={this._toggleTabMenu}>
              <Text style={{fontFamily: 'Avenir Next'}}> Recensioner </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.slideshow} onLayout={this._onLayout}>
          {showPhotos ? (
            <Slideshow images={placeInfo.photos} height={height} />
          ) : (
            <ScrollView keyboardShouldPersistTaps="always">
              <Review reviews={placeInfo.reviews} />
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

export default ResultScreen;

const styles = StyleSheet.create({
  slideshow: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: colors.paper,
  },
  container2: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  menu: {
    flexDirection: 'row',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#d6d7da',
    backgroundColor: 'white',
  },
});
