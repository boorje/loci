import React from 'react';
import {FlatList, Text, TouchableOpacity, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';

// Components
import Stars from '../components/stars';
import colors from '../constants/colors';

const _classifyDistanceAway = distance => {
  if (distance < 500) {
    return 'Very Close';
  } else if (distance >= 500 && distance < 1000) {
    return 'Close';
  } else {
    return 'A 5 min walk';
  }
};

const FlatListItemSeparator = () => {
  return <View style={styles.separator} />;
};

const PlaceItem = props => {
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
      style={styles.list}
      onPress={() => props.navigateToPlace(place.index)}>
      <View>
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontFamily: 'Avenir Next'}}>{name}</Text>
        </View>
        <Stars style={styles.stars} rating={rating} starSize={17} />
      </View>
    </TouchableOpacity>
  );
};

const ListOfPlaces = props => {
  return (
    <View style={{flex: 1, backgroundColor: colors.paper}}>
      <View style={styles.headView}>
        <Text style={styles.headLine}>Places nearby</Text>
        <Icon.Button
          backgroundColor="transparent"
          underlayColor="transparent"
          marginRight={10}
          size={20}
          name={props.name}
          color={colors.charcoal}
          onPress={() => props.toggleListOfPlaces()}
        />
      </View>
      <FlatList
        data={props.places}
        renderItem={place => (
          <PlaceItem
            place={place}
            navigateToPlace={index => props.navigateToPlace(index)}
          />
        )}
        keyExtractor={place => place.id}
        ItemSeparatorComponent={<FlatListItemSeparator />}
      />
    </View>
  );
};

export default ListOfPlaces;

ListOfPlaces.proptypes = {
  places: PropTypes.array.isRequired,
  navigateToPlace: PropTypes.func.isRequired,
  toggleListOfPlaces: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  headView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  list: {
    flex: 1,
    marginBottom: 10,
    marginLeft: '3%',
  },
  headLine: {
    marginLeft: '3%',
    color: colors.charcoal,
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Avenir Next',
  },
  separator: {
    height: 1,
    width: '97%',
    marginLeft: '3%',
    marginRight: '0%',
    marginBottom: 3,
    marginTop: 3,
    backgroundColor: '#607D8B',
  },
  stars: {justifyContent: 'flex-start'},
});
