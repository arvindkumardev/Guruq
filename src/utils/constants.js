import {Platform} from 'react-native';
import * as DeviceInfo from 'react-native-device-info';

export const  APP_VERSION_IOS = DeviceInfo.getVersion();

export const  APP_VERSION_ANDROID = DeviceInfo.getVersion();

export const STANDARD_SCREEN_SIZE = 812;

export const STANDARD_SCREEN_DIMENSIONS = {height:812, width:375};

export const ANDROID_PACKAGE_NAME = 'com.guruq';

export const LOCAL_STORAGE_DATA_KEY = {
    
};