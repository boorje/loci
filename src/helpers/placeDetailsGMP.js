const placeDetailsGMP = async placeId => {
  const GMP_API_KEY = 'AIzaSyAYPaCMmMOX01VVMJM4agBEDHKLy8I6ISU';
  const fields = 'name,photo,type,price_level,rating,review,user_ratings_total';
  const parameters = `place_id=${placeId}&fields=${fields}&key=${GMP_API_KEY}`;
  const GMP_URL = `https://maps.googleapis.com/maps/api/place/details/json?${parameters}`;

  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(GMP_URL, {
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
