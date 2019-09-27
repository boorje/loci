import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';

import colors from '../constants/colors';
import fonts from '../constants/fonts';

const Section = props => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.headlineView}>
        <Text style={styles.headlineText}>{props.title}</Text>
        <View style={styles.line} />
      </View>
      {props.children}
    </View>
  );
};

export default Section;

Section.proptypes = {
  title: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: '10%',
  },
  headlineView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '3%',
    marginRight: '7%',
  },
  headlineText: {
    color: colors.charcoal,
    fontFamily: fonts.avenirNext,
    fontSize: 18,
  },
  line: {
    flex: 1,
    borderBottomColor: colors.charcoal,
    borderBottomWidth: 0.5,
    marginLeft: '3%',
  },
});
