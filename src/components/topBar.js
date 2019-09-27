import React from 'react';
import {ActionSheetIOS, Alert, AsyncStorage, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import colors from '../constants/colors';

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

const _addToAsyncFavorites = async placeInfo => {
  try {
    let favorites = [];
    const current = JSON.parse(await AsyncStorage.getItem('FAVORITES'));
    if (current) {
      if (current.length > 0) {
        current.map(place => {
          if (place.name === placeInfo.name) {
            throw {
              // eslint-disable-next-line prettier/prettier
              errorMsg: `'${placeInfo.name}' has already been added to your favorites`,
            };
          }
          favorites.push(place);
        });
      }
    }
    favorites.push(placeInfo);
    await AsyncStorage.setItem('FAVORITES', JSON.stringify(favorites));
    Alert.alert(`Added ${placeInfo.name} to your favorites`);
  } catch (error) {
    Alert.alert(
      'Oops',
      error.errorMsg
        ? error.errorMsg
        : 'Could not save the place to your favorites.',
    );
  }
};

const margin = 10;
const size = 25;
const TopBar = props => {
  return (
    <View style={{ marginRight: '3%', marginLeft: '4%'}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row'}}>
          <Icon.Button
            size={size}
            name="bookmark-border"
            color="white"
            padding={0}
            iconStyle={{
              marginLeft: margin,
              marginTop: margin,
              marginBottom: margin,
            }}
            underlayColor="transparent"
            backgroundColor="transparent"
            onPress={() => _addToAsyncFavorites(props.placeInfo)}
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
  }),
};
