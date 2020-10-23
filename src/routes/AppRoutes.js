import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationRouteNames from './ScreenNames';
import onboarding from '../containers/onboarding/index';
import splashScreen from '../containers/splashScreen/splashScreen';
import dashboard from '../containers/dashboard/dashboard';
import studentTutorSelector from '../containers/userOnboarding/studentTutorSelector';
import login from '../containers/login/login';
import otpVerification from '../containers/login/otpVerification';
import setPassword from '../containers/login/setPassword';
import register from '../containers/login/register';

const Stack = createStackNavigator();

const AppStack = () => (
  <Stack.Navigator>
    <Stack.Screen name={NavigationRouteNames.SPLASH_SCREEN} component={splashScreen} options={{ headerShown: false }} />
    <Stack.Screen name={NavigationRouteNames.ONBOARDING} component={onboarding} options={{ headerShown: false }} />
    <Stack.Screen name={NavigationRouteNames.LOGIN} component={login} options={{ headerShown: false }} />
    <Stack.Screen name={NavigationRouteNames.DASHBOARD} component={dashboard} options={{ headerShown: false }} />
    <Stack.Screen
      name={NavigationRouteNames.OTP_VERIFICATION}
      component={otpVerification}
      options={{ headerShown: false }}
    />
    <Stack.Screen name={NavigationRouteNames.SET_PASSWORD} component={setPassword} options={{ headerShown: false }} />
    <Stack.Screen name={NavigationRouteNames.REGISTER} component={register} options={{ headerShown: false }} />
    <Stack.Screen
      name={NavigationRouteNames.USER_ONBOARDING}
      component={studentTutorSelector}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);
export default AppStack;
