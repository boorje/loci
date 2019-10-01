import React from 'react';
import {ActionSheetIOS, Alert, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

// -- constants --
import {colors} from '../constants/colors';

const _sharePlace = placeInfo => {
  ActionSheetIOS.showShareActionSheetWithOptions(
    {
      subject: 'Check out this awesome restaurant',
      message: 'Add the description of the place',
    },
    () => console.log('share failed'),
    () => console.log('share succeeded'),
  );
};

const margin = 10;
const size = 25;
const TopBar = props => {
  return (
    <View style={{marginRight: '3%', marginLeft: '4%'}}>
      <View
        style={{
          marginTop: '5%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row'}}>
          <Icon.Button
            size={size}
            name="bookmark"
            color={props.isBookmarked ? '#e85a5a' : '#fff'}
            padding={0}
            iconStyle={{
              marginLeft: margin,
              marginTop: margin,
              marginBottom: margin,
            }}
            backgroundColor="transparent"
            onPress={() => props.toggleBookmarkIcon()}
            disabled={!props.loading}
          />
          <Icon.Button
            size={size}
            name="share"
            color="white"
            padding={0}
            iconStyle={{
              marginLeft: margin,
              marginTop: margin,
              marginBottom: margin,
            }}
            underlayColor="transparent"
            backgroundColor="transparent"
            onPress={() => _sharePlace(props.placeInfo)}
          />
        </View>
        <View>
          <Icon.Button
            size={size}
            name="clear"
            color="white"
            padding={0}
            iconStyle={{
              marginLeft: margin,
              marginTop: margin,
              marginBottom: margin,
            }}
            underlayColor="transparent"
            backgroundColor="transparent"
            onPress={() => props.closeScreen()}
          />
        </View>
      </View>
    </View>
  );
};

export default TopBar;

TopBar.proptypes = {
  closeScreen: PropTypes.func.isRequired,
  placeInfo: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    price_level: PropTypes.number,
    rating: PropTypes.number,
    user_ratings_total: PropTypes.number,
    toggleBookmarkIcon: PropTypes.bool.isRequired,
  }),
};
