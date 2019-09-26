import React from 'react';
import {ActionSheetIOS, Alert, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Proptypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';

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

const Header = props => {
  const {placeInfo} = props;
  return (
    <View>
      <Icon.Button
        backgroundColor={colors.palegold}
        borderRadius={50}
        underlayColor={colors.palegold}
        size={20}
        name="share"
        color={colors.paper}
        type="Feather"
        onPress={() => _sharePlace(placeInfo)}
      />
      <Icon.Button
        backgroundColor={colors.palegold}
        borderRadius={50}
        underlayColor={colors.palegold}
        size={20}
        name="heart"
        color={colors.paper}
        type="Feather"
        onPress={() => _addToAsyncFavorites(placeInfo)}
      />
    </View>
  );
};

export default Header;

Header.proptypes = {
  placeInfo: Proptypes.object.isRequired,
};
