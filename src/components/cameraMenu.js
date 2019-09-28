import React from 'react';
import {View, StyleSheet, LayoutAnimation} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import colors from '../constants/colors';
import {springAnimation} from '../constants/animations';

export default class CameraMenu extends React.Component {
  state = {
    locationPressed: this.props.locationPressed,
    bookmarkPressed: this.props.bookmarkPressed,
  };

  render() {
    return (
      <View
        style={{
          width: '100%',
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '15%',
          paddingRight:
            this.props.locationPressed || this.props.bookmarkPressed
              ? '5%'
              : '10%',
          paddingLeft:
            this.props.locationPressed || this.props.bookmarkPressed
              ? '5%'
              : '10%',
          bottom:
            this.props.locationPressed || this.props.bookmarkPressed
              ? '-15%'
              : 0,
          position: 'absolute',
        }}>
        {/* BOOKMARK */}
        {!this.props.locationPressed && (
          <View style={styles.icon}>
            <Icon
              style={{padding: 5}}
              name={'bookmark'}
              color={colors.paper}
              size={35}
              onPress={() => {
                this.props.showFavorites();
                //this.toggleBookmark();
              }}
            />
          </View>
        )}

        {/* CAMERA */}
        {!this.props.bookmarkPressed && !this.props.locationPressed && (
          <View style={styles.icon}>
            <Icon
              style={{padding: 15}}
              name="photo-camera"
              color={colors.paper}
              size={60}
            />
          </View>
        )}

        {/* NEARBY */}
        {!this.props.bookmarkPressed && (
          <View style={styles.icon}>
            <Icon
              style={{padding: 5}}
              name="near-me"
              color={colors.paper}
              size={35}
              onPress={() => {
                this.props.showNearby();
                console.log(this.props.locationPressed);
                //this.toggleLocation();
              }}
            />
          </View>
        )}

        {(this.props.bookmarkPressed || this.props.locationPressed) && (
          <View style={styles.icon}>
            <Icon
              style={{padding: 5}}
              name="close"
              color={colors.paper}
              size={35}
              onPress={() => {
                this.props.locationPressed
                  ? this.props.showNearby()
                  : this.props.showFavorites();
              }}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '15%',
    paddingRight: '10%',
    paddingLeft: '10%',
    bottom: 0,
    position: 'absolute',
  },
  icon: {
    borderRadius: 50,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
  },
});

CameraMenu.proptypes = {
  search: PropTypes.func.isRequired,
  showList: PropTypes.func.isRequired,
};
