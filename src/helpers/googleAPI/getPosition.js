import Geolocation from '@react-native-community/geolocation';

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
