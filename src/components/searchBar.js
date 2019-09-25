import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Proptypes from 'prop-types';

export default class SearchBar extends React.Component {
  state = {
    searchText: '',
  };

  render() {
    return (
      <View style={styles.searchBar}>
        <Icon size={20} name="search" color="#666" />
        <View style={styles.textInput}>
          <TextInput
            placeholder="See reviews for restaurants, cafe or bars..."
            onChangeText={searchText => this.setState({searchText})}
            value={this.state.searchText}
            returnKeyType="search"
            onSubmitEditing={() => {
              this.props.searchFor(this.state.searchText);
              this.setState({searchText: ''});
            }}
            enablesReturnKeyAutomatically={true}
            placeholderTextColor="#666"
            autoCorrect={false}
          />
        </View>
      </View>
    );
  }
}

SearchBar.proptypes = {
  searchFor: Proptypes.func.isRequired,
};

const styles = StyleSheet.create({
  searchBar: {
    flex: 0.3,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  textInput: {
    height: 50,
    paddingLeft: 20,
    justifyContent: 'center',
  },
});
