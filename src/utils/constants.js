import * as DeviceInfo from 'react-native-device-info';

export const APP_VERSION_IOS = DeviceInfo.getVersion();

export const APP_VERSION_ANDROID = DeviceInfo.getVersion();

export const STANDARD_SCREEN_SIZE = 812;

export const STANDARD_SCREEN_DIMENSIONS = { height: 812, width: 375 };

export const ANDROID_PACKAGE_NAME = 'in.guruq';

export const AUTH_TOKEN = 'AUTH_TOKEN';

export const LOCAL_STORAGE_DATA_KEY = {
  USER_TOKEN: 'userToken',
  ONBOARDING_SHOWN: 'onboarding_shown',
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
};

export const inputs = {};

export const IND_COUNTRY_OBJ = {
  dialCode: '91',
  iso2: 'in',
  name: 'India',
  nationality: 'IN',
  mobileCode: 'India: 0091',
};

export const LOTTIE_JSON_FILES = {
  loaderJson: require('../assets/json/loader1.json'),
};
