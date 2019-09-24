import Geolocation from '@react-native-community/geolocation';

/**
 * Returns the current position (lat,long) of the user if found
 * @returns {object}
 */
export default () => {
  const geoOptions = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 1000,
  };
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(resolve, reject, geoOptions);
  });
};
