import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import Stars from '../components/stars';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import AsyncStorage from '@react-native-community/async-storage';
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
      style={styles.listItem}
      onPress={() => props.navigateToPlace(place.index)}>
      <View style={styles.itemContainer}>
        <View>
          <Text style={{color: props.textColor, fontFamily: fonts.avenirNext}}>
            {name}
          </Text>
          <Stars style={styles.stars} rating={rating} starSize={17} />
        </View>
        {props.showBookmarks && (
          <Icon
            style={{padding: 10}}
            name={'bookmark'}
            color={'red'}
            size={30}
            onPress={() => {}}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const _flatListItemSeparator = () => <View style={styles.separator} />;

const ListOfPlaces = props => {
  const textColor = props.textColor ? props.textColor : colors.charcoal;
  return (
    <View style={styles.container}>
      <FlatList
        data={props.places}
        renderItem={place => (
          <RenderPlace
            textColor={textColor}
            showBookmarks={props.showBookmarks}
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
  container: {
    flex: 1,
    marginTop: '3%',
    marginLeft: '3%',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listItem: {
    flex: 1,
    marginBottom: '1%',
  },
  separator: {
    height: 1,
    width: '97%',
    marginLeft: '3%',
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
