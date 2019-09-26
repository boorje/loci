import {GOOGLE_API_KEY} from '../../constants/apiKeys';
import objSerializer from '../objSerializer';

const _encodeURL = placeId => {
  const params = {
    place_id: placeId,
    fields: 'name,photo,type,price_level,rating,review,user_ratings_total',
    key: GOOGLE_API_KEY,
  };
  return `https://maps.googleapis.com/maps/api/place/details/json?${objSerializer(
    params,
  )}`;
};

/**
 * Returns the details of a restaurant
 *
 * @param {string} placeId The placeId to search for
 * @returns {object}
 */
const getPlaceDetails = async placeId => {
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

      // Check if restaurant is included in array of types
      let isRestaurant = false;
      jsonResponse.result.types.map(type => {
        if (type === 'restaurant') {
          isRestaurant = true;
        }
      });

      // Reject if not restaurant
      if (!isRestaurant) {
        reject(`"${jsonResponse.result.name}" is not a restaurant.`);
      }

      resolve(jsonResponse.result);
    } catch (error) {
      reject(
        'Could not find any details about the restaurant you are looking for',
      );
    }
  });
};

export default getPlaceDetails;
