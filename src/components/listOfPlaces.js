import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';

const _classifyDistanceAway = distance => {
  if (distance < 500) {
    return 'Very Close';
  } else if (distance >= 500 && distance < 1000) {
    return 'Close';
  } else {
    return 'A 5 min walk';
  }
};

const RenderPlace = props => {
  const {place} = props;
  const {name, distanceTo, rating, user_ratings_total} = place.item;
  const distanceAway = _classifyDistanceAway(distanceTo);
  const type = place.item.types[0];
  const isOpen = place.item.opening_hours
    ? place.item.opening_hours.open_now
      ? 'open'
      : 'closed'
    : null;
  return (
    <TouchableOpacity
      style={{marginBottom: 10}}
      onPress={() => props.navigateToPlace(place.index)}>
      <Text>
        {name} - {type} - {isOpen} - {distanceAway}
      </Text>
      <Text>
        Rating: {rating} of {user_ratings_total} reviews
      </Text>
    </TouchableOpacity>
  );
};

const ListOfPlaces = props => {
  return (
    <View style={{display: 'flex', height: 150, alignItems: 'center'}}>
      <Text style={{marginBottom: 20}}>Places near you.</Text>
      <FlatList
        data={props.places}
        renderItem={place => (
          <RenderPlace
            place={place}
            navigateToPlace={index => props.navigateToPlace(index)}
          />
        )}
        keyExtractor={place => place.id}
      />
    </View>
  );
};

export default ListOfPlaces;

ListOfPlaces.proptypes = {
  places: PropTypes.array.isRequired,
  navigateToPlace: PropTypes.func.isRequired,
};
