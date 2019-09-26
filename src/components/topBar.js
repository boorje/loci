import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import colors from '../constants/colors';

const margin = 10;
const size = 25;
const TopBar = props => {
  return (
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
          onPress={() => {}}
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
          onPress={() => {}}
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
  );
};

export default TopBar;

TopBar.proptypes = {};
