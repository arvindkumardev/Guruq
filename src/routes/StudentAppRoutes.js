import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationRouteNames from './ScreenNames';
import studentDashboardContainer from '../containers/student/dashboard/studentDashboardContainer';
import studentTutorSelector from '../containers/common/userOnboarding/studentTutorSelector';

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
