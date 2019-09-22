const objSerializer = obj => {
  return Object.keys(obj)
    .map(key => {
      return key + '=' + obj[key];
    })
    .join('&');
};

export default objSerializer;
