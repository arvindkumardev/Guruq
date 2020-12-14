import messaging from '@react-native-firebase/messaging';
import inAppMessaging from '@react-native-firebase/in-app-messaging';

const registerForInAppMessages = async () => {
  await inAppMessaging().setMessagesDisplaySuppressed(true);
};
const registerAppWithFCM = async () => {
  await messaging().registerDeviceForRemoteMessages();
};
const onMessage = () => {
  messaging().onMessage(async (remoteMessage) => {
    console.log('ON MESSAGE TRIGGERRED', remoteMessage);
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
  return fcmToken || null;
};
const initializeNotification = () => {
  registerAppWithFCM();
};
export { initializeNotification, requestUserPermission, getFcmToken, registerAppWithFCM };
