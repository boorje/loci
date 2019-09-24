import React from 'react';
import {View, FlatList, StyleSheet, Text} from 'react-native';
import Stars from '../components/stars';
import PropTypes from 'prop-types';

const RenderReview = review => {
  return (
    <View style={styles.review}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Stars style={styles.stars} rating={review.item.rating} starSize={20} />
        <Text style={{fontSize: 11, marginLeft: 3}}> {review.item.time} </Text>
      </View>
      <View>
        <Text style={{fontWeight: 'bold', marginBottom: 3}}>
          {review.item.name}{' '}
        </Text>
        <Text style={{fontSize: 11}}>{review.item.text} </Text>
      </View>
    </View>
  );
};

const _flatListItemSeparator = () => <View style={styles.separator} />;

const Review = props => {
  return (
    <FlatList
      keyboardShouldPersistTaps="always"
      data={props.data}
      keyExtractor={user => user.id}
      renderItem={review => RenderReview(review)}
      ItemSeparatorComponent={_flatListItemSeparator}
    />
  );
};

export default Review;

Review.proptypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
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
