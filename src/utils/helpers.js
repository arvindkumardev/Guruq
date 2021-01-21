/* eslint-disable no-const-assign */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import AsyncStorage from '@react-native-community/async-storage';
import { Alert, Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment';
import { isEmpty, isNumber, isUndefined, startCase } from 'lodash';
import { parsePhoneNumberFromString as parseMobile } from 'libphonenumber-js/mobile';
import Images from '../theme/images';
import { ATTACHMENT_PREVIEW_URL, IMAGES_URL, LOCAL_STORAGE_DATA_KEY, STANDARD_SCREEN_DIMENSIONS } from './constants';
import 'intl';
import {
  interestingOfferingData,
  isLoggedIn,
  isSplashScreenVisible,
  isTokenLoading,
  networkConnectivityError,
  notificationPayload,
  studentDetails,
  tutorDetails,
  userDetails,
  userLocation,
  userType,
} from '../apollo/cache';
import initializeApollo from '../apollo/apollo';

const countryData = require('../components/NationalityDropdown/country/countries.json');

export const storeData = async (key, value) => {
  try {
    let v = value;
    if (typeof value !== 'string') {
      v = JSON.stringify(value);
    }
    await AsyncStorage.setItem(key, v);
  } catch (e) {}
};

export const getSaveData = async (key) => await AsyncStorage.getItem(key);

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // clear error
  }
};

export const getToken = async () => {
  const token = await AsyncStorage.getItem(LOCAL_STORAGE_DATA_KEY.USER_TOKEN);
  return token;
};

