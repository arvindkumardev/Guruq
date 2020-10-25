import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationRouteNames from './ScreenNames';
import onboarding from '../containers/common/onboarding/index';
import splashScreen from '../containers/common/splashScreen/splashScreen';
import studentDashboardContainer from '../containers/student/dashboard/studentDashboardContainer';
import studentTutorSelector from '../containers/common/userOnboarding/studentTutorSelector';
import login from '../containers/common/login/login';
import otpVerification from '../containers/common/login/otpVerification';
import setPassword from '../containers/common/login/setPassword';
import register from '../containers/common/login/register';
import enterPassword from '../containers/common/login/enterPassword';

const Stack = createStackNavigator();

const StudentAppRoutes = () => (
  <Stack.Navigator>
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
  </Stack.Navigator>
);
export default StudentAppRoutes;
