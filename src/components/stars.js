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
      emptyStar={'star-border'}
      fullStar={'star'}
      halfStar={'star-half'}
      iconSet={'MaterialIcons'}
      fullStarColor={colors.golden}
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
