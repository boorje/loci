import {GOOGLE_API_KEY} from '../../constants/apiKeys';
import objSerializer from '../objSerializer';
import getPosition from './getPosition';

const _getCoordinates = async () => {
  const coords = await getPosition();
  const {latitude, longitude} = coords.coords;
  return {latitude, longitude};
};

// searches for nearby restaurants with keyword same as searcText
const _searchUrl = (latitude, longitude) => {
  const params = {
    location: `${latitude},${longitude}`,
    // radius: `2000`,
    type: 'restaurant',
    rankby: 'distance',
    key: GOOGLE_API_KEY,
  };
  return `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${objSerializer(
    params,
  )}`;
};

//TODO: Add description of the function
const findNearbyPlaces = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const coords = await _getCoordinates();
      const url = _searchUrl(coords.latitude, coords.longitude);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const jsonResponse = await response.json();
      resolve(jsonResponse.results);
    } catch (error) {
      reject(`Place Search ERROR: ${error}`);
    }
  });
};

export default findNearbyPlaces;
