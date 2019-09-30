import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import PropTypes from 'prop-types';

// -- Constants
import colors from '../constants/colors';
import {GOOGLE_API_KEY} from '../constants/apiKeys';

const entryBorderRadius = 8;

class Gallery extends React.Component {
  state = {
    height: this.props.height,
    width: this.props.width,
  };

  _extractUrls = info => {
    const arrayObjects = info.map(photo => String(photo.photo_reference));
    const url = 'https://maps.googleapis.com/maps/api/place/photo?';
    const maxwidth = 'maxwidth=400';
    const reference = '&photoreference=';
    const key = '&key=' + GOOGLE_API_KEY;
    return arrayObjects.map(
      string => url + maxwidth + reference + string + key,
    );
  };

  _renderItem = ({item, index}) => {
    console.log(item);
    return (
      <View style={styles.shadow}>
        <View style={styles.imageContainer}>
          <Image
            style={{
              width: this.state.width * 0.8,
              height: this.state.height,
              borderRadius: entryBorderRadius,
            }}
            source={{uri: this._extractUrls(item)}}
          />
        </View>
      </View>
    );
  };

  render() {
    return (
      <Carousel
        ref={c => {
          this._carousel = c;
        }}
        data={this.props.photos}
        renderItem={this._renderItem}
        sliderWidth={this.props.width}
        itemWidth={this.props.width * 0.8}
        layout="stack"
      />
    );
  }
}
export default Gallery;

const styles = StyleSheet.create({
  shadow: {
    position: 'absolute',
    shadowColor: colors.charcoal,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 7,
    },
  },
  imageContainer: {
    backgroundColor: 'white',
    borderRadius: entryBorderRadius,
  },
});

Gallery.proptypes = {
  photos: PropTypes.arrayOf().isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};
