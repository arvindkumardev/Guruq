import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationRouteNames from './ScreenNames';
import onboarding from '../containers/onboarding/index';
import {
  Login,
  OTP_Verification,
  Set_Password,
  Register
} from '../containers/login/index';
import splashScreen from '../containers/splashScreen/splashScreen';
import dashboard from '../containers/dashboard/dashboard';
import studentTutorSelector from '../containers/userOnboarding/studentTutorSelector'

const Stack = createStackNavigator();

const AppStack = () => (
  <>
    <Stack.Navigator>
      <Stack.Screen
        name={NavigationRouteNames.SPLASH_SCREEN}
        component={splashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.ONBOARDING}
        component={onboarding}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.LOGIN}
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.DASHBOARD}
        component={dashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.OTP_VERIFICATION}
        component={OTP_Verification}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.SET_PASSWORD}
        component={Set_Password}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.REGISTER}
        component={Register}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.USER_ONBOARDING}
        component={studentTutorSelector}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  </>
);
export default AppStack;
