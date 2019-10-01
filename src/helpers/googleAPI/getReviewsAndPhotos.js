import {GOOGLE_API_KEY} from '../../constants/apiKeys';
import objSerializer from '../objSerializer';

const _encodeURL = placeId => {
  const params = {
    place_id: placeId,
    fields: 'review,photo',
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
const getReviewsAndPhotos = async placeId => {
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
      resolve(jsonResponse.result);
    } catch (error) {
      reject('Could not find any reviews for the restaurant');
    }
  });
};

export default getReviewsAndPhotos;
