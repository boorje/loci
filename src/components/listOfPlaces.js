import React from 'react';
import {Text, View} from 'react-native';
import PropTypes from 'prop-types';

const ListOfPlaces = props => {
  return (
    <View style={{display: 'flex', height: 100, alignItems: 'center'}}>
      <Text>Places near you.</Text>
    </View>
  );
};

export default ListOfPlaces;

ListOfPlaces.proptypes = {
  places: PropTypes.array.isRequired,
};
