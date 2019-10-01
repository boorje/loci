import {GOOGLE_API_KEY} from '../../constants/apiKeys';
import objSerializer from '../objSerializer';

const _replaceSpacesWithPlus = string => string.split(' ').join('+');

/**
 * Returns the url with specified params for google API
 *
 * @param {String} searcText The text to search for
 * @param {Object} userLocation The users location as {lat,long}
 * @returns {String}
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
 * Returns the 5 top places found
 *
 * @param {String} searchQuery The text to search for
 * @returns {Array}
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
      const n = 5;
      resolve(results.slice(0, n));
    } catch (error) {
      error
        ? reject('Could not find any restaurants from your search')
        : 'Default error';
    }
  });
};

export default searchTextPlaces;
