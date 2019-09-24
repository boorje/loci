import {GOOGLE_API_KEY} from '../../constants/apiKeys';
import objSerializer from '../objSerializer';

const _encodeURL = placeId => {
  const params = {
    place_id: placeId,
    fields: 'review',
    key: GOOGLE_API_KEY,
  };
  return `https://maps.googleapis.com/maps/api/place/details/json?${objSerializer(
    params,
  )}`;
};

/**
 * Returns the reviews of a place
 *
 * @param {String} placeId The placeId to search for
 * @returns {Array}
 */
const getReviews = async placeId => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = _encodeURL(placeId);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const jsonResponse = await response.json();
      resolve(jsonResponse.result.reviews);
    } catch (error) {
      reject(`Place Details ERROR: ${error}`);
    }
  });
};

export default getReviews;
