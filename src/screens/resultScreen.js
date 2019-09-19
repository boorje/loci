import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../constants/colors';
import Stars from '../components/stars';
import Slideshow from '../components/slideshow';
import {Dimensions} from 'react-native';

class ResultScreen extends React.Component {
  state = {
    results: {
      name: 'Gelateria Stracciatella',
      type: 'Glassbar',
      rating: '2',
      price_level: '$$$',
      photo: '',
      review: '',
      user_ratings_total: '45',
    },
    showImages: true,
    height: 0,
    resultsAPI: this.props.navigation.getParam('results', null),
  };

  switchToImages = () => {
    if (this.state.showImages === false) this.setState({showImages: true});
  };

  switchToReviews = () => {
    if (this.state.showImages === true) this.setState({showImages: false});
  };

  onLayout = e => {
    this.setState({
      height: e.nativeEvent.layout.height,
    });
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <View>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.name}>{this.state.results.name}</Text>
            <Text style={styles.type}>- {this.state.results.type} -</Text>
            <Text style={styles.type}>{this.state.results.price_level}</Text>
          </View>

          <Stars
            style={styles.stars}
            rating={parseInt(this.state.results.rating)}
          />
          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.container}
              onPress={this.switchToImages}>
              <Text> Bilder </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.container}
              onPress={this.switchToReviews}>
              <Text> Recensioner </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.slideshow} onLayout={this.onLayout}>
          {this.state.showImages && <Slideshow height={this.state.height} />}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  name: {
    marginTop: 50,
    color: colors.charcoal,
    fontWeight: 'bold',
    fontSize: 30,
  },
  type: {
    marginTop: 10,
    color: colors.charcoal,
    fontSize: 18,
  },
  stars: {
    marginTop: 30,
    marginLeft: 70,
    marginRight: 70,
  },
  slideshow: {
    flex: 1,
    justifyContent: 'center',
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    borderWidth: 1,
    padding: 10,
    borderColor: '#d6d7da',
  },
});

export default ResultScreen;
