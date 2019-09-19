import React from 'react';
import StarRating from 'react-native-star-rating';
import PropTypes from 'prop-types';
import colors from '../constants/colors';

class Stars extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      starCount: this.props.rating,
    };
  }

  render() {
    return (
      <StarRating
        disabled={true}
        maxStars={5}
        emptyStar={'star-o'}
        fullStar={'star'}
        halfStar={'star-half-full'}
        iconSet={'FontAwesome'}
        fullStarColor={colors.palegold}
        emptyStarColor={colors.silk}
        rating={this.state.starCount}
        containerStyle={this.props.style}
      />
    );
  }
}

export default Stars;

Stars.proptypes = {
  rating: PropTypes.number.isRequired,
  style: PropTypes.shape({}).isRequired,
};
