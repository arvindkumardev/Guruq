import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationRouteNames from './screenNames';
import TutorDashboardContainer from '../containers/tutor/dashboard/tutorDashboardContainer';
// import CalendarView from '../containers/tutor/calendar/calendarView';
// import ScheduledClassDetails from '../containers/tutor/calendar/scheduledClassDetails';
// import CancelReason from '../containers/calendar/cancelReason';
import OnlineClass from '../containers/onlineClass/onlineClass';
import WebViewPage from '../components/WebViewPage/index';
import SubjectList from '../containers/tutor/mySubjects/subjectList';
import PriceMatrix from '../containers/tutor/mySubjects/priceMatrix';
import ViewSchedule from '../containers/tutor/profile/scheduler/viewSchedule';
import UpdateSchedule from '../containers/tutor/profile/scheduler/updateSchedule';
import PytnSubmit from '../containers/student/pytn/pytnSubmit';
import ReferEarn from '../containers/referAndEarn/referEarn';
import Notifications from '../containers/student/dashboard/notifications';
import PytnRequests from '../containers/tutor/pytn/pytnRequests';
import SendFeedback from '../containers/common/sendFeedback';
import CustomerCare from '../containers/common/customerCare';
import SubjectSelection from '../containers/tutor/mySubjects/subjectSelection';
import Address from '../containers/common/profileScreens/address';
import AddEditAddress from '../containers/common/profileScreens/addEditAddress';
import AddressMapView from '../containers/common/profileScreens/addressMapView';
import Education from '../containers/common/profileScreens/education';
import AddEditEducation from '../containers/common/profileScreens/addEditEducation';
import Parents from '../containers/common/profileScreens/parents';
import AddEditParents from '../containers/common/profileScreens/addEditParents';
import Experience from '../containers/common/profileScreens/experience';
import AddEditExperience from '../containers/common/profileScreens/addEditExperience';
import BankDetails from '../containers/common/profileScreens/bankDetails';
import AddEditBankDetails from '../containers/common/profileScreens/addEditBankDetails';

const Stack = createStackNavigator();

export const getTutorRoutes = () => {
  return (
    <>
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.DASHBOARD}
        component={TutorDashboardContainer}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen */}
      {/*  name={NavigationRouteNames.STUDENT.CALENDAR} */}
      {/*  component={CalendarView} */}
      {/*  options={{ headerShown: false }} */}
      {/* /> */}
      {/* <Stack.Screen */}
      {/*  name={NavigationRouteNames.STUDENT.SCHEDULED_CLASS_DETAILS} */}
      {/*  component={ScheduledClassDetails} */}
      {/*  options={{ headerShown: false }} */}
      {/* /> */}
      {/* <Stack.Screen */}
      {/*  name={NavigationRouteNames.STUDENT.CANCEL_REASON} */}
      {/*  component={CancelReason} */}
      {/*  options={{ headerShown: false }} */}
      {/* /> */}
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
        name={NavigationRouteNames.TUTOR.SUBJECT_SELECTION}
        component={SubjectSelection}
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
        name={NavigationRouteNames.POST_TUTION_NEED_DETAILS}
        component={PytnSubmit}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={NavigationRouteNames.REFER_EARN} component={ReferEarn} options={{ headerShown: false }} />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.NOTIFICATIONS}
        component={Notifications}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.STUDENT_REQUESTS}
        component={PytnRequests}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.SEND_FEEDBACK}
        component={SendFeedback}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.CUSTOMER_CARE}
        component={CustomerCare}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={NavigationRouteNames.ADDRESS} component={Address} options={{ headerShown: false }} />
      <Stack.Screen
        name={NavigationRouteNames.ADD_EDIT_ADDRESS}
        component={AddEditAddress}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.ADDRESS_MAP_VIEW}
        component={AddressMapView}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={NavigationRouteNames.EDUCATION} component={Education} options={{ headerShown: false }} />
      <Stack.Screen
        name={NavigationRouteNames.ADD_EDIT_EDUCATION}
        component={AddEditEducation}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={NavigationRouteNames.PARENTS} component={Parents} options={{ headerShown: false }} />
      <Stack.Screen
        name={NavigationRouteNames.ADD_EDIT_PARENTS}
        component={AddEditParents}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={NavigationRouteNames.EXPERIENCE} component={Experience} options={{ headerShown: false }} />
      <Stack.Screen
        name={NavigationRouteNames.ADD_EDIT_EXPERIENCE}
        component={AddEditExperience}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={NavigationRouteNames.BANK_DETAILS} component={BankDetails} options={{ headerShown: false }} />
      <Stack.Screen
        name={NavigationRouteNames.ADD_EDIT_BANK_DETAILS}
        component={AddEditBankDetails}
        options={{ headerShown: false }}
      />
    </>
  );
};
