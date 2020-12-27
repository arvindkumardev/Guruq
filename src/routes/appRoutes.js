import AsyncStorage from '@react-native-community/async-storage';
// import { firebase } from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { createStackNavigator } from '@react-navigation/stack';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useMutation, useReactiveVar } from '@apollo/client';
import { Alert } from 'react-native';
import { notificationPayload, tutorDetails, userDetails } from '../apollo/cache';
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
import Address from '../containers/common/profileScreens/address';
import { REGISTER_DEVICE } from '../containers/common/graphql-mutation';
import { DUPLICATE_FOUND } from '../common/errorCodes';
import { alertBox, createPayload } from '../utils/helpers';

const Stack = createStackNavigator();

const AppStack = (props) => {
  const { isUserLoggedIn, userType, showSplashScreen } = props;
  const [isGettingStartedVisible, setIsGettingStartedVisible] = useState(true);
  const tutorInfo = useReactiveVar(tutorDetails);

  console.log("tutorInfo",tutorInfo)

  const userDetailsObj = useReactiveVar(userDetails);

  useEffect(() => {
    AsyncStorage.getItem(LOCAL_STORAGE_DATA_KEY.ONBOARDING_SHOWN).then((val) => {
      setIsGettingStartedVisible(isEmpty(val));
    });
  }, []);

  const [registerDevice, { loading: scheduleLoading }] = useMutation(REGISTER_DEVICE, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      // if (e.graphQLErrors && e.graphQLErrors.length > 0) {
      //   const error = e.graphQLErrors[0].extensions.exception.response;
      //   if (error.errorCode === DUPLICATE_FOUND) {
      //     Alert.alert(error.message);
      //   }
      // }
    },
    onCompleted: (data) => {
      if (data) {
        console.log(data);
      }
    },
  });

  useEffect(() => {
    if (!isEmpty(userDetailsObj)) {
      console.log("userDetailsObj",userDetailsObj)
      getFcmToken().then((token) => {
        if (token) {
          createPayload(userDetailsObj.me, token).then((payload) => {
            registerDevice({ variables: { deviceDto: payload } });
          });
        }
      });
    }
  }, [userDetailsObj]);

  useEffect(() => {
    getFcmToken().then((token) => {
      if (token) {
        createPayload(userDetailsObj.me, token).then((payload) => {
          registerDevice({ variables: { deviceDto: payload } });
        });
      }
    });
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
      console.log("tutorInfo",tutorInfo)
      if (tutorInfo && tutorInfo.certified) {
        return getTutorRoutes();
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

      if (tutorInfo && tutorInfo?.lead?.certificationStage !== TutorCertificationStageEnum.INTERVIEW_PENDING) {
        return (
          <>
            <Stack.Screen
              name={NavigationRouteNames.WEB_VIEW}
              component={WebViewPage}
              options={{
                url: `http://dashboardv2.guruq.in/tutor/on-boarding`,
                label: 'Tutor Certification Process',
                headerShown: false,
              }}
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
          <Stack.Screen name={NavigationRouteNames.ADDRESS} component={Address} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
};
export default AppStack;
