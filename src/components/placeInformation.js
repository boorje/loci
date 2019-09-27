import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';

import colors from '../constants/colors';

const _renderDollarsFrom = price => {
  if (price === null || price < 1) {
    return null;
  }
  let price_level = '';
  for (let index = 0; index < price; index++) {
    price_level += '$';
  }
  return price_level;
};

const _modifyType = type => {
  if (!type) {
    return null;
  }
  return (
    type
      .replace('_', ' ')
      .charAt(0)
      .toUpperCase() + type.slice(1)
  );
};

const PlaceInformation = props => {
  const {name, type, price_level, user_ratings_total} = props.placeInfo;
  return (
    <View
      style={{
        width: props.width * 0.7,
        marginLeft: '7%',
        marginBottom: '10%',
        justifyContent: 'center',
      }}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.type}>
        {_modifyType(type)} {type && price_level > 0 ? '-' : ''}{' '}
        {_renderDollarsFrom(price_level)}
      </Text>
      {/* <Text style={styles.review2}>based on {user_ratings_total} reviews </Text> */}
    </View>
  );
};

export default PlaceInformation;

PlaceInformation.proptypes = {
  placeInfo: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    price_level: PropTypes.number,
    rating: PropTypes.number,
    user_ratings_total: PropTypes.number,
  }).isRequired,
};

const styles = StyleSheet.create({
  name: {
    fontFamily: 'Avenir Next',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30,
    textShadowColor: colors.charcoal,
    textShadowRadius: 5,
  },
  type: {
    marginTop: 5,
    fontFamily: 'Avenir Next',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textShadowColor: colors.charcoal,
    textShadowRadius: 5,
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
  },
});
