import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationRouteNames from './ScreenNames';
import login from '../containers/common/login/login';
import otpVerification from '../containers/common/login/otpVerification';
import setPassword from '../containers/common/login/setPassword';
import signUp from '../containers/common/login/signUp';
import enterPassword from '../containers/common/login/enterPassword';
import studentDashboardContainer from '../containers/student/dashboard/studentDashboardContainer';
import userTypeSelector from '../containers/common/userTypeSelector/userTypeSelector';
import studyAreaSelector from '../containers/student/studyArea/studyAreaSelector';
import boardSelector from '../containers/student/studyArea/boardSelector';
import classSelector from '../containers/student/studyArea/classSelector';
import splashScreen from '../containers/common/splashScreen/splashScreen';
import GettingStarted from '../containers/common/onboarding';

const Stack = createStackNavigator();

const AppStack = (props) => {
  const { isUserLoggedIn, isUserTokenLoading, userTypeSet } = props;

  return (
    <Stack.Navigator>
      {isUserTokenLoading && (
        <Stack.Screen
          name={NavigationRouteNames.SPLASH_SCREEN}
          component={splashScreen}
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
          <Stack.Screen name={NavigationRouteNames.LOGIN} component={login} options={{ headerShown: false }} />
          <Stack.Screen
            name={NavigationRouteNames.ENTER_PASSWORD}
            component={enterPassword}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={NavigationRouteNames.OTP_VERIFICATION}
            component={otpVerification}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={NavigationRouteNames.SET_PASSWORD}
            component={setPassword}
            options={{ headerShown: false }}
          />
          <Stack.Screen name={NavigationRouteNames.REGISTER} component={signUp} options={{ headerShown: false }} />
          <Stack.Screen
            name={NavigationRouteNames.USER_TYPE_SELECTOR}
            component={userTypeSelector}
            options={{ headerShown: false }}
          />
        </>
      )}

      {isUserLoggedIn && !userTypeSet && (
        <Stack.Screen
          name={NavigationRouteNames.USER_TYPE_SELECTOR}
          component={userTypeSelector}
          options={{ headerShown: false }}
        />
      )}

      {isUserLoggedIn && userTypeSet && (
        <>
          <Stack.Screen
            name={NavigationRouteNames.STUDENT.DASHBOARD}
            component={studentDashboardContainer}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={NavigationRouteNames.STUDENT.STUDY_AREA}
            component={studyAreaSelector}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={NavigationRouteNames.STUDENT.BOARD}
            component={boardSelector}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={NavigationRouteNames.STUDENT.CLASS}
            component={classSelector}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
export default AppStack;
