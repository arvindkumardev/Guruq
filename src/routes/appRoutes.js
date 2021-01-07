import AsyncStorage from '@react-native-community/async-storage';
// import { firebase } from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { createStackNavigator } from '@react-navigation/stack';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';

import { useMutation, useReactiveVar } from '@apollo/client';
import { notificationPayload, notificationsList, tutorDetails, userDetails } from '../apollo/cache';
import {
  getFcmToken,
  initializeNotification,
  requestUserPermission,
  saveNotificationPayload,
} from '../common/firebase';
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
import WebViewPage from '../components/WebViewPage';
import UploadDocuments from '../containers/certficationProcess/uploadDocuments';
import AddressListing from '../containers/address/addressListing';
import { REGISTER_DEVICE } from '../containers/common/graphql-mutation';
import { createPayload } from '../utils/helpers';

import scheduledClassDetails from '../containers/calendar/scheduledClassDetails';
import cancelReason from '../containers/calendar/cancelReason';
import MyClasses from '../containers/myClasses/classes';
import scheduleClass from '../containers/myClasses/scheduleClass';
import CalendarView from '../containers/calendar/calendarView';
import AddEditAddress from '../containers/address/addEditAddress';
import AddressMapView from '../containers/common/profileScreens/addressMapView';
import EducationListing from '../containers/education/educationListing';
import AddEditEducation from '../containers/education/addEditEducation';
import AwardListing from '../containers/awards/awardListing';
import AddEditAward from '../containers/awards/addEditAward';
import TutorWelcomeScreen from '../containers/certficationProcess/tutorWelcomeScreen';
import CertificationProcessSteps from '../containers/certficationProcess/certificationProcessSteps';
import SubjectSelection from '../containers/tutor/mySubjects/subjectSelection';
import PtStartScreen from '../containers/certficationProcess/ptStartScreen';
import ProficiencyTest from '../containers/tutor/proficiencyTest';
import PersonalDetails from '../containers/common/profileScreens/personalInformation/personalDetails';
import CompleteYourProfile from '../containers/certficationProcess/completeYourProfile';
import ExperienceListing from '../containers/experience/experienceListing';
import AddEditExperience from '../containers/experience/addEditExperience';
import InterviewAndDocument from '../containers/certficationProcess/interviewAndDocuments';
import InterviewScheduling from '../containers/certficationProcess/interviewScheduling';
import CustomerCare from '../containers/common/customerCare/customerCare';
import SendFeedback from '../containers/common/sendFeedback';
import AboutUs from '../containers/common/about/about';
import BackgroundCheck from '../containers/certficationProcess/backgroundCheck';
import TutorVerificationScreen from '../containers/certficationProcess/tutorVerificationScreen';
import { BackgroundCheckStatusEnum } from '../containers/common/enums';
import RatingReviews from '../containers/common/ratingReviews';

const Stack = createStackNavigator();

