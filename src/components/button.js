import React from 'react';
import {StyleSheet, Text, TouchableHighlight} from 'react-native';
import PropTypes from 'prop-types';

// -- Constants --
import colors from '../constants/colors';

const Button = props => {
  return (
    <TouchableHighlight
      style={styles.button}
      onPress={() => props.onPress()}
      underlayColor={colors.palegold}>
      <Text style={styles.title}>{props.title}</Text>
    </TouchableHighlight>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    padding: 20,
    marginTop: '10%',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: colors.surf,
  },
  title: {
    color: '#fff',
    fontSize: 16,
  },
});

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};
