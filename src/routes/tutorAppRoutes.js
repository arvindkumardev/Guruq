import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationRouteNames from './screenNames';
import TutorDashboardContainer from '../containers/tutor/dashboard/tutorDashboardContainer';

const Stack = createStackNavigator();

export const getTutorRoutes = () => {
  return (
    <>
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.DASHBOARD}
        component={TutorDashboardContainer}
        options={{ headerShown: false }}
      />
    </>
  );
};
