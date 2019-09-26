import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import Stars from '../components/stars';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
  const type = place.item.types ? place.item.types[0] : place.item.type;
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
          <Text style={{fontFamily: fonts.avenirNext}}>{name}</Text>
        </View>
        <Stars style={styles.stars} rating={rating} starSize={17} />
      </View>
    </TouchableOpacity>
  );
};

const _flatListItemSeparator = () => <View style={styles.separator} />;

const ListOfPlaces = props => {
  return (
    <View style={{flex: 1}}>
      {props.arrowIconDirection && (
        <View style={styles.headView}>
          <Text style={styles.headLine}>Places nearby</Text>
          <Icon.Button
            backgroundColor="transparent"
            underlayColor="transparent"
            marginRight={10}
            size={50}
            name={props.arrowIconDirection}
            color={colors.charcoal}
            onPress={() => props.toggleListOfPlaces()}
          />
        </View>
      )}
      <FlatList
        data={props.places}
        renderItem={place => (
          <RenderPlace
            place={place}
            navigateToPlace={index => props.navigateToPlace(index)}
          />
        )}
        keyExtractor={place => (place.id ? place.id : place.name)}
        ItemSeparatorComponent={_flatListItemSeparator}
      />
    </View>
  );
};

export default ListOfPlaces;

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
    fontFamily: fonts.avenirNext,
  },
  separator: {
    height: 1,
    width: '97%',
    marginLeft: '3%',
    marginRight: '0%',
    marginBottom: 3,
    marginTop: 3,
    backgroundColor: colors.silk,
  },
  stars: {justifyContent: 'flex-start'},
});

ListOfPlaces.proptypes = {
  places: PropTypes.array.isRequired,
  navigateToPlace: PropTypes.func.isRequired,
  toggleListOfPlaces: PropTypes.func, //TODO: isRequired ?
  arrowIconDirection: PropTypes.string, //TODO: isRequired ?
};
