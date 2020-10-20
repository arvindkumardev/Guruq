import AsyncStorage from '@react-native-community/async-storage';
import { isNumber } from 'lodash';
import { Alert, Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { ANDROID_PACKAGE_NAME, LOCAL_STORAGE_DATA_KEY, STANDARD_SCREEN_DIMENSIONS } from './constants';

export const storeData = async (key, value) => {
  try {
    let v = value;
    if (typeof (value) !== 'string') {
      v = JSON.stringify(value);
    }
    await AsyncStorage.setItem(key, v);
  } catch (e) {
    throw e;
  }
};

export const getSaveData = async (key) => await AsyncStorage.getItem(key);

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // clear error
  }
};

export const clearAll = async () => {
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

export const isIntegerString = (str) => (/^\+?(0|[1-9]\d*)$/.test(str));

export const isValidEmail = (str) => (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(str));

export const isDisplayWithNotch = () => (DeviceInfo.hasNotch());

export const tConv24 = (time24) => {
  let ts = time24;
  const H = +ts.substr(0, 2);
  let h = (H % 12) || 12;
  h = (h < 10) ? (`0${h}`) : h;
  const ampm = H < 12 ? ' AM' : ' PM';
  ts = h + ampm;
  return ts;
};
