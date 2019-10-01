import {GOOGLE_API_KEY} from '../../constants/apiKeys';
import objSerializer from '../objSerializer';

const _encodeURL = photo_reference => {
  const params = {
    photo_reference,
    maxheight: 400,
    key: GOOGLE_API_KEY,
  };
  return `https://maps.googleapis.com/maps/api/place/photo?${objSerializer(
    params,
  )}`;
};

/**
 * Returns the photo of the
 *
 * @param {String} photoRef The photo_reference to fetch
 * @returns {String} url to the photo
 */
const getPlacePhotos = async photoRef => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = _encodeURL(photoRef);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      resolve(response.url);
    } catch (error) {
      reject('Could not find the photo');
    }
  });
};

export default getPlacePhotos;
