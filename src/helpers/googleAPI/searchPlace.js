import {GOOGLE_API_KEY} from '../../constants/apiKeys';
import objSerializer from '../objSerializer';

/**
 * Returns the url with specified params for google API
 *
 * @param {string} searcText The text to search for
 * @param {object} userLocation The users location as {lat,long}
 * @returns {string}
 */
const _searchUrl = (searchText, userLocation) => {
  const params = userLocation
    ? {
        input: encodeURIComponent(searchText),
        inputtype: 'textquery',
        fields: 'place_id',
        // eslint-disable-next-line prettier/prettier
        locationbias: `circle:50000@${userLocation.latitude},${userLocation.longitude}`,
        key: GOOGLE_API_KEY,
      }
    : {
        input: encodeURIComponent(searchText),
        inputtype: 'textquery',
        fields: 'place_id',
        key: GOOGLE_API_KEY,
      };
  return `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?${objSerializer(
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
const searchPlace = async (searchText, userLocation = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(_searchUrl(searchText, userLocation), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const jsonResponse = await response.json();
      resolve(jsonResponse.candidates[0].place_id);
    } catch (error) {
      reject(`Place Search ERROR: ${error}`);
    }
  });
};

export default searchPlace;

/** RETURNS
Object {
  "candidates": Array [
    Object {
      "place_id": "ChIJRVLEVO_GhkcR7ZgniDNTarg",
    },
  ],
  "status": "OK",
}
 */
