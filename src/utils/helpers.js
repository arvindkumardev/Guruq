/* eslint-disable no-const-assign */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import AsyncStorage from '@react-native-community/async-storage';
import { isEmpty, isNumber } from 'lodash';
import { Alert, Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment';
import Images from '../theme/images';
import SubjectIcons from '../theme/subjectIcons';
import { LOCAL_STORAGE_DATA_KEY, STANDARD_SCREEN_DIMENSIONS } from './constants';

let token;

export const storeData = async (key, value) => {
  try {
    let v = value;
    if (typeof value !== 'string') {
      v = JSON.stringify(value);
    }
    await AsyncStorage.setItem(key, v);
  } catch (e) {}
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

export const getFileUrl = (filename) => `https://guruq.in/api/${filename}`;
export const getUserImageUrl = (filename, gender, id) => {
  return filename
    ? `https://guruq.in/api/${filename}`
    : `https://guruq.in/guruq-new/images/avatars/${gender === 'MALE' ? 'm' : 'f'}${id % 4}.png`;
};

export const getTutorImage = (tutorObj) =>
  getUserImageUrl(tutorObj?.profileImage?.filename, tutorObj?.contactDetail?.gender, tutorObj.id);

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

export const getSubjectIcons = (name) => {
  // let icon = '';
  // switch (name) {
  //   case 'Accounts':
  //     icon = SubjectIcons.accounts;
  //     break;
  //   case 'Accountancy':
  //     icon = SubjectIcons.accountancy;
  //     break;
  //   case 'Chemistry':
  //     icon = SubjectIcons.chemistry;
  //     break;
  //   case 'Civics':
  //     icon = SubjectIcons.civics;
  //     break;
  //   case 'Computer Science':
  //     icon = SubjectIcons.computer_science;
  //     break;
  //   case 'Biology':
  //     icon = SubjectIcons.biology;
  //     break;
  //   case 'Business Studies':
  //     icon = SubjectIcons.business_studies;
  //     break;
  //   case 'Hindi':
  //     icon = SubjectIcons.hindi;
  //     break;
  //   case 'Geography':
  //     icon = SubjectIcons.geography;
  //     break;
  //   case 'English':
  //     icon = SubjectIcons.english;
  //     break;
  //   case 'Engineering':
  //     icon = SubjectIcons.engineering;
  //     break;
  //   case 'Economics':
  //     icon = SubjectIcons.economics;
  //     break;
  //   case 'History':
  //     icon = SubjectIcons.history;
  //     break;
  //   case 'Law':
  //     icon = SubjectIcons.law;
  //     break;
  //   case 'Mathematics':
  //     icon = SubjectIcons.maths;
  //     break;
  //   case 'Medical':
  //     icon = SubjectIcons.medical;
  //     break;
  //   case 'Physical Education':
  //     icon = SubjectIcons.physical_education;
  //     break;
  //   case 'Sociology':
  //     icon = SubjectIcons.sociology;
  //     break;
  //   case 'Sanskrit':
  //     icon = SubjectIcons.sanskrit;
  //     break;
  //   case 'Spanish':
  //     icon = SubjectIcons.spanish;
  //     break;
  //   case 'Russian':
  //     icon = SubjectIcons.russian;
  //     break;
  //   case 'French':
  //     icon = SubjectIcons.french;
  //     break;
  //   case 'German':
  //     icon = SubjectIcons.german;
  //     break;
  //   case 'Chinese':
  //     icon = SubjectIcons.chinese;
  //     break;
  //   case 'Psychology':
  //     icon = SubjectIcons.psychology;
  //     break;
  //   case 'Political Science':
  //     icon = SubjectIcons.political_science;
  //     break;
  //   case 'Physics':
  //     icon = SubjectIcons.physics;
  //     break;
  //   case 'ssc-govt':
  //     icon = SubjectIcons.ssc_govt;
  //     break;
  //   default:
  //     icon = Images.book;
  // }
  return Images[name.toLowerCase().replace(' ', '_')] ? Images[name.toLowerCase().replace(' ', '_')] : Images.english;
};

export const formatDate = (date, format) => {
  return moment(date).format(format);
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

export const startOfDay = (date) => {
  return `${moment(date).format('YYYY-MM-DDT00:00:00')}Z`;
};

export const endOfDay = (date) => {
  return `${moment(date).format('YYYY-MM-DDT23:59:59')}Z`;
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
