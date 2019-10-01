import React from 'react';
import {Alert, ScrollView, StyleSheet, Dimensions, View} from 'react-native';

// -- Components --
import Stars from '../components/stars';
import Review from '../components/review';
import Gallery from '../components/gallery';
import TopBar from '../components/topBar';
import PlaceInformation from '../components/placeInformation';
import Section from '../components/section';
import LinearGradient from 'react-native-linear-gradient';

// -- Constants --
import colors from '../constants/colors';

// -- Helper Functions --
import googleOcr from '../helpers/googleAPI/googleOcr';
import searchPlace from '../helpers/googleAPI/searchPlace';
import getPlaceDetails from '../helpers/googleAPI/getPlaceDetails';
import getReviewsAndPhotos from '../helpers/googleAPI/getReviewsAndPhotos';
import getPlacePhotos from '../helpers/googleAPI/getPlacePhotos';
import {
  addObjToStorage,
  existsInStorage,
  removeObjFromStorage,
} from '../helpers/asyncStorage';

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
    isBookmarked: false,
  };

  componentDidMount = async () => {
    try {
      const placeInfo = await this._fetchInfoAboutPlace();
      await this._updateStateWith(placeInfo);
      const isBookmarked = await existsInStorage(placeInfo.place_id);
      this.setState({isBookmarked, loading: false});
      await this._addPhotosAndReviews(placeInfo);
    } catch (error) {
      // OCR - text not found -> present nearby locations or retake photo
      // Google API - name not found -> present nearby locations or retake photo. Add description on how to take proper photo
      this.setState({loading: false});
      this.setState({apiError: error});
      Alert.alert(error, 'Please try again.', [
        {text: 'OK', onPress: () => this.closeScreen()},
      ]);
    }
  };

  closeScreen = () => {
    this.props.navigation.goBack();
  };

  _fetchInfoAboutPlace = async () => {
    let thePlaceInfo;
    const {selectedType} = this.state;
    if (selectedType === 'PHOTO') {
      const base64 = this.props.navigation.getParam('base64', null);
      const userLocation = this.props.navigation.getParam('userLocation', null);
      const detectedName = await googleOcr(base64);
      const detectedPlace = await searchPlace(detectedName, userLocation);
      thePlaceInfo = await getPlaceDetails(detectedPlace);
      // sets the place_id to the detected id
      thePlaceInfo.place_id = detectedPlace;
    } else if (selectedType === 'NEARBY' || selectedType === 'SEARCH') {
      thePlaceInfo = this.props.navigation.getParam('placeInfo', null);
      thePlaceInfo.photos = [];
    } else if (selectedType === 'BOOKMARKED') {
      thePlaceInfo = this.props.navigation.getParam('placeInfo', null);
    } else {
      throw 'Could not load any information. Please try again.';
    }
    return thePlaceInfo;
  };

  _updateStateWith = async placeInfo => {
    const {
      name,
      type,
      types,
      rating,
      user_ratings_total,
      price_level,
      photos,
      reviews,
      place_id,
    } = placeInfo;

    this.setState({
      placeInfo: {
        name,
        type: types ? types[0] : type,
        rating: rating ? rating : null,
        user_ratings_total: user_ratings_total ? user_ratings_total : null,
        price_level: price_level ? price_level : null,
        photos: photos ? photos : null,
        reviews: reviews ? reviews : null,
        place_id: place_id ? place_id : null,
      },
    });
  };

  _addPhotosAndReviews = async placeInfo => {
    try {
      const {selectedType} = this.state;
      let fetchedPhotos = [];
      if (selectedType === 'NEARBY' || selectedType === 'SEARCH') {
        const {reviews, photos} = await getReviewsAndPhotos(placeInfo.place_id);
        fetchedPhotos[0] = await getPlacePhotos(photos[0].photo_reference);
        fetchedPhotos[1] = await getPlacePhotos(photos[1].photo_reference);
        this.setState(prevState => ({
          placeInfo: {
            ...prevState.placeInfo,
            reviews: reviews,
            photos: fetchedPhotos,
          },
        }));
      } else if (selectedType === 'PHOTO') {
        fetchedPhotos[0] = await getPlacePhotos(
          placeInfo.photos[0].photo_reference,
        );
        fetchedPhotos[1] = await getPlacePhotos(
          placeInfo.photos[1].photo_reference,
        );
        this.setState(prevState => ({
          placeInfo: {
            ...prevState.placeInfo,
            photos: fetchedPhotos,
          },
        }));
      }
    } catch (error) {
      console.log('could not fetch the photos and reviews');
    }
  };

  toggleBookmarkIcon = async () => {
    try {
      if (!this.state.loading) {
        const {place_id} = this.state.placeInfo;
        const isBookmarked = await existsInStorage(place_id);
        if (isBookmarked) {
          await removeObjFromStorage(place_id);
          this.setState({isBookmarked: false});
        } else {
          await addObjToStorage(this.state.placeInfo);
          this.setState({isBookmarked: true});
        }
      }
    } catch (error) {
      Alert.alert(error);
    }
  };

  _toggleTabMenu = () => {
    this.state.showPhotos === true
      ? this.setState({showPhotos: false})
      : this.setState({showPhotos: true});
  };

  render() {
    const {loading, isBookmarked, placeInfo} = this.state;
    const {rating, reviews, photos} = placeInfo;
    return (
      <View style={{flex: 1}}>
        {/* PLACE INFORMATION  */}
        <View style={styles.topContainer}>
          <LinearGradient
            colors={[colors.surf, 'white']}
            style={styles.topContainer}>
            <View style={{flex: 1, justifyContent: 'space-around'}}>
              <TopBar
                closeScreen={() => this.closeScreen()}
                placeInfo={placeInfo}
                isBookmarked={isBookmarked}
                toggleBookmarkIcon={() => this.toggleBookmarkIcon()}
                loading={loading}
              />
              <PlaceInformation placeInfo={placeInfo} width={width} />
            </View>
          </LinearGradient>
          <Stars style={styles.stars} rating={rating} starSize={65} />
        </View>

        {/* IMAGES */}
        <View style={styles.bottomContainer}>
          <Section title="Images">
            <View style={styles.gallery}>
              {photos.length > 0 && !loading && (
                <Gallery
                  width={width * 0.88}
                  height={height * 0.2}
                  photos={placeInfo.photos}
                />
              )}
            </View>
          </Section>

          {/* REVIEWS */}
          <Section title="Reviews">
            {reviews && (
              <ScrollView
                style={{width: width * 0.88, marginBottom: '-5%'}}
                keyboardShouldPersistTaps="always">
                <Review reviews={reviews} />
              </ScrollView>
            )}
          </Section>
        </View>
      </View>
    );
  }
}

export default ResultScreen;

const styles = StyleSheet.create({
  topContainer: {
    flex: 6,
    justifyContent: 'center',
  },
  bottomContainer: {
    flex: 10,
    alignItems: 'center',
  },
  gallery: {
    marginTop: '6%',
    marginRight: '6%',
    width: width * 0.88,
    alignItems: 'center',
    height: height * 0.25,
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
