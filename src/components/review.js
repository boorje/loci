import React from 'react';
import {View, FlatList, StyleSheet, Text} from 'react-native';
import Stars from '../components/stars';
import PropTypes from 'prop-types';
import fonts from '../constants/fonts';
import colors from '../constants/colors';

// -- Helper functions --
const _createDateFrom = timestamp => {
  return new Date(timestamp * 1000)
    .toDateString()
    .split(' ')
    .slice(1, 4)
    .join(' ');
};

const _sortBy = time => {
  return (a, b) => b[time] - a[time];
};
// -- END: Helper functions --

const _flatListItemSeparator = () => <View style={styles.separator} />;

const RenderReview = review => {
  return (
    <View style={styles.review}>
      <View
        style={{
          fontFamily: fonts.avenirNext,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Stars style={styles.stars} rating={review.item.rating} starSize={20} />
        <Text
          style={{fontFamily: fonts.avenirNext, fontSize: 11, marginLeft: 3}}>
          {_createDateFrom(review.item.time)}
        </Text>
      </View>
      <View>
        <Text
          style={{
            fontFamily: fonts.avenirNext,
            //fontWeight: 'bold',
            marginBottom: 3,
          }}>
          {review.item.author_name}{' '}
        </Text>
        <Text style={{fontSize: 11}}>{review.item.text} </Text>
      </View>
    </View>
  );
};

const Review = props => {
  return (
    <FlatList
      keyboardShouldPersistTaps="always"
      data={props.reviews.sort(_sortBy('time'))}
      keyExtractor={review => `${review.time.toString()}-${review.author_name}`}
      renderItem={review => RenderReview(review)}
      ItemSeparatorComponent={_flatListItemSeparator}
    />
  );
};

export default Review;

Review.proptypes = {
  reviews: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const styles = StyleSheet.create({
  separator: {
    height: 0.5,
    width: '97%',
    backgroundColor: colors.silk,
  },
  review: {
    flex: 1,
    marginTop: '3%',
    marginBottom: '3%',
  },
  stars: {justifyContent: 'flex-start', marginBottom: 3},
});
