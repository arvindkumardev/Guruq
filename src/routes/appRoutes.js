import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationRouteNames from './screenNames';
import Login from '../containers/common/login/login';
import OtpVerification from '../containers/common/login/otpVerification';
import SetPassword from '../containers/common/login/setPassword';
import SignUp from '../containers/common/login/signUp';
import EnterPassword from '../containers/common/login/enterPassword';
import UserTypeSelector from '../containers/common/userTypeSelector/userTypeSelector';
import SplashScreen from '../containers/common/splashScreen/splashScreen';
import GettingStarted from '../containers/common/onboarding/gettingStarted';
import { UserTypeEnum } from '../common/userType.enum';
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
