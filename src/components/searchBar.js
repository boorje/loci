import React from 'react';
import {StyleSheet, TextInput, View, LayoutAnimation} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Proptypes from 'prop-types';
import colors from '../constants/colors';
import {springAnimation} from '../constants/animations';
import ListOfPlaces from '../components/listOfPlaces';

export default class SearchBar extends React.Component {
  state = {
    searchText: '',
    showSearchBar: false,
    showResults: false,
  };

  _showSearchBar = () => {
    LayoutAnimation.configureNext(springAnimation);
    this.state.showSearchBar
      ? this.setState({showSearchBar: false})
      : this.setState({showSearchBar: true});
  };

  _showResults = () => {
    LayoutAnimation.configureNext(springAnimation);
    this.state.showResults
      ? this.setState({showResults: false})
      : this.setState({showResults: true});
  };

  render() {
    return (
      <View style={styles.container}>
        {!this.state.showSearchBar ? (
          <View style={styles.searchIcon}>
            <Icon
              name="search"
              style={{padding: 5}}
              color={colors.paper}
              size={30}
              onPress={() => this._showSearchBar()}
            />
          </View>
        ) : (
          <View style={{width: '100%'}}>
            <View style={styles.backgroundView}>
              <View style={styles.searchIcon}>
                <Icon
                  name="search"
                  style={{padding: 5}}
                  color={colors.paper}
                  size={30}
                  onPress={() => this._showSearchBar()}
                />
              </View>
              <TextInput
                placeholder="What are you looking for?"
                style={styles.textInput}
                placeholderTextColor={colors.paper}
                selectionColor={colors.charcoal}
                onChangeText={searchText => this.setState({searchText})}
                value={this.state.searchText}
                enablesReturnKeyAutomatically={true}
                autoCorrect={false}
                autoFocus={true}
                returnKeyType="search"
                onSubmitEditing={() => {
                  // this.props.searchFor(this.state.searchText); // ! Disabled
                  this._showResults();
                  //this.setState({searchText: ''});
                }}
              />
            </View>
            {this.state.showResults && (
              <View style={styles.list}>
                <ListOfPlaces
                  textColor={'white'}
                  headlineColor={'white'}
                  places={this.props.places}
                  headline={'Search results'}
                />
              </View>
            )}
          </View>
        )}
      </View>
    );
  }
}

SearchBar.proptypes = {
  searchFor: Proptypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginTop: '5%',
    paddingBottom: '15%',
    paddingTop: '10%',
    paddingRight: '10%',
    paddingLeft: '10%',
    top: 0,
    position: 'absolute',
  },
  backgroundView: {
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(52, 52, 52, 1)',
    borderRadius: 50,
  },
  searchIcon: {
    borderRadius: 50,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
  },
  textInput: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    borderRadius: 50,
    color: colors.paper,
  },
  list: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    borderRadius: 25,
    width: '100%',
    paddingBottom: '10%',
    top: 5,
  },
});
