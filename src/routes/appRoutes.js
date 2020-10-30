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
import CompareTutors from '../containers/student/tutor/compareTutors';

const Stack = createStackNavigator();

const AppStack = (props) => {
  const { isUserLoggedIn, isUserTokenLoading, userTypeSet } = props;

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

      {isUserLoggedIn && !userTypeSet && (
        <Stack.Screen
          name={NavigationRouteNames.USER_TYPE_SELECTOR}
          component={UserTypeSelector}
          options={{ headerShown: false }}
        />
      )}

      {isUserLoggedIn && userTypeSet && (
        <>
          <Stack.Screen
            name={NavigationRouteNames.STUDENT.DASHBOARD}
            component={StudentDashboardContainer}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={NavigationRouteNames.STUDENT.STUDY_AREA}
            component={StudyAreaSelector}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={NavigationRouteNames.STUDENT.BOARD}
            component={BoardSelector}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={NavigationRouteNames.STUDENT.CLASS}
            component={ClassSelector}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={NavigationRouteNames.STUDENT.PERSONAL_DETAILS}
            component={PersonalDetails}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={NavigationRouteNames.STUDENT.COMPARE_TUTORS}
            component={CompareTutors}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
export default AppStack;
