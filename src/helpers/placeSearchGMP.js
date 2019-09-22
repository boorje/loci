import {GOOGLE_API_KEY} from '../constants/apiKeys';
import objSerializer from '../helpers/objSerializer';

const _encodeURL = searchText => {
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

//TODO: Add description of the function
const placeSearchGMP = async searchText => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = _encodeURL(searchText);
      const response = await fetch(url, {
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

export default placeSearchGMP;

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
