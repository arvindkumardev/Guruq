import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import { createStackNavigator } from '@react-navigation/stack';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';

import { useMutation, useReactiveVar } from '@apollo/client';
import {
  activeCoupon,
  notificationPayload,
  notificationsList,
  studentDetails,
  tutorDetails,
  userDetails,
} from '../apollo/cache';
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
import GettingStarted from '../containers/tutorialScreen/gettingStarted';
import SplashScreen from '../containers/splashScreen/splashScreen';
import UserTypeSelector from '../containers/userTypeSelector/userTypeSelector';
import { LOCAL_STORAGE_DATA_KEY } from '../utils/constants';
import NavigationRouteNames from './screenNames';
import { getStudentRoutes } from './studentAppRoutes';
import { getTutorRoutes } from './tutorAppRoutes';
import { PtStatus, TutorCertificationStageEnum } from '../containers/tutor/enums';
import WebViewPage from '../components/WebViewPage';
import UploadDocuments from '../containers/certficationProcess/uploadDocuments';
import AddressListing from '../containers/address/addressListing';
import { REGISTER_DEVICE } from '../containers/common/graphql-mutation';
import { clearAllLocalStorage, createPayload } from '../utils/helpers';

import scheduledClassDetails from '../containers/calendar/scheduledClassDetails';
import cancelReason from '../containers/calendar/cancelReason';
import MyClasses from '../containers/myClasses/classes';
import TestResult from '../containers/tutor/testresult';
import scheduleClass from '../containers/myClasses/scheduleClass';
import CalendarView from '../containers/calendar/calendarView';
import AddEditAddress from '../containers/address/addEditAddress';
import EducationListing from '../containers/education/educationListing';
import AddEditEducation from '../containers/education/addEditEducation';
import AwardListing from '../containers/tutor/awards/awardListing';
import AddEditAward from '../containers/tutor/awards/addEditAward';
import TutorWelcomeScreen from '../containers/certficationProcess/tutorWelcomeScreen';
import CertificationProcessSteps from '../containers/certficationProcess/certificationProcessSteps';
import SubjectSelection from '../containers/tutor/mySubjects/subjectSelection';
import PtStartScreen from '../containers/certficationProcess/ptStartScreen';
import ProficiencyTest from '../containers/tutor/proficiencyTest';
import PersonalDetails from '../containers/personalInformation/personalDetails';
import CompleteYourProfile from '../containers/certficationProcess/completeYourProfile';
import ExperienceListing from '../containers/tutor/experience/experienceListing';
import AddEditExperience from '../containers/tutor/experience/addEditExperience';
import InterviewAndDocument from '../containers/certficationProcess/interviewAndDocuments';
import InterviewScheduling from '../containers/certficationProcess/interviewScheduling';
import CustomerCare from '../containers/customerCare/customerCare';
import SendFeedback from '../containers/common/sendFeedback';
import AboutUs from '../containers/about/about';
import BackgroundCheck from '../containers/certficationProcess/backgroundCheck';
import TutorVerificationScreen from '../containers/certficationProcess/tutorVerificationScreen';
import { BackgroundCheckStatusEnum } from '../containers/common/enums';
import RatingReviews from '../containers/common/ratingReviews';
import UpdateVersion from '../containers/updateVersion/updateVersion';
import ReferEarn from '../containers/referAndEarn/referEarn';
import OnlineClass from '../containers/onlineClass/onlineClass';
import Notifications from '../containers/student/dashboard/notifications';
import MonthCalendarView from '../containers/calendar/monthCalendarView';
import Wallet from '../containers/wallet/wallet';

const Stack = createStackNavigator();

