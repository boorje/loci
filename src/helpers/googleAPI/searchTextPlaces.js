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
    query: _replaceSpacesWithPlus(searchText),
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
      const jsonResponse = await response.json();
      console.log('Info: ', jsonResponse.results);
      resolve(jsonResponse.results);
    } catch (error) {
      reject('Could not find any restaurants from your search');
    }
  });
};

export default searchTextPlaces;
