import React from 'react';
import {View, FlatList, StyleSheet, Text} from 'react-native';
import Stars from '../components/stars';
import PropTypes from 'prop-types';

const _createDateFrom = timestamp =>
  new Date(timestamp * 1000)
    .toDateString()
    .split(' ')
    .slice(1, 4)
    .join(' ');

const RenderReview = review => {
  return (
    <View style={styles.review}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Stars style={styles.stars} rating={review.item.rating} starSize={20} />
        <Text style={{fontSize: 11, marginLeft: 3}}>
          {_createDateFrom(review.item.time)}
        </Text>
      </View>
      <View>
        <Text style={{fontWeight: 'bold', marginBottom: 3}}>
          {review.item.author_name}{' '}
        </Text>
        <Text style={{fontSize: 11}}>{review.item.text} </Text>
      </View>
    </View>
  );
};

const _flatListItemSeparator = () => <View style={styles.separator} />;

const _sortBy = time => {
  return (a, b) => b[time] - a[time];
};

const Review = props => {
  return (
    <FlatList
      keyboardShouldPersistTaps="always"
      data={props.reviews.sort(_sortBy('time'))}
      keyExtractor={user => user.id}
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
    height: 1,
    width: '97%',
    marginLeft: '3%',
    marginRight: '0%',
    backgroundColor: '#607D8B',
  },
  review: {
    flex: 1,
    marginLeft: '3%',
    marginRight: '3%',
    marginTop: '3%',
    marginBottom: '3%',
  },
  stars: {justifyContent: 'flex-start', marginBottom: 3},
});