const AppStack = (props) => {
  const { isUserLoggedIn, userType, showSplashScreen, isForceUpdate } = props;
  const [isGettingStartedVisible, setIsGettingStartedVisible] = useState(true);
  const tutorInfo = useReactiveVar(tutorDetails);
  const studentInfo = useReactiveVar(studentDetails);
  const userDetailsObj = useReactiveVar(userDetails);
  const notifyList = useReactiveVar(notificationsList);

  useEffect(() => {
    // clearAllLocalStorage();
    AsyncStorage.getItem(LOCAL_STORAGE_DATA_KEY.ONBOARDING_SHOWN).then((val) => {
      setIsGettingStartedVisible(isEmpty(val));
    });

    // load the coupon as well
    AsyncStorage.getItem(LOCAL_STORAGE_DATA_KEY.ACTIVE_COUPON).then((val) => {
      if (!isEmpty(val)) {
        activeCoupon(JSON.parse(val));
      }
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
    requestUserPermission();
    initializeNotification();
    getFcmToken().then((token) => {
      if (token) {
        createPayload(userDetailsObj.me, token).then((payload) => {
          registerDevice({ variables: { deviceDto: payload } });
        });
      }
    });

    // notificationPayload({
    //   screen: 'scheduled_class_details',
    //   uuid: '7ffed5c5-6b13-4fb4-8719-41c3015e2981',
    // });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      if (!isEmpty(remoteMessage) && !isEmpty(remoteMessage.data)) {
        notificationPayload(remoteMessage.data);
      }
      if (!isEmpty(remoteMessage) && !isEmpty(remoteMessage.notification)) {
        notificationsList([...notifyList, remoteMessage.messageId]);
        saveNotificationPayload(remoteMessage);
      }
    });
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (!isEmpty(remoteMessage) && !isEmpty(remoteMessage.notification)) {
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
      {/* <Stack.Screen name={NavigationRouteNames.CALENDAR} component={CalendarView} options={{ headerShown: false }} /> */}
      <Stack.Screen
        name={NavigationRouteNames.SCHEDULED_CLASS_DETAILS}
        component={scheduledClassDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.CANCEL_REASON}
        component={cancelReason}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={NavigationRouteNames.ADDRESS} component={AddressListing} options={{ headerShown: false }} />
      <Stack.Screen
        name={NavigationRouteNames.ADD_EDIT_ADDRESS}
        component={AddEditAddress}
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
        name={NavigationRouteNames.RATINGS_REVIEWS}
        component={RatingReviews}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={NavigationRouteNames.REFER_EARN} component={ReferEarn} options={{ headerShown: false }} />
      <Stack.Screen
        name={NavigationRouteNames.ONLINE_CLASS}
        component={OnlineClass}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.NOTIFICATIONS}
        component={Notifications}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.OTP_CHANGE_PASSWORD}
        component={OtpVerification}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.CHANGE_PASSWORD}
        component={SetPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.MONTH_CALENDAR_VIEW}
        component={MonthCalendarView}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={NavigationRouteNames.WALLET} component={Wallet} options={{ headerShown: false }} />

      <Stack.Screen
        name={NavigationRouteNames.TUTOR.UPLOAD_DOCUMENTS}
        component={UploadDocuments}
        options={{ headerShown: false }}
      />
    </>
  );

  const getLoggedInRoutes = () => {

    console.log("Rohit: value of tutor is ",tutorInfo)
    if (userType === UserTypeEnum.STUDENT.label) {
      if (studentInfo) {
        return getStudentRoutes(studentInfo);
      }
    }
    if (userType === UserTypeEnum.TUTOR.label) {
      if (tutorInfo && tutorInfo?.certified) {
        return getTutorRoutes(tutorInfo);
      }

      if (tutorInfo && tutorInfo?.lead?.certificationStage === TutorCertificationStageEnum.REGISTERED.label) {
        return (
          <Stack.Screen
            name={NavigationRouteNames.TUTOR.WELCOME_SCREEN}
            component={TutorWelcomeScreen}
            options={{ headerShown: false }}
          />
        );
      }
      if (
        tutorInfo &&
        !tutorInfo?.certified && !(tutorInfo?.lead?.backgroundCheck?.status===PtStatus.EXEMPTED.label) &&
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
            {tutorInfo?.lead?.certificationStage === TutorCertificationStageEnum.PROFICIENCY_TEST_PENDING.label && (
              <>
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
                  name={NavigationRouteNames.TUTOR.PROFICIENCY_RESULT}
                  component={TestResult}
                  options={{ headerShown: false }}
                />
                 <Stack.Screen
                name={NavigationRouteNames.TUTOR.COMPLETE_PROFILE}
                component={CompleteYourProfile}
                options={{ headerShown: false }}
              />
              </>
            )}
            {tutorInfo?.lead?.certificationStage === TutorCertificationStageEnum.PROFILE_COMPLETION_PENDING.label && (
              <Stack.Screen
                name={NavigationRouteNames.TUTOR.COMPLETE_PROFILE}
                component={CompleteYourProfile}
                options={{ headerShown: false }}
              />
            )}
            {tutorInfo?.lead?.certificationStage === TutorCertificationStageEnum.INTERVIEW_PENDING.label && (
              <>
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
                {/* <Stack.Screen */}
                {/*  name={NavigationRouteNames.TUTOR.UPLOAD_DOCUMENTS} */}
                {/*  component={UploadDocuments} */}
                {/*  options={{ headerShown: false }} */}
                {/* /> */}
              </>
            )}
            {tutorInfo?.lead?.certificationStage === TutorCertificationStageEnum.BACKGROUND_CHECK_PENDING.label &&
              tutorInfo?.lead?.backgroundCheck?.status === BackgroundCheckStatusEnum.NOT_STARTED.label && (
                <>
                  <Stack.Screen
                    name={NavigationRouteNames.TUTOR.BACKGROUND_CHECK}
                    component={BackgroundCheck}
                    options={{ headerShown: false }}
                  />
                </>
              )}
          </>
        );
      }
    }
  };

  return (
    <Stack.Navigator>
      {!isForceUpdate ? (
        <>
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
                name={NavigationRouteNames.SET_PASSWORD}
                component={SetPassword}
                options={{ headerShown: false }}
              />
              <Stack.Screen name={NavigationRouteNames.REGISTER} component={SignUp} options={{ headerShown: false }} />
              <Stack.Screen
                name={NavigationRouteNames.OTP_VERIFICATION}
                component={OtpVerification}
                options={{ headerShown: false }}
              />
            </>
          )}
          {isUserLoggedIn && userType === UserTypeEnum.OTHER.label && (
            <Stack.Screen
              name={NavigationRouteNames.USER_TYPE_SELECTOR}
              component={UserTypeSelector}
              options={{ headerShown: false }}
            />
          )}
          {isUserLoggedIn && !isEmpty(userType) && userType !== UserTypeEnum.OTHER.label && getCommonRoutes()}
        </>
      ) : (
        <Stack.Screen
          name={NavigationRouteNames.UPDATE_VERSION}
          component={UpdateVersion}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};
export default AppStack;
