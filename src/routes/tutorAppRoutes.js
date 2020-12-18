import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationRouteNames from './screenNames';
import TutorDashboardContainer from '../containers/tutor/dashboard/tutorDashboardContainer';
import CalendarView from '../containers/tutor/calendar/calendarView';
import ScheduledClassDetails from '../containers/tutor/calendar/scheduledClassDetails';
import CancelReason from '../containers/student/calendar/cancelReason';
import OnlineClass from '../containers/onlineClass/onlineClass';
import WebViewPage from '../components/WebViewPage/index';
import SubjectList from '../containers/tutor/profile/mySubjects/subjectList';
import PriceMatrix from '../containers/tutor/profile/mySubjects/priceMatrix';
import ViewSchedule from '../containers/tutor/profile/scheduler/viewSchedule';
import UpdateSchedule from '../containers/tutor/profile/scheduler/updateSchedule';
import PostTutionNeeds from '../containers/tutionNeeds/postTutionNeeds';
import PostTutionNeedDetails from '../containers/tutionNeeds/postTutionNeedDetails';

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
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.SCHEDULED_CLASS_DETAILS}
        component={ScheduledClassDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.CANCEL_REASON}
        component={CancelReason}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.ONLINE_CLASS}
        component={OnlineClass}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={NavigationRouteNames.WEB_VIEW} component={WebViewPage} options={{ headerShown: false }} />
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.SUBJECTS_LIST}
        component={SubjectList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.PRICE_MATRIX}
        component={PriceMatrix}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.VIEW_SCHEDULE}
        component={ViewSchedule}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.UPDATE_SCHEDULE}
        component={UpdateSchedule}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.POST_TUTION_NEEDS}
        component={PostTutionNeeds}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.POST_TUTION_NEED_DETAILS}
        component={PostTutionNeedDetails}
        options={{ headerShown: false }}
      />
    </>
  );
};
