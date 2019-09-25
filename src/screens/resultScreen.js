import React from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// -- Components --
import colors from '../constants/colors';
import Stars from '../components/stars';
import Slideshow from '../components/slideshow';
import Review from '../components/review';
import {GOOGLE_API_KEY} from '../constants/apiKeys';

// -- Helper Functions --
import googleOcr from '../helpers/googleAPI/googleOcr';
import searchPlace from '../helpers/googleAPI/searchPlace';
import getPlaceDetails from '../helpers/googleAPI/getPlaceDetails';
import getReviews from '../helpers/googleAPI/getReviews';

const ErrorScreen = errorMsg => {
  alert(errorMsg);
  return (
    <SafeAreaView>
      <Text>
        An error as occurred: -- {errorMsg}. Below you have nearby places
      </Text>
      <Button title="Retake photo" />
    </SafeAreaView>
  );
};

// TODO: Add a screen/component which is rendered when an error occurs, i.e. text/place wasn't found
class ResultScreen extends React.Component {
  state = {
    apiError: '',
    showPhotos: true,
    height: 0,

    // The place information
    name: '',
    type: '',
    rating: null,
    user_ratings_total: '',
    price_level: '',
    photos: [],
    reviews: [],

    // From homescreen
    // -- Photo
    nearbyPlaces: this.props.navigation.getParam('nearbyPlaces', null), //? Is this needed here?
    userLocation: this.props.navigation.getParam('userLocation', null), //? Is this needed here?
    // -- All
    selectedType: this.props.navigation.getParam('selectedType', null),
  };

  componentDidMount = async () => {
    try {
      const placeInfo = await this._loadInfo();
      await this._updateStateWith(placeInfo);
    } catch (error) {
      // OCR - text not found -> present nearby locations or retake photo
      // Google API - name not found -> present nearby locations or retake photo. Add description on how to take proper photo
      alert('Something went wrong. Please try again');
      this.setState({apiError: error});
    }
  };

  _loadInfo = async () => {
    let thePlaceInfo;
    const {selectedType} = this.state;
    if (selectedType === 'PHOTO') {
      const base64 = this.props.navigation.getParam('base64', null);
      thePlaceInfo = await this._fetchPlaceInfoFromPhoto(base64);
    } else if (selectedType === 'NEARBY') {
      thePlaceInfo = this.props.navigation.getParam('nearbyPlace', null);
    } else if (selectedType === 'SEARCH') {
      const searchText = this.props.navigation.getParam('searchText', null);
      thePlaceInfo = await this._fetchPlaceInfoFromSearch(searchText);
    } else {
      throw 'Could not load any information. Please try again.';
    }
    return thePlaceInfo;
  };

  _fetchPlaceInfoFromPhoto = async base64 => {
    const detectedName = await googleOcr(base64);
    const detectedPlace = await searchPlace(
      detectedName,
      this.state.userLocation,
    );
    return await getPlaceDetails(detectedPlace);
  };

  // If location service is disabled. What happens?
  // Should user be able to search for places other than nearby? YES
  //! Disabled the user location so a user can search for places that aren't nearby.
  _fetchPlaceInfoFromSearch = async searchText => {
    const detectedPlace = await searchPlace(
      searchText,
      // this.state.userLocation,
    );
    return await getPlaceDetails(detectedPlace);
  };

  _updateStateWith = async placeInfo => {
    const {
      place_id,
      name,
      types,
      rating,
      user_ratings_total,
      price_level,
      photos,
    } = placeInfo;

    let {reviews} = placeInfo;

    if (this.state.isNearbyPlace) {
      reviews = await getReviews(place_id);
    }

    this.setState({
      name,
      type: types ? this._modifyType(types[0]) : null,
      rating: rating ? rating : null,
      user_ratings_total: user_ratings_total ? user_ratings_total : null,
      price_level: price_level ? this._renderDollarsFrom(price_level) : null,
      photos: photos ? this._extractUrl(photos) : null,
      reviews: reviews ? this._extractReviewInfo(reviews) : null,
    });
  };

  _renderDollarsFrom = price => {
    let price_level = '';
    for (let index = 0; index < price; index++) {
      price_level += '$';
    }
    return price_level;
  };

  _modifyType = type => {
    if (type.includes('_')) {
      type = type.replace('_', ' ');
    }
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  _extractReviewInfo = reviews => {
    return reviews.map((review, index) => ({
      id: index,
      author_name: review.author_name,
      rating: review.rating,
      time: review.time,
      text: review.text,
    }));
  };

  _extractUrl = info => {
    const arrayObjects = info.map(photo => String(photo.photo_reference));
    const url = 'https://maps.googleapis.com/maps/api/place/photo?';
    const maxwidth = 'maxwidth=400';
    const reference = '&photoreference=';
    const key = '&key=' + GOOGLE_API_KEY;
    return arrayObjects.map(
      string => url + maxwidth + reference + string + key,
    );
  };

  _toggleTabMenu = () => {
    this.state.showPhotos === true
      ? this.setState({showPhotos: false})
      : this.setState({showPhotos: true});
  };

  _onLayout = e => {
    this.setState({
      height: e.nativeEvent.layout.height,
    });
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.name}>{this.state.name}</Text>
            <Text style={styles.type}>{this.state.type}</Text>
            <Text style={styles.type}>{this.state.price_level}</Text>
          </View>
          <Stars
            style={styles.stars}
            rating={this.state.rating}
            starSize={50}
          />
          <View style={{alignItems: 'center'}}>
            <Text style={styles.review}>
              {this.state.rating}
              <Text style={styles.review2}>
                {' '}
                baserat på {this.state.user_ratings_total} recensioner
              </Text>
            </Text>
          </View>
          <View style={styles.menu}>
            <TouchableOpacity
              style={
                this.state.showPhotos ? styles.container : styles.container2
              }
              onPress={this._toggleTabMenu}>
              <Text style={{fontFamily: 'Avenir Next'}}> Bilder </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                !this.state.showPhotos ? styles.container : styles.container2
              }
              onPress={this._toggleTabMenu}>
              <Text style={{fontFamily: 'Avenir Next'}}> Recensioner </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.slideshow} onLayout={this._onLayout}>
          {this.state.showPhotos ? (
            <Slideshow images={this.state.photos} height={this.state.height} />
          ) : (
            <ScrollView keyboardShouldPersistTaps="always">
              <Review reviews={this.state.reviews} />
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

export default ResultScreen;

const styles = StyleSheet.create({
  name: {
    marginTop: 50,
    fontFamily: 'Avenir Next',
    color: colors.charcoal,
    fontWeight: 'bold',
    fontSize: 30,
  },
  type: {
    marginTop: 10,
    fontFamily: 'Avenir Next',
    color: colors.charcoal,
    fontSize: 18,
  },
  review: {
    marginTop: 5,
    fontFamily: 'Avenir Next',
    color: colors.charcoal,
    fontSize: 20,
  },
  review2: {
    marginTop: 5,
    fontFamily: 'Avenir Next',
    color: colors.charcoal,
    fontSize: 14,
  },
  stars: {
    marginTop: 20,
    marginLeft: 70,
    marginRight: 70,
  },
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
