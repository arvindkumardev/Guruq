/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { isEmpty } from 'lodash';

import App from './src/app';
import { saveNotificationPayload } from './src/common/firebase';
import { name as appName } from './app.json';
// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  if (!isEmpty(remoteMessage) && !isEmpty(remoteMessage.notification)) {
    saveNotificationPayload(remoteMessage);
  }
  console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
