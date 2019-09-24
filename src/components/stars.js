import React from 'react';
import StarRating from 'react-native-star-rating';
import PropTypes from 'prop-types';
import colors from '../constants/colors';

const Stars = props => {
  return (
    <StarRating
      disabled={true}
      maxStars={5}
      starSize={props.starSize}
      emptyStar={'star-o'}
      fullStar={'star'}
      halfStar={'star-half-full'}
      iconSet={'FontAwesome'}
      fullStarColor={colors.palegold}
      emptyStarColor={colors.silk}
      rating={props.rating}
      containerStyle={props.style}
    />
  );
};

export default Stars;

Stars.proptypes = {
  rating: PropTypes.number.isRequired,
  style: PropTypes.shape({}).isRequired,
  starSize: PropTypes.number.isRequired,
};
