import React from 'react';
import {SliderBox} from 'react-native-image-slider-box';
import PropTypes from 'prop-types';

// -- Constants
import {GOOGLE_API_KEY} from '../constants/apiKeys';

const _extractUrls = info => {
  const arrayObjects = info.map(photo => String(photo.photo_reference));
  const url = 'https://maps.googleapis.com/maps/api/place/photo?';
  const maxwidth = 'maxwidth=400';
  const reference = '&photoreference=';
  const key = '&key=' + GOOGLE_API_KEY;
  return arrayObjects.map(string => url + maxwidth + reference + string + key);
};

const Slideshow = props => {
  return (
    <SliderBox
      images={_extractUrls(props.images)}
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
