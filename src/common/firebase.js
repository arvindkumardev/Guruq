import messaging from '@react-native-firebase/messaging';
import inAppMessaging from '@react-native-firebase/in-app-messaging';

const registerForInAppMessages = async () => {
  await inAppMessaging().setMessagesDisplaySuppressed(true);
};
const registerAppWithFCM = async () => {
  await messaging().registerDeviceForRemoteMessages();
};
const onMessage = () => {
  console.log('ON MESSAGE EVENT REGISTER');
  messaging().onMessage(async (remoteMessage) => {
    console.log('ON MESSAGE TRIGGERRED', remoteMessage);
    // console.log('remoteMessage forground', remoteMessage);
    // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    // PushNotification.localNotification({
    //   title: 'notification.title',
    //   message: 'notification.body!',
    // });
  });
};
const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission({
    alert: true,
    announcement: false,
    badge: true,
    carPlay: true,
    provisional: false,
    sound: true,
  });
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) {
    await messaging().registerDeviceForRemoteMessages();
  } else {
    console.log('User declined messaging permissions :(');
  }
};
const getFcmToken = async () => {
  const fcmToken = await messaging().getToken();
  console.log(`firebase token ${fcmToken}`);
  return fcmToken || null;
};

const initializeNotification = () => {
  registerAppWithFCM();
  onMessage();
};
const firebaseConfig = {
  apiKey: 'AIzaSyBvF_tvwaEQF_qK91EuSeodOC4f6hTBiPk',
  authDomain: 'guruq-dev-207df.firebaseapp.com',
  databaseURL: 'https://guruq-dev-207df.firebaseio.com',
  projectId: 'guruq-dev-207df',
  storageBucket: 'guruq-dev-207df.appspot.com',
  messagingSenderId: '624385656193',
  appId: '1:624385656193:ios:60232ea6f1a68a654a1480',
};

// const getNotificationScreen = (notificationData, navigation) => {
//   let navData = {};
//   if (notificationData) {
//     const payload = notificationData.data;
//     navData = {
//       from: 'notification',
//       request_type: payload && payload.detail_type ? payload.detail_type : 'null',
//       type: payload && payload.detail_type ? payload.detail_type : 'null',
//       title: payload && payload.title ? payload.title : 'Sales Approval',
//       data: payload,
//     };
//     if (payload.detail_type !== 'iom') {
//       navigation.navigate(getScreenNameByID(navData.type), navData);
//     } else {
//       navData = {
//         from: 'notification',
//         request_type: 'iom',
//         type: payload && payload.detail_type ? payload.detail_type : 'null',
//         title: 'IOM',
//         data: payload,
//       };
//       navigation.navigate('IOM_DETAILS_SCREEN', navData);
//     }
//   }
// };
export { initializeNotification, requestUserPermission, getFcmToken, registerAppWithFCM, firebaseConfig };
