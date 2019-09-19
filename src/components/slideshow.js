import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SliderBox} from 'react-native-image-slider-box';

class Slideshow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [
        'https://images.unsplash.com/photo-1520440229-6469a149ac59?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=675&q=80',
        'https://images.unsplash.com/photo-1518797814703-ed31ee241ef8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1601&q=80',
        'https://source.unsplash.com/1024x768/?girl',
        'https://source.unsplash.com/1024x768/?tree',
      ],
    };
  }
  render() {
    return (
      <SliderBox
        images={this.state.images}
        sliderBoxHeight={this.props.height}
        onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
        parentWidth={this.props.width}
      />
    );
  }
}

export default Slideshow;
