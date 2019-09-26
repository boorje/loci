import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';

import Stars from './stars';

import colors from '../constants/colors';

const _renderDollarsFrom = price => {
  if (price === null) {
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
  const {name, type, price_level, rating, user_ratings_total} = props.placeInfo;
  return (
    <View>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.type}>{_modifyType(type)}</Text>
        <Text style={styles.type}>{_renderDollarsFrom(price_level)}</Text>
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
});
