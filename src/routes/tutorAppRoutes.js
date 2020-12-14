import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationRouteNames from './screenNames';
import TutorDashboardContainer from '../containers/tutor/dashboard/tutorDashboardContainer';
import CalendarView from '../containers/tutor/calendar/calendarView';

const Stack = createStackNavigator();

export const getTutorRoutes = () => {
  return (
    <>
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.DASHBOARD}
        component={TutorDashboardContainer}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.CALENDAR}
        component={CalendarView}
        options={{ headerShown: false }}
      />
    </>
  );
};
