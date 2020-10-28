import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationRouteNames from './ScreenNames';
import StudentDashboardContainer from '../containers/student/dashboard/studentDashboardContainer';
import UserTypeSelector from '../containers/common/userTypeSelector/userTypeSelector';

const Stack = createStackNavigator();

const StudentAppRoutes = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={NavigationRouteNames.STUDENT.DASHBOARD}
      component={StudentDashboardContainer}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={NavigationRouteNames.STUDENT.ON_BOARDING}
      component={UserTypeSelector}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);
export default StudentAppRoutes;
