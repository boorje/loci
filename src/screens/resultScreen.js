import React from 'react';
import {Alert, ScrollView, StyleSheet, Dimensions, View} from 'react-native';

// -- Components --
import Stars from '../components/stars';
import Review from '../components/review';
import Gallery from '../components/gallery';
import TopBar from '../components/topBar';
import PlaceInformation from '../components/placeInformation';
import Section from '../components/section';

// -- Constants --
import colors from '../constants/colors';
import fonts from '../constants/fonts';

// -- Helper Functions --
import googleOcr from '../helpers/googleAPI/googleOcr';
import searchPlace from '../helpers/googleAPI/searchPlace';
import getPlaceDetails from '../helpers/googleAPI/getPlaceDetails';
import getReviews from '../helpers/googleAPI/getReviews';

const {height, width} = Dimensions.get('window');

class ResultScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    loading: true,
    apiError: '',
    showPhotos: true,
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

  closeScreen = () => {
    this.props.navigation.goBack();
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
    } else if (selectedType === 'NEARBY' || selectedType === 'SEARCH') {
      thePlaceInfo = this.props.navigation.getParam('placeInfo', null);
      //? Why is await not affecting?
      thePlaceInfo.reviews = await getReviews(thePlaceInfo.place_id);
    } else if (selectedType === 'FAVORITE') {
      thePlaceInfo = this.props.navigation.getParam('placeInfo', null);
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

  render() {
    const {placeInfo} = this.state;
    console.log(placeInfo);
    return (
      <View style={{flex: 1}}>
        {/* PLACE INFORMATION  */}
        <View style={styles.topContainer}>
          <TopBar
            closeScreen={() => this.closeScreen()}
            placeInfo={placeInfo}
          />
          <PlaceInformation placeInfo={placeInfo} width={width} />
          <Stars style={styles.stars} rating={placeInfo.rating} starSize={65} />
        </View>

        <View style={styles.bottomContainer}>
          {/* IMAGES */}
          <Section title="Images">
            <View style={styles.gallery}>
              <Gallery
                width={width * 0.88}
                height={height * 0.2}
                photos={placeInfo.photos}
              />
            </View>
          </Section>

          {/* REVIEWS */}
          <Section title="Reviews">
            <ScrollView
              style={{width: width * 0.88, marginBottom: '-5%'}}
              keyboardShouldPersistTaps="always">
              <Review reviews={placeInfo.reviews} />
            </ScrollView>
          </Section>
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
