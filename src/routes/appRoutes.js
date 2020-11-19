import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationRouteNames from './screenNames';
import Login from '../containers/common/login/login';
import OtpVerification from '../containers/common/login/otpVerification';
import SetPassword from '../containers/common/login/setPassword';
import SignUp from '../containers/common/login/signUp';
import EnterPassword from '../containers/common/login/enterPassword';
import StudentDashboardContainer from '../containers/student/dashboard/studentDashboardContainer';
import UserTypeSelector from '../containers/common/userTypeSelector/userTypeSelector';
import StudyAreaSelector from '../containers/student/studyArea/studyAreaSelector';
import BoardSelector from '../containers/student/studyArea/boardSelector';
import ClassSelector from '../containers/student/studyArea/classSelector';
import SplashScreen from '../containers/common/splashScreen/splashScreen';
import GettingStarted from '../containers/common/onboarding/gettingStarted';
import PersonalDetails from '../containers/student/profile/personalDetails';
import CompareTutors from '../containers/student/tutorListing/compareTutors';
import TutorListing from '../containers/student/tutorListing/tutorListing';
import TutorDetails from '../containers/student/tutorListing/tutorDetails';
import myCart from '../containers/student/tutorListing/bookingTutor/myCart';
import bookingConfirmed from '../containers/student/payment/bookingConfirmed';
import paymentReceived from '../containers/student/payment/paymentReceived';
import myClasses from '../containers/student/classes/classes';
import scheduleClass from '../containers/student/classes/scheduleClass';
import scheduledClassDetails from '../containers/student/calendar/scheduledClassDetails';
import PaymentMethod from '../containers/student/payment/paymentMethod';
import cancelReason from '../containers/student/calendar/cancelReason';
import onlineClass from '../containers/student/calendar/onlineClass';
import RateAndReviews from '../containers/student/reviews/rateAndReview';
import DetailedRating from '../containers/student/reviews/detailedRating';
import OnlineClass from '../containers/onlineClass/onlineClass';
import { UserTypeEnum } from '../common/userType.enum';
import TutorDashboardContainer from '../containers/tutor/dashboard/tutorDashboardContainer';
import { getStudentRoutes } from './studentAppRoutes';
import { getTutorRoutes } from './tutorAppRoutes';

const Stack = createStackNavigator();

const AppStack = (props) => {
  const { isUserLoggedIn, isUserTokenLoading, userType } = props;

  return (
    <Stack.Navigator>
      {isUserTokenLoading && (
        <Stack.Screen
          name={NavigationRouteNames.SPLASH_SCREEN}
          component={SplashScreen}
          options={{ headerShown: false }}
        />
      )}

      {!isUserTokenLoading && !isUserLoggedIn && (
        <>
          <Stack.Screen
            name={NavigationRouteNames.GETTING_STARTED}
            component={GettingStarted}
            options={{ headerShown: false }}
          />
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

      {isUserLoggedIn && userType === UserTypeEnum.OTHER.label && (
        <Stack.Screen
          name={NavigationRouteNames.USER_TYPE_SELECTOR}
          component={UserTypeSelector}
          options={{ headerShown: false }}
        />
      )}

      {isUserLoggedIn &&
        userType !== UserTypeEnum.OTHER.label &&
        userType === UserTypeEnum.STUDENT.label &&
        getStudentRoutes()}

      {isUserLoggedIn &&
        userType !== UserTypeEnum.OTHER.label &&
        userType === UserTypeEnum.TUTOR.label &&
        getTutorRoutes()}
    </Stack.Navigator>
  );
};
export default AppStack;
