import React from 'react';
import {SliderBox} from 'react-native-image-slider-box';
import PropTypes from 'prop-types';

const Slideshow = props => {
  return (
    <SliderBox
      images={props.images}
      sliderBoxHeight={props.height}
      //onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
      parentWidth={props.width}
    />
  );
};

export default Slideshow;

Slideshow.proptypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  sliderBoxHeight: PropTypes.number.isRequired,
  parentWidth: PropTypes.number.isRequired,
};
