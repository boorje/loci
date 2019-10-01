import AsyncStorage from '@react-native-community/async-storage';

/**
 * Returns true/false if the place exists in the BOOKMARKED storage or not
 * @param {String} unique // place_id
 * @returns {Array}
 */
export const existsInStorage = async unique => {
  try {
    const storage = await JSON.parse(await AsyncStorage.getItem('BOOKMARKED'));
    if (storage !== null) {
      const {BOOKMARKED} = storage;
      if (BOOKMARKED !== null) {
        if (BOOKMARKED.length > 0) {
          return BOOKMARKED.some(place => {
            return place.place_id === unique;
          });
        }
      }
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const addObjToStorage = async obj => {
  const storageKey = 'BOOKMARKED';
  if (await existsInStorage(obj.place_id)) {
    throw 'The place already exists in the storage';
  }
  const storage = await JSON.parse(await AsyncStorage.getItem(storageKey));
  if (storage !== null) {
    const {BOOKMARKED} = storage;
    const updatedStorage = [...BOOKMARKED];
    updatedStorage.push(obj);
    await AsyncStorage.setItem(
      storageKey,
      JSON.stringify({BOOKMARKED: updatedStorage}),
    );
  } else {
    await AsyncStorage.setItem(storageKey, JSON.stringify({BOOKMARKED: [obj]}));
  }
};

export const getStorageItems = async () => {
  const storage = await AsyncStorage.getItem('BOOKMARKED');
  if (storage !== null) {
    return await JSON.parse(storage);
  } else {
    return null;
  }
};

export const removeObjFromStorage = async place_id => {
  const exists = existsInStorage(place_id);
  if (!exists) {
    throw "The item doesn't exist in storage";
  } else {
    const storage = await JSON.parse(await AsyncStorage.getItem('BOOKMARKED'));
    const updatedStorage = storage.BOOKMARKED.filter(place => {
      return place.place_id !== place_id;
    });
    await AsyncStorage.setItem(
      'BOOKMARKED',
      JSON.stringify({BOOKMARKED: updatedStorage}),
    );
  }
};
