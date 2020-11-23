import AsyncStorage from '@react-native-community/async-storage';
import { isNumber } from 'lodash';
import { Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { LOCAL_STORAGE_DATA_KEY, STANDARD_SCREEN_DIMENSIONS } from './constants';

let token;

export const storeData = async (key, value) => {
  try {
    let v = value;
    if (typeof value !== 'string') {
      v = JSON.stringify(value);
    }
    await AsyncStorage.setItem(key, v);
  } catch (e) {
    throw e;
  }
};

export const getSaveData = async (key) => {
  const data = await AsyncStorage.getItem(key);
  return data;
};

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // clear error
  }
};

export const getToken = async () => {
  if (token) {
    return Promise.resolve(token);
  }

  token = await AsyncStorage.getItem(LOCAL_STORAGE_DATA_KEY.USER_TOKEN);
  return token;
};

export const removeToken = async () => {
  removeData(LOCAL_STORAGE_DATA_KEY.USER_TOKEN);
  token = null;
};

export const clearAllLocalStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // clear error
  }
};

export const getImageSource = (imagePath) => (isNumber(imagePath) ? imagePath : { uri: imagePath });

export const isPortrait = () => {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
};

export const isLandscape = () => {
  const dim = Dimensions.get('screen');
  return dim.width >= dim.height;
};

export const deviceWidth = () => {
  const dim = Dimensions.get('window');
  return dim.width;
};

export const deviceHeight = () => {
  const dim = Dimensions.get('window');
  return dim.height;
};

export const RfW = (value) => {
  const dim = Dimensions.get('window');
  return dim.width * (value / STANDARD_SCREEN_DIMENSIONS.width);
};

export const RfH = (value) => {
  const dim = Dimensions.get('window');
  return dim.height * (value / STANDARD_SCREEN_DIMENSIONS.height);
};

export const isIntegerString = (str) => /^\+?(0|[1-9]\d*)$/.test(str);

export const isValidEmail = (str) => /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(str);

export const isDisplayWithNotch = () => DeviceInfo.hasNotch();

export const tConv24 = (time24) => {
  let ts = time24;
  const H = +ts.substr(0, 2);
  let h = H % 12 || 12;
  h = h < 10 ? `0${h}` : h;
  const ampm = H < 12 ? ' AM' : ' PM';
  ts = h + ampm;
  return ts;
};

export const titleCaseIfExists = (inputString) => {
  if (!inputString) {
    return '';
  }
  const str = inputString.toLowerCase().split(/[ -]/g);
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(' ').trim();
};

export const getTutorImage = (tutor) => {
  return tutor && tutor.profileImage && tutor.profileImage.filename
    ? { uri: `https://guruq.in/api/${tutor?.profileImage?.filename}` }
    : {
        uri: `https://guruq.in/guruq-new/images/avatars/${tutor?.contactDetail?.gender === 'MALE' ? 'm' : 'f'}${
          tutor.id % 4
        }.png`,
      };
};

export const getTutorImageUrl = (tutor) => {
  return tutor && tutor.profileImage && tutor.profileImage.filename
    ? `https://guruq.in/api/${tutor?.profileImage?.filename}`
    : `https://guruq.in/guruq-new/images/avatars/${tutor?.contactDetail?.gender === 'MALE' ? 'm' : 'f'}${
        tutor.id % 4
      }.png`;
};

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
