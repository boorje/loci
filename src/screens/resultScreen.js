import React from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// -- Components --
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import Stars from '../components/stars';
import Review from '../components/review';
import {GOOGLE_API_KEY} from '../constants/apiKeys';
import Gallery from '../components/gallery';
import TopBar from '../components/topBar';

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

const {height, width} = Dimensions.get('window');

// TODO: Add a screen/component which is rendered when an error occurs, i.e. text/place wasn't found
class ResultScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
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

  closeScreen = () => {
    this.props.navigation.goBack();
  };

  componentDidMount = async () => {
    try {
      const placeInfo = await this._loadInfo();
      //console.log(placeInfo);
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
      <View style={{flex: 1}}>
        <View style={styles.topContainer}>
          <View style={{marginTop: '10%', marginRight: '3%', marginLeft: '4%'}}>
            <TopBar closeScreen={() => this.closeScreen()} />
          </View>
          <View
            style={{width: width * 0.7, marginBottom: '10%', marginLeft: '7%'}}>
            <Text style={styles.name}>{this.state.name}</Text>
            <Text style={styles.type}>
              {this.state.type} - {this.state.price_level}
            </Text>
          </View>

          <Stars
            style={styles.stars}
            rating={this.state.rating}
            starSize={65}
          />
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.images}>
            <View style={styles.headlineView}>
              <Text style={styles.headlineText}>Images</Text>
              <View style={styles.line} />
            </View>
            <View style={styles.gallery}>
              <Gallery width={width * 0.88} height={height * 0.2} />
            </View>
          </View>

          <View style={styles.reviews}>
            <View style={styles.headlineView}>
              <Text style={styles.headlineText}>Reviews</Text>
              <View style={styles.line} />
            </View>
            <ScrollView
              style={{width: width * 0.88, marginBottom: '-5%'}}
              keyboardShouldPersistTaps="always">
              <Review reviews={this.state.reviews} />
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}

export default ResultScreen;

const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: colors.surf,
    flex: 3,
    justifyContent: 'space-evenly',
  },
  bottomContainer: {
    flex: 6,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  name: {
    fontFamily: fonts.avenirNext,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30,
  },
  type: {
    fontFamily: fonts.avenirNext,
    color: 'white',
    fontSize: 20,
  },
  images: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: '10%',
  },
  reviews: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  gallery: {
    marginTop: '6%',
    marginRight: '6%',
    width: width * 0.88,
    alignItems: 'center',
    height: height * 0.25,
  },
  headlineView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '7%',
    marginRight: '7%',
  },
  headlineText: {
    color: colors.charcoal,
    fontFamily: fonts.avenirNext,
    fontSize: 20,
  },
  line: {
    flex: 1,
    borderBottomColor: colors.charcoal,
    borderBottomWidth: 0.5,
    marginLeft: '3%',
  },
  stars: {
    bottom: '-7%',
    alignSelf: 'center',
    position: 'absolute',
    shadowColor: colors.charcoal,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 7,
    },
  },
});
