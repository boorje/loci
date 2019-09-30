import {GOOGLE_API_KEY} from '../../constants/apiKeys';
import objSerializer from '../objSerializer';

const _replaceSpacesWithPlus = string => string.split(' ').join('+');

/**
 * Returns the url with specified params for google API
 *
 * @param {string} searcText The text to search for
 * @param {object} userLocation The users location as {lat,long}
 * @returns {string}
 */
const _searchUrl = searchText => {
  const params = {
    query: _replaceSpacesWithPlus(searchText.toLowerCase()),
    type: 'restaurant',
    key: GOOGLE_API_KEY,
  };
  return `https://maps.googleapis.com/maps/api/place/textsearch/json?${objSerializer(
    params,
  )}`;
};

/**
 * Returns the #1 restaurant found
 *
 * @param {string} searcText The text to search for
 * @param {object} userLocation The users location as {lat,long}
 * @returns {object}
 */
const searchTextPlaces = async searchQuery => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(_searchUrl(searchQuery), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const {results} = await response.json();
      if (results.length < 1) {
        throw 'Could not find any restaurants from your search';
      }
      resolve(results);
    } catch (error) {
      error
        ? reject('Could not find any restaurants from your search')
        : 'Default error';
    }
  });
};

export default searchTextPlaces;
