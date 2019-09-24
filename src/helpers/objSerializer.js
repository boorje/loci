/**
 * Takes a object and returns the key/value as url queries
 *
 * @param {object} obj The object to convert to url
 */
const objSerializer = obj => {
  return Object.keys(obj)
    .map(key => {
      return key + '=' + obj[key];
    })
    .join('&');
};

export default objSerializer;
