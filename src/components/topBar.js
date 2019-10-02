import React from 'react';
import {ActionSheetIOS, Linking, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

// -- constants --
import {colors} from '../constants/colors';

const _sharePlace = placeInfo => {
  console.log(placeInfo);
  ActionSheetIOS.showShareActionSheetWithOptions(
    {
      subject: `Check out this ${placeInfo.type}!`,
      message: `Have you tried ${placeInfo.name}?\n\n\nI found ${placeInfo.name} with the Loci app!`,
    },
    () => console.log('share failed'),
    () => console.log('share succeeded'),
  );
};

const _openMaps = placeInfo => {
  const urlGoogle = 'https://www.google.com/maps/search/?api=1&query=';
  const urlApple = 'http://maps.apple.com/?daddr=';
  // eslint-disable-next-line prettier/prettier
  const coords = `${placeInfo.geometry.location.lat},${placeInfo.geometry.location.lng}`;
  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: ['Cancel', 'Apple Maps', 'Google Maps'],
      cancelButtonIndex: 0,
    },
    buttonIndex => {
      if (buttonIndex === 1) {
        Linking.canOpenURL(urlApple + coords)
          .then(supported => {
            if (!supported) {
              Linking.openURL(urlApple + coords).catch(err =>
                console.error('An error occurred', err),
              );
            } else {
              return Linking.openURL(urlApple + coords);
            }
          })
          .catch(err => console.error('An error occurred', err));
      } else if (buttonIndex === 2) {
        Linking.canOpenURL(urlGoogle + coords)
          .then(supported => {
            if (!supported) {
              Linking.openURL(urlGoogle + coords).catch(err =>
                console.error('An error occurred', err),
              );
            } else {
              return Linking.openURL(urlGoogle + coords);
            }
          })
          .catch(err => console.error('An error occurred', err));
      }
    },
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
            underlayColor="transparent"
            backgroundColor="transparent"
            onPress={() => props.toggleBookmarkIcon()}
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

          <Icon.Button
            size={size}
            name="directions"
            color="white"
            padding={0}
            iconStyle={{
              marginLeft: margin,
              marginTop: margin,
              marginBottom: margin,
            }}
            underlayColor="transparent"
            backgroundColor="transparent"
            onPress={() => _openMaps(props.placeInfo)}
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
