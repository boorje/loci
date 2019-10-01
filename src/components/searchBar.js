import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  LayoutAnimation,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Proptypes from 'prop-types';

// -- components --
import ListOfPlaces from '../components/listOfPlaces';

// -- constants --
import colors from '../constants/colors';
import {springAnimation} from '../constants/animations';
import fonts from '../constants/fonts';

// -- Helpers --
import searchTextPlaces from '../helpers/googleAPI/searchTextPlaces';

export default class SearchBar extends React.Component {
  state = {
    searchText: '',
    loading: false,
    searchBarVisible: this.props.searchBarVisible,
    showResults: false,
    foundPlaces: [],
  };

  _showSearchResults = async () => {
    try {
      this.setState({loading: true, showResults: true, foundPlaces: []});
      const foundPlaces = await searchTextPlaces(this.state.searchText);
      LayoutAnimation.configureNext(springAnimation);
      this.setState({foundPlaces});
    } catch (error) {
      // TODO: Add title in the search area instead of alert
      this.setState({showResults: false});
      Alert.alert(error, 'Please try again.');
    }
    this.setState({loading: false});
  };

  navToResultForSearch = placeIndex => {
    this.props.navigateToPlace(this.state.foundPlaces[placeIndex]);
    this._clearSearch();
  };

  _clearSearch = () => {
    this.setState({
      searchText: '',
      foundPlaces: [],
      showResults: false,
    });
    this.searchField.focus();
  };

  render() {
    return (
      <View style={styles.container}>
        {!this.props.searchBarVisible ? (
          <View style={styles.searchIcon}>
            <Icon
              name="search"
              style={{padding: 5}}
              color={colors.paper}
              size={30}
              onPress={() => {
                this.props.showSearchBar();
              }}
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
                  onPress={() => this.props.showSearchBar()}
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
                ref={input => {
                  this.searchField = input;
                }}
                onSubmitEditing={() => {
                  this._showSearchResults();
                }}
              />
              {this.state.searchText != '' && (
                <Icon
                  style={{padding: 5}}
                  name="close"
                  color={colors.paper}
                  size={25}
                  onPress={() => {
                    this._clearSearch();
                  }}
                />
              )}
            </View>
            {this.state.showResults && (
              <View style={styles.list}>
                <Text style={styles.headlineText}>
                  {this.state.loading
                    ? 'Searching...'
                    : this.state.foundPlaces === null
                    ? 'No results found'
                    : 'Search results'}
                </Text>
                <ListOfPlaces
                  showBookmarks={true}
                  textColor={'white'}
                  places={this.state.loading ? [] : this.state.foundPlaces}
                  navigateToPlace={index => this.navToResultForSearch(index)}
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
  navigateToPlace: Proptypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginTop: '5%',
    paddingBottom: '10%',
    paddingTop: '10%',
    paddingRight: '10%',
    paddingLeft: '10%',
    top: 0,
    position: 'absolute',
  },
  backgroundView: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 1)',
    borderRadius: 50,
  },
  headlineText: {
    fontFamily: fonts.avenirNext,
    fontSize: 18,
    marginLeft: '3%',
    marginTop: '5%',
    fontWeight: 'bold',
    color: 'white',
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
    marginTop: '1%',
    paddingBottom: '5%',
    borderRadius: 25,
    width: '100%',
  },
});
