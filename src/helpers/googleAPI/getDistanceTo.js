import {GOOGLE_API_KEY} from '../../constants/apiKeys';
import objSerializer from '../objSerializer';

// --- GOOGLE DISTANCE MATRIX API ---

const _encodeURL = (from, to) => {
  const params = {
    origins: `${from.latitude},${from.longitude}`,
    destinations: `${to.latitude},${to.longitude}`,
    key: GOOGLE_API_KEY,
  };
  return `https://maps.googleapis.com/maps/api/distancematrix/json?${objSerializer(
    params,
  )}`;
};

/**
 * Returns the distance to a restaurant from the users location
 *
 * @param {object} from the location to calculate from
 * @param {object} to the location to calculate to
 * @returns {string}
 */
// const getDistanceTo = async (from, to) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const url = _encodeURL(from, to);
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//         },
//       });
//       console.log(response.json());
//       resolve(response.json());
//     } catch (error) {
//       reject(`Place Details ERROR: ${error}`);
//     }
//   });
// };

/**
 *  --- HOMEMADE FUNCTION ---
 */

// Converts numeric degrees to radians
const _toRadians = value => (value * Math.PI) / 180;

/**
 * Returns the distance between two coordinates based on Haversine formula
 *
 * @param {object} from The coordinates of the starting point
 * @param {object} to The coordinates of the ending point
 * @returns {string} The distance rounded to the nearest integer
 */
const getDistanceTo = (from, to) => {
  let lat1 = from.latitude;
  let long1 = from.longitude;
  let lat2 = to.lat;
  let long2 = to.lng;

  const R = 6371; // Radius of earth in km
  const dLat = _toRadians(lat2 - lat1);
  const dLong = _toRadians(long2 - long1);
  lat1 = _toRadians(lat1);
  lat2 = _toRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLong / 2) * Math.sin(dLong / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 1000);
};

export default getDistanceTo;
