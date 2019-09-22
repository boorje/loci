import {GOOGLE_API_KEY} from '../constants/apiKeys';

const slugifySearchText = searchText => searchText.replace(' ', '%20');

const placeSearchGMP = async searchText => {
  const slugText = slugifySearchText(searchText);
  const fields = 'place_id';
  const parameters = `input=${slugText}&inputtype=textquery&fields=${fields}&key=${GOOGLE_API_KEY}`;
  const GMP_URL = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?${parameters}`;

  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(GMP_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const jsonResponse = await response.json();
      resolve(jsonResponse.candidates[0].place_id);
    } catch (error) {
      reject(`Place Search ERROR: ${error}`);
    }
  });
};

export default placeSearchGMP;

/** RETURNS
Object {
  "candidates": Array [
    Object {
      "place_id": "ChIJRVLEVO_GhkcR7ZgniDNTarg",
    },
  ],
  "status": "OK",
}
 */
