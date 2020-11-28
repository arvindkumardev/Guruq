import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { isEmpty } from 'lodash';
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
  const { isUserLoggedIn, userType } = props;

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
      return getTutorRoutes();
    }
  };

  return (
    <Stack.Navigator>
      {isUserLoggedIn && !isEmpty(userType) ? (
        getLoggedInRoutes()
      ) : (
        <>
          <Stack.Screen
            name={NavigationRouteNames.SPLASH_SCREEN}
            component={SplashScreen}
            options={{ headerShown: false }}
          />
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
    </Stack.Navigator>
  );
};
export default AppStack;
