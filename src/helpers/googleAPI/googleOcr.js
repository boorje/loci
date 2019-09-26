import {GOOGLE_API_KEY} from '../../constants/apiKeys';

/**
 * Connects to the Google Vision API to search for text in an image
 *
 * @param {base64} base64 The image to search for text in
 * @returns {string}
 */
const googleOcr = async base64 => {
  return new Promise(async (resolve, reject) => {
    try {
      const body = {
        requests: [
          {
            image: {content: base64},
            features: [
              {type: 'TEXT_DETECTION', maxResults: 20},
              {type: 'DOCUMENT_TEXT_DETECTION', maxResults: 20},
            ],
          },
        ],
      };
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
      );
      const responseJson = await response.json();
      resolve(responseJson.responses[0].textAnnotations[0].description);
    } catch (error) {
      reject('Could not detect any text in the photo');
    }
  });
};

export default googleOcr;
