import {GOOGLE_API_KEY} from '../../constants/apiKeys';
import objSerializer from '../objSerializer';

// searches for nearby restaurants with keyword same as searcText
const _searchUrl = searchText => {
  const params = {
    input: encodeURIComponent(searchText),
    inputtype: 'textquery',
    fields: 'place_id',
    key: GOOGLE_API_KEY,
  };
  return `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?${objSerializer(
    params,
  )}`;
};

const searchPlace = async searchText => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(_searchUrl(searchText), {
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
