import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationRouteNames from './ScreenNames';
import onboarding from '../containers/common/onboarding/index';
import login from '../containers/common/login/login';
import otpVerification from '../containers/common/login/otpVerification';
import setPassword from '../containers/common/login/setPassword';
import register from '../containers/common/login/register';
import enterPassword from '../containers/common/login/enterPassword';
import studentDashboardContainer from '../containers/student/dashboard/studentDashboardContainer';
import studentTutorSelector from '../containers/common/userOnboarding/studentTutorSelector';
import splashScreen from '../containers/common/splashScreen/splashScreen';

const Stack = createStackNavigator();

const AuthRoutes = (props) => {
  const { isUserLoggedIn, isUserTokenLoading } = props;

  return (
    <Stack.Navigator>
      {isUserTokenLoading && (
        <Stack.Screen
          name={NavigationRouteNames.SPLASH_SCREEN}
          component={splashScreen}
          options={{ headerShown: false }}
        />
      )}
      {!isUserTokenLoading && !isUserLoggedIn ? (
        <>
          <Stack.Screen
            name={NavigationRouteNames.ON_BOARDING}
            component={onboarding}
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
          <Stack.Screen name={NavigationRouteNames.REGISTER} component={register} options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen
            name={NavigationRouteNames.STUDENT.DASHBOARD}
            component={studentDashboardContainer}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={NavigationRouteNames.STUDENT.ON_BOARDING}
            component={studentTutorSelector}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
export default AuthRoutes;
