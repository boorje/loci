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
    thePlace: {},
    loading: true,
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
    base64: this.props.navigation.getParam('base64', null),
    nearbyPlaces: this.props.navigation.getParam('nearbyPlaces', null),
    userLocation: this.props.navigation.getParam('userLocation', null),
    selectedPlace: this.props.navigation.getParam('selectedPlace', null),
    isNearbyPlace: this.props.navigation.getParam('isNearbyPlace', false),
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
    this.setState({loading: false});
  };

  _loadInfo = async () => {
    let thePlaceInfo;
    // if photo is taken in homescreen
    if (!this.state.isNearbyPlace) {
      thePlaceInfo = await this._fetchPlaceInfoFrom(this.state.base64);
      // if place is selected from nearby places
    } else {
      thePlaceInfo = this.state.selectedPlace;
      // add the reviews
    }

    return thePlaceInfo;
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

  _fetchPlaceInfoFrom = async base64 => {
    const detectedName = await googleOcr(base64);
    const detectedPlace = await searchPlace(
      detectedName,
      this.state.userLocation,
    );
    return await getPlaceDetails(detectedPlace);
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
