import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';

const RenderPlace = props => {
  const {place} = props;
  //TODO: Calculate the distance to the places
  const {name, rating, user_ratings_total} = place.item;
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
        {name} - {type} - {isOpen}
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
