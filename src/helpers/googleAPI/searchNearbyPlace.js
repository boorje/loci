import {GOOGLE_API_KEY} from '../../constants/apiKeys';
import objSerializer from '../objSerializer';
import getPosition from './getPosition';

const _getCoordinates = async () => {
  const coords = await getPosition();
  const {latitude, longitude} = coords.coords;
  return {latitude, longitude};
};

// searches for nearby restaurants with keyword same as searcText
const _searchUrl = (searchText, latitude, longitude) => {
  const params = {
    location: `${latitude},${longitude}`,
    radius: `2000`,
    type: 'restaurant',
    keyword: encodeURIComponent(searchText),
    key: GOOGLE_API_KEY,
  };
  return `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${objSerializer(
    params,
  )}`;
};

//TODO: Add description of the function
const searchNearbyPlace = searchText => {
  return new Promise(async (resolve, reject) => {
    try {
      const coords = await _getCoordinates();
      const url = _searchUrl(searchText, coords.latitude, coords.longitude);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const jsonResponse = await response.json();

      // Nearby search response
      resolve(jsonResponse.results[0]);

      // Place search response
      // resolve(jsonResponse.candidates[0].place_id);
    } catch (error) {
      reject(`Place Search ERROR: ${error}`);
    }
  });
};

export default searchNearbyPlace;