const AppStack = (props) => {
  const { isUserLoggedIn, userType, showSplashScreen } = props;
  const [isGettingStartedVisible, setIsGettingStartedVisible] = useState(true);
  const tutorInfo = useReactiveVar(tutorDetails);
  const userDetailsObj = useReactiveVar(userDetails);
  const notifyList = useReactiveVar(notificationsList);

  useEffect(() => {
    // clearAllLocalStorage();
    AsyncStorage.getItem(LOCAL_STORAGE_DATA_KEY.ONBOARDING_SHOWN).then((val) => {
      setIsGettingStartedVisible(isEmpty(val));
    });
  }, []);

  const [registerDevice, { loading: scheduleLoading }] = useMutation(REGISTER_DEVICE, {
    fetchPolicy: 'no-cache',
    onError: (e) => {},
    onCompleted: (data) => {
      if (data) {
        console.log(data);
      }
    },
  });

  useEffect(() => {
    if (!isEmpty(userDetailsObj)) {
      getFcmToken().then((token) => {
        if (token) {
          console.log('fcm token', token);

          createPayload(userDetailsObj.me, token).then((payload) => {
            registerDevice({ variables: { deviceDto: payload } });
          });
        }
      });
    }
  }, [userDetailsObj]);

  useEffect(() => {
    requestUserPermission();
    initializeNotification();
    getFcmToken().then((token) => {
      if (token) {
        console.log('FCM Token from', token);

        createPayload(userDetailsObj.me, token).then((payload) => {
          registerDevice({ variables: { deviceDto: payload } });
        });
      }
    });

    // notificationPayload({
    //   screen: 'tutor_detail',
    //   tutor_id: 38480,
    //   offering_id: 249,
    // });
    messaging().onNotificationOpenedApp((remoteMessage) => {
      if (!isEmpty(remoteMessage) && !isEmpty(remoteMessage.data)) {
        notificationPayload(remoteMessage.data);
      }
      if (!isEmpty(remoteMessage) && !isEmpty(remoteMessage.notification)) {
        console.log('COming notification from', remoteMessage.notification);
        notificationsList([...notifyList, remoteMessage.messageId]);
        saveNotificationPayload(remoteMessage);
      }
    });
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (!isEmpty(remoteMessage) && !isEmpty(remoteMessage.notification)) {
          console.log('COming notification from', remoteMessage.notification);
          if (!isEmpty(remoteMessage) && !isEmpty(remoteMessage.data)) {
            notificationPayload(remoteMessage.data);
          }
          notificationsList([...notifyList, remoteMessage.messageId]);
          saveNotificationPayload(remoteMessage);
        }
      });
  }, []);

  const getCommonRoutes = () => (
    <>
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.CALENDAR}
        component={CalendarView}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.SCHEDULED_CLASS_DETAILS}
        component={scheduledClassDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.CANCEL_REASON}
        component={cancelReason}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.MY_CLASSES}
        component={MyClasses}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.SCHEDULE_CLASS}
        component={scheduleClass}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={NavigationRouteNames.ADDRESS} component={AddressListing} options={{ headerShown: false }} />
      <Stack.Screen
        name={NavigationRouteNames.ADD_EDIT_ADDRESS}
        component={AddEditAddress}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.ADDRESS_MAP_VIEW}
        component={AddressMapView}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.EDUCATION}
        component={EducationListing}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.ADD_EDIT_EDUCATION}
        component={AddEditEducation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.AWARD_LISTING}
        component={AwardListing}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.ADD_EDIT_AWARD_DETAILS}
        component={AddEditAward}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.PERSONAL_DETAILS}
        component={PersonalDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.SUBJECT_SELECTION}
        component={SubjectSelection}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.PT_START_SCREEN}
        component={PtStartScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.PROFICIENCY_TEST}
        component={ProficiencyTest}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.COMPLETE_PROFILE}
        component={CompleteYourProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.EXPERIENCE}
        component={ExperienceListing}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.ADD_EDIT_EXPERIENCE}
        component={AddEditExperience}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.CUSTOMER_CARE}
        component={CustomerCare}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={NavigationRouteNames.WEB_VIEW} component={WebViewPage} options={{ headerShown: false }} />

      <Stack.Screen
        name={NavigationRouteNames.SEND_FEEDBACK}
        component={SendFeedback}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={NavigationRouteNames.ABOUT_US} component={AboutUs} options={{ headerShown: false }} />
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.UPLOAD_DOCUMENTS}
        component={UploadDocuments}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.RATINGS_REVIEWS}
        component={RatingReviews}
        options={{ headerShown: false }}
      />
    </>
  );

  const getLoggedInRoutes = () => {
    if (userType === UserTypeEnum.OTHER.label) {
      return (
        <Stack.Screen
          name={NavigationRouteNames.USER_TYPE_SELECTOR}
          component={UserTypeSelector}
          options={{ headerShown: false }}
        />
      );
    }
    if (userType === UserTypeEnum.STUDENT.label) {
      return getStudentRoutes();
    }
    if (userType === UserTypeEnum.TUTOR.label) {
      if (tutorInfo && tutorInfo?.certified) {
        return getTutorRoutes(tutorInfo);
      }

      if (tutorInfo && tutorInfo?.lead?.certificationStage === TutorCertificationStageEnum.REGISTERED.label) {
        return (
          <>
            <Stack.Screen
              name={NavigationRouteNames.TUTOR.WELCOME_SCREEN}
              component={TutorWelcomeScreen}
              options={{ headerShown: false }}
            />
          </>
        );
      }
      if (
        tutorInfo &&
        !tutorInfo?.certified &&
        (tutorInfo?.lead?.certificationStage === TutorCertificationStageEnum.CERTIFICATION_PROCESS_COMPLETED.label ||
          (tutorInfo?.lead?.certificationStage === TutorCertificationStageEnum.BACKGROUND_CHECK_PENDING.label &&
            tutorInfo?.lead?.backgroundCheck?.status !== BackgroundCheckStatusEnum.NOT_STARTED.label))
      ) {
        return (
          <Stack.Screen
            name={NavigationRouteNames.TUTOR.VERIFICATION}
            component={TutorVerificationScreen}
            options={{ headerShown: false }}
          />
        );
      }

      if (
        tutorInfo &&
        tutorInfo?.lead?.certificationStage !== TutorCertificationStageEnum.CERTIFICATION_PROCESS_COMPLETED.label
      ) {
        return (
          <>
            <Stack.Screen
              name={NavigationRouteNames.TUTOR.CERTIFICATE_STEPS}
              component={CertificationProcessSteps}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={NavigationRouteNames.TUTOR.BACKGROUND_CHECK}
              component={BackgroundCheck}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={NavigationRouteNames.TUTOR.INTERVIEW_AND_DOCUMENTS}
              component={InterviewAndDocument}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={NavigationRouteNames.TUTOR.SCHEDULE_YOUR_INTERVIEW}
              component={InterviewScheduling}
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
        </>
      )}
      {isUserLoggedIn && !isEmpty(userType) && getCommonRoutes()}
    </Stack.Navigator>
  );
};
export default AppStack;
