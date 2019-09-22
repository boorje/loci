const objSerializer = obj => {
  return Object.entries(obj)
    .map(
      ([key, val]) =>
        `${encodeURIComponent(obj[key])}=${encodeURIComponent(obj[val])}`,
    )
    .join('&');
};

export default objSerializer;
