import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Proptypes from 'prop-types';

class SearchBar extends React.Component {
  state = {
    searchText: '',
  };

  render() {
    return (
      <View style={styles.searchBar}>
        <Icon size={20} name="search" color="#666" />
        <TextInput
          style={styles.textInput}
          placeholder="See reviews for a restaurants, cafe or bar..."
          onChangeText={searchText => this.setState({searchText})}
          value={this.state.searchText}
          returnKeyType="search"
          onSubmitEditing={() => this.props.searchFor(this.state.searchText)}
          enablesReturnKeyAutomatically={true}
          placeholderTextColor="#666"
          autoCorrect={false}
        />
      </View>
    );
  }
}

export default SearchBar;

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
    height: 40,
    paddingLeft: 20,
  },
});
