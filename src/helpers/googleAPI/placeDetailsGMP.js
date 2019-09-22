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

//TODO: Add description of the function
const placeDetailsGMP = async placeId => {
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
      resolve(response.json());
    } catch (error) {
      reject(`Place Details ERROR: ${error}`);
    }
  });
};

export default placeDetailsGMP;
