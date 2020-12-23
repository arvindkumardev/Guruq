import AsyncStorage from '@react-native-community/async-storage';
// import { firebase } from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { createStackNavigator } from '@react-navigation/stack';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import { notificationPayload, tutorDetails } from '../apollo/cache';
import { getFcmToken, initializeNotification, requestUserPermission } from '../common/firebase';
import { UserTypeEnum } from '../common/userType.enum';
import EnterPassword from '../containers/common/login/enterPassword';
import Login from '../containers/common/login/login';
import OtpVerification from '../containers/common/login/otpVerification';
import SetPassword from '../containers/common/login/setPassword';
import SignUp from '../containers/common/login/signUp';
import GettingStarted from '../containers/common/onboarding/gettingStarted';
import SplashScreen from '../containers/common/splashScreen/splashScreen';
import UserTypeSelector from '../containers/common/userTypeSelector/userTypeSelector';
import { LOCAL_STORAGE_DATA_KEY } from '../utils/constants';
import NavigationRouteNames from './screenNames';
import { getStudentRoutes } from './studentAppRoutes';
import { getTutorRoutes } from './tutorAppRoutes';
import { TutorCertificationStageEnum } from '../containers/tutor/enums';
import CertificationCompletedView from '../containers/tutor/certficationProcess/certificationCompletedView';
import WebViewPage from '../components/WebViewPage';
import InterviewPending from '../containers/tutor/interviewPending/interviewPending';

const Stack = createStackNavigator();

const AppStack = (props) => {
  const { isUserLoggedIn, userType, showSplashScreen } = props;
  const [isGettingStartedVisible, setIsGettingStartedVisible] = useState(true);
  const tutorInfo = useReactiveVar(tutorDetails);

  useEffect(() => {
    AsyncStorage.getItem(LOCAL_STORAGE_DATA_KEY.ONBOARDING_SHOWN).then((val) => {
      setIsGettingStartedVisible(isEmpty(val));
    });
  }, []);

  useEffect(() => {
    // firebase.initializeApp(firebaseConfig);
    getFcmToken();
    requestUserPermission();
    initializeNotification();
    // notificationPayload({
    //   screen: 'tutor_detail',
    //   tutor_id: 38480,
    //   offering_id: 249,
    // });
    messaging().onNotificationOpenedApp((remoteMessage) => {
      if (!isEmpty(remoteMessage) && !isEmpty(remoteMessage.data)) {
        notificationPayload(remoteMessage.data);
      }
    });
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (!isEmpty(remoteMessage) && !isEmpty(remoteMessage.data)) {
          notificationPayload(remoteMessage.data);
        }
      });
  }, []);

  const getLoggedInRoutes = () => {
    if (userType === UserTypeEnum.OTHER.label) {
      return (
        <>
          <Stack.Screen
            name={NavigationRouteNames.USER_TYPE_SELECTOR}
            component={UserTypeSelector}
            options={{ headerShown: false }}
          />
        </>
      );
    }
    if (userType === UserTypeEnum.STUDENT.label) {
      return getStudentRoutes();
    }
    if (userType === UserTypeEnum.TUTOR.label) {
      if (tutorInfo && tutorInfo?.certified) {
        // return getTutorRoutes();
        return (
          <>
            <Stack.Screen
              name={NavigationRouteNames.TUTOR.SCHEDULE_YOUR_INTERVIEW}
              component={InterviewPending}
              options={{ headerShown: false }}
            />
          </>
        );
      }
      if (tutorInfo && tutorInfo?.lead?.certificationStage === TutorCertificationStageEnum.INTERVIEW_PENDING) {
        return (
          <>
            <Stack.Screen
              name={NavigationRouteNames.TUTOR.SCHEDULE_YOUR_INTERVIEW}
              component={InterviewPending}
              options={{ headerShown: false }}
            />
          </>
        );
      }
      if (
        tutorInfo &&
        tutorInfo?.lead?.certificationStage === TutorCertificationStageEnum.CERTIFICATION_PROCESS_COMPLETED
      ) {
        return (
          <>
            <Stack.Screen
              name={NavigationRouteNames.TUTOR.CERTIFICATION_COMPLETED_VIEW}
              component={CertificationCompletedView}
              options={{ headerShown: false }}
            />
          </>
        );
      }
      return (
        <>
          <Stack.Screen name={NavigationRouteNames.WEB_VIEW} component={WebViewPage} options={{ headerShown: false }} />
        </>
      );
    }
  };

  return (
    <Stack.Navigator>
      {isUserLoggedIn && !isEmpty(userType) ? (
        getLoggedInRoutes()
      ) : (
        <>
          {showSplashScreen && (
            <Stack.Screen
              name={NavigationRouteNames.SPLASH_SCREEN}
              component={SplashScreen}
              options={{ headerShown: false }}
            />
          )}
          {isGettingStartedVisible && (
            <Stack.Screen
              name={NavigationRouteNames.GETTING_STARTED}
              component={GettingStarted}
              options={{ headerShown: false }}
            />
          )}
          <Stack.Screen name={NavigationRouteNames.LOGIN} component={Login} options={{ headerShown: false }} />
          <Stack.Screen
            name={NavigationRouteNames.ENTER_PASSWORD}
            component={EnterPassword}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={NavigationRouteNames.OTP_VERIFICATION}
            component={OtpVerification}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={NavigationRouteNames.SET_PASSWORD}
            component={SetPassword}
            options={{ headerShown: false }}
          />
          <Stack.Screen name={NavigationRouteNames.REGISTER} component={SignUp} options={{ headerShown: false }} />
          <Stack.Screen
            name={NavigationRouteNames.USER_TYPE_SELECTOR}
            component={UserTypeSelector}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
export default AppStack;
