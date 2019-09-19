import React from 'react';
import {Button, View, Image} from 'react-native';
import PropTypes from 'prop-types';

const PreviewPhoto = props => {
  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <Image
        source={{uri: props.uri}}
        style={{width: 300, height: 300, resizeMode: 'contain'}}
      />
      <Button title="Retake Photo" onPress={() => props.retakePhoto()} />
      <Button title="Use Photo" onPress={() => props.usePhoto()} />
    </View>
  );
};

export default PreviewPhoto;

PreviewPhoto.proptypes = {
  retakePhoto: PropTypes.func.isRequired,
  usePhoto: PropTypes.func.isRequired,
  uri: PropTypes.string.isRequired,
};
