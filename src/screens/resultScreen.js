import React from 'react';
import {
  Alert,
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
import searchTextPlaces from '../helpers/googleAPI/searchTextPlaces';
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
    placeInfo: {
      name: '',
      type: '',
      rating: null,
      user_ratings_total: '',
      price_level: '',
      photos: [],
      reviews: [],
    },

    name: '',
    type: '',
    rating: null,
    user_ratings_total: '',
    price_level: '',
    photos: [],
    reviews: [],

    selectedType: this.props.navigation.getParam('selectedType', null),
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
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ]);
    }
  };

  _fetchInfoAboutPlace = async () => {
    let thePlaceInfo;
    const {selectedType} = this.state;
    if (selectedType === 'PHOTO') {
      //const base64 = this.props.navigation.getParam('base64', null);
      const userLocation = this.props.navigation.getParam('userLocation', null);
      //? Why is await not affecting?
      //const detectedName = await googleOcr(base64);
      const detectedPlace = await searchPlace('Milano boggi', userLocation);
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
        type: types ? this._modifyType(types[0]) : null,
        rating: rating ? rating : null,
        user_ratings_total: user_ratings_total ? user_ratings_total : null,
        price_level: price_level ? this._renderDollarsFrom(price_level) : null,
        photos: photos ? this._extractUrl(photos) : null,
        reviews: reviews ? this._extractReviewInfo(reviews) : null,
      },
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

  // ? Redundancy
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
    const {height, showPhotos, placeInfo} = this.state;
    const {
      name,
      rating,
      user_ratings_total,
      price_level,
      photos,
      reviews,
      type,
    } = placeInfo;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.type}>{type}</Text>
            <Text style={styles.type}>{price_level}</Text>
          </View>
          <Stars style={styles.stars} rating={rating} starSize={50} />
          <View style={{alignItems: 'center'}}>
            <Text style={styles.review}>
              {rating}
              <Text style={styles.review2}>
                {' '}
                baserat på {user_ratings_total} recensioner
              </Text>
            </Text>
          </View>
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
            <Slideshow images={photos} height={height} />
          ) : (
            <ScrollView keyboardShouldPersistTaps="always">
              <Review reviews={reviews} />
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
