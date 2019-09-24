import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import colors from '../constants/colors';
import Stars from '../components/stars';
import Slideshow from '../components/slideshow';
import Review from '../components/review';
import {GOOGLE_API_KEY} from '../constants/apiKeys';

//!DELETE FROM HERE
import searchPlace from '../helpers/googleAPI/searchPlace';
import getPlaceDetails from '../helpers/googleAPI/getPlaceDetails';

class ResultScreen extends React.Component {
  state = {
    name: '',
    type: '', // TODO
    rating: null,
    price_level: '$$$', // TODO
    photo: '',
    review: '',
    user_ratings_total: '45', // TODO
    images: [],
    users: [],

    showImages: true,
    height: 0,
    resultsAPI: this.props.navigation.getParam('results', null),
  };

  //! DELETE
  componentDidMount = async () => {
    try {
      const detectedName = 'Maoji Street Food';

      // Searches for a place_id in GMP from the name detected
      const detectedPlace = await searchPlace(detectedName);

      // Searches for the details of the location from the place_id
      const results = await getPlaceDetails(detectedPlace);

      this.setState({
        name: results.result.name,
        rating: results.result.rating,
        type: this._extractType(results.result.types[0]),
        images: this._extractUrl(results.result.photos),
        users: this._extractUser(results.result.reviews),
      });
    } catch (error) {
      alert(error);
    }
  };

  _extractType = type => {
    if (type.includes('_')) {
      type = type.replace('_', ' ');
    }
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  _extractUser = info => {
    let users = info.map((user, index) => ({
      id: index,
      name: user.author_name,
      rating: user.rating,
      time: user.relative_time_description,
      text: user.text,
    }));
    return users;
  };

  _extractUrl = info => {
    let arrayObjects = info.map(photo => String(photo.photo_reference));
    let url = 'https://maps.googleapis.com/maps/api/place/photo?';
    let maxwidth = 'maxwidth=400';
    let reference = '&photoreference=';
    let key = '&key=' + GOOGLE_API_KEY;
    let photoReferences = arrayObjects.map(
      string => url + maxwidth + reference + string + key,
    );

    return photoReferences;
  };

  _switchToImages = () => {
    if (this.state.showImages == false) this.setState({showImages: true});
  };

  _switchToReviews = () => {
    if (this.state.showImages == true) this.setState({showImages: false});
  };

  _onLayout = e => {
    this.setState({
      height: e.nativeEvent.layout.height,
    });
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: colors.paper}}>
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
                this.state.showImages ? styles.container : styles.container2
              }
              onPress={this._switchToImages}>
              <Text style={{fontFamily: 'Avenir Next'}}> Bilder </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                !this.state.showImages ? styles.container : styles.container2
              }
              onPress={this._switchToReviews}>
              <Text style={{fontFamily: 'Avenir Next'}}> Recensioner </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.slideshow} onLayout={this._onLayout}>
          {this.state.showImages ? (
            <Slideshow images={this.state.images} height={this.state.height} />
          ) : (
            <ScrollView keyboardShouldPersistTaps="always">
              <Review data={this.state.users} />
            </ScrollView>
          )}
        </View>
      </View>
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