export const removeToken = async () => {
  removeData(LOCAL_STORAGE_DATA_KEY.USER_TOKEN);
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

export const isValidEmail = (str) => /^([a-zA-Z0-9_+\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(str);

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

export const getFileUrl = (filename) => {
  return filename && filename.startsWith('images/tutordoc')
    ? `${IMAGES_URL}/${filename}`
    : `${ATTACHMENT_PREVIEW_URL}${filename}`;
};

export const alertBox = (
  alertTitle = '',
  alertMsg = '',
  config = {
    positiveText: 'OK',
    cancelable: true,
  }
) => {
  let configuration = [
    {
      text: config.positiveText, // Key to show string like "Ok" etc. i.e. positive response text
      onPress: config.onPositiveClick, // Key that contains function that executes on click of above text button
    },
  ];
  if (config.middleText && !isEmpty(config.middleText)) {
    configuration = [
      ...configuration,
      {
        text: config.middleText, // Key to show string like "Cancel" etc. i.e. negative response text
        onPress: config.onMiddleClick, // Key that contains function that executes on click of above text button
      },
    ];
  }
  if (config.negativeText && !isEmpty(config.negativeText)) {
    configuration = [
      ...configuration,
      {
        text: config.negativeText, // Key to show string like "Cancel" etc. i.e. negative response text
        onPress: config.onNegativeClick, // Key that contains function that executes on click of above text button
        style: 'destructive',
      },
    ];
  }
  Alert.alert(alertTitle, alertMsg, configuration, { cancelable: config.cancelable });
};

export const comingSoonAlert = () => alertBox('Coming Soon');

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

export const getSubjectIcons = (name, disabled = false) => {
  let iconName = name.toLowerCase().replace(' ', '_');

  if (disabled) {
    iconName += '_gray';
  }
  return Images[iconName] ? Images[iconName] : Images.english;
};

export const formatDate = (date, format) => {
  return moment(date).format(format);
};

export const convertDateTime = (date) => {
  return `${moment(date).format('YYYY-MM-DDTHH:mm:00')}Z`;
};

export const printYear = (date) => {
  return formatDate(date, 'YYYY');
};
export const printDate = (date) => {
  return formatDate(date, 'MMM DD, YYYY');
};
export const printDateTime = (date) => {
  return formatDate(date, 'MMM DD, YYYY - hh:mm a');
};

export const printTime = (date) => {
  return formatDate(date, 'hh:mm a');
};

export const print24Time = (date) => {
  return formatDate(date, 'HH:mm');
};
export const print24TimeWithTimeZone = (date) => {
  return formatDate(date, 'HH:mmZ');
};

export const startOfDay = (date) => {
  return `${moment(date).format('YYYY-MM-DDT00:00:00')}Z`;
};

export const endOfDay = (date) => {
  return `${moment(date).format('YYYY-MM-DDT23:59:59')}Z`;
};

export const isValidMobile = (mobileObject) => {
  if (!isEmpty(mobileObject) && !isUndefined(mobileObject)) {
    const parsedMobile = parseMobile(`+${mobileObject.country.dialCode}${mobileObject.mobile}`);
    return !isUndefined(parsedMobile) ? parsedMobile.isValid() : false;
  }
  return false;
};

export const getCountryObj = (dialCode) => {
  return countryData.find((item) => item.dialCode === dialCode);
};

export const createPayload = async (user, token) => {
  const payload = {
    userId: user?.id,
    userType: user?.type,
    deviceId: DeviceInfo.getDeviceId(),
    deviceToken: token,
    buildVersion: DeviceInfo.getBuildNumber(),
    deviceModel: DeviceInfo.getModel(),
    deviceManufacture: await DeviceInfo.getManufacturer(),
    deviceOSVersion: DeviceInfo.getSystemVersion(),
    wifiMACAddress: await DeviceInfo.getMacAddress(),
    batterInfo: await DeviceInfo.getBatteryLevel().toString(),
    storageInfo: await DeviceInfo.getTotalDiskCapacity().toString(),
    ramInfo: await DeviceInfo.getTotalMemory().toString(),
    networkInfo: await DeviceInfo.getIpAddress(),
  };
  return Promise.resolve(payload);
};

export const getFullName = (contactDetail) => {
  return contactDetail ? `${contactDetail?.firstName} ${contactDetail?.lastName}` : '';
};

export const getNameInitials = (contactDetails) => {
  const names = getFullName(contactDetails).split(' ');
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};
export const printCurrency = (number) => {
  return number;
  // return parseFloat(String(number)).toFixed(2);
  // return new Intl.NumberFormat('en-IN', { currency: 'INR' }).format(number);
};

export const enumLabelToText = (label) => {
  return startCase(label.replace('_', ' ').toLowerCase());
};

export const logout = () => {
  removeToken().then(() => {
    isTokenLoading(true);
    isLoggedIn(false);
    isSplashScreenVisible(true);
    userType('');
    networkConnectivityError(false);
    userDetails({});
    studentDetails({});
    tutorDetails({});
    userLocation({});
    interestingOfferingData([]);
    notificationPayload({});
  });

  clearAllLocalStorage(); // .then(() => {
  initializeApollo().resetStore(); // .then(() => {});
};

export const processGeoData = (geoData) => {
  const latitude = geoData.geometry && geoData.geometry.location ? geoData.geometry.location.lat : 0;
  const longitude = geoData.geometry && geoData.geometry.location ? geoData.geometry.location.lng : 0;

  const { long_name: country } = geoData.address_components.find((comp) => comp.types.includes('country')) || '';

  const { long_name: state } =
    geoData.address_components.find((comp) => comp.types.includes('administrative_area_level_1')) || '';

  const { long_name: city } =
    geoData.address_components.find((comp) => comp.types.includes('locality')) ||
    geoData.address_components.find((comp) => comp.types.includes('administrative_area_level_2')) ||
    '';

  const { long_name: region } =
    geoData.address_components.find((comp) => comp.types.includes('sublocality_level_1')) || '';

  const { long_name: areaT } =
    geoData.address_components.find((comp) => comp.types.includes('sublocality_level_2')) || '';

  const subArea = [];
  if (region) {
    subArea.push(region);
  }
  if (areaT) {
    subArea.push(areaT);
  }

  const { long_name: postalCode } = geoData.address_components.find((comp) => comp.types.includes('postal_code')) || '';

  return {
    fullAddress: geoData.formatted_address,
    country,
    state,
    city,
    subArea: subArea.join(', '),
    postalCode: isUndefined(postalCode) ? '' : postalCode,
    latitude,
    longitude,
  };
};

export const passwordPolicy = (pass) => {
  const alphaRegex = /\w+/;
  const numericRegex = /\d+/;
  return pass.length >= 8 && numericRegex.test(pass) && alphaRegex.test(pass);
};
