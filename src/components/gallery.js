import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import PropTypes, {object} from 'prop-types';
import colors from '../constants/colors';

const images = [
  'https://images.unsplash.com/photo-1559666126-84f389727b9a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1356&q=80',
  'https://images.unsplash.com/photo-1557389352-e721da78ad9f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
  'https://images.unsplash.com/photo-1553969420-fb915228af51?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1049&q=80',
  'https://images.unsplash.com/photo-1550596334-7bb40a71b6bc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
  'https://images.unsplash.com/photo-1550640964-4775934de4af?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
];

const entryBorderRadius = 8;

class Gallery extends React.Component {
  state = {
    height: this.props.height,
    width: this.props.width,
  };

  _renderItem = ({item, index}) => {
    return (
      <View style={styles.shadow}>
        <View style={styles.imageContainer}>
          <Image
            style={{
              width: this.state.width * 0.8,
              height: this.state.height,
              borderRadius: entryBorderRadius,
            }}
            source={{uri: item}}
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
        data={images}
        //data={this.props.photos}
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
  //photos: PropTypes.arrayOf(object).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};
