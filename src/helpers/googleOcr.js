const API_KEY = 'AIzaSyAYPaCMmMOX01VVMJM4agBEDHKLy8I6ISU';

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
        `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
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
      reject(`Google OCR ERROR: ${error}`);
    }
  });
};

export default googleOcr;
