import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationRouteNames from './screenNames';
import OtpVerification from '../containers/common/login/otpVerification';
import SetPassword from '../containers/common/login/setPassword';

import TutorDashboardContainer from '../containers/tutor/dashboard/tutorDashboardContainer';
import OnlineClass from '../containers/onlineClass/onlineClass';
import SubjectList from '../containers/tutor/mySubjects/subjectList';
import PriceMatrix from '../containers/tutor/mySubjects/priceMatrix';
import ViewSchedule from '../containers/tutor/schedule/viewSchedule';
import UpdateSchedule from '../containers/tutor/schedule/updateSchedule';
import PytnSubmit from '../containers/student/pytn/pytnSubmit';
import ReferEarn from '../containers/referAndEarn/referEarn';
import Notifications from '../containers/student/dashboard/notifications';
import PytnRequests from '../containers/tutor/pytn/pytnRequests';
import ParentListing from '../containers/parentsDetail/parentListing';
import AddEditParents from '../containers/parentsDetail/addEditParents';
import BankDetails from '../containers/bankDetails/bankDetails';
import AddEditBankDetails from '../containers/bankDetails/addEditBankDetails';
import BusinessDetails from '../containers/businessDetails/businessDetails';
import AddEditBusinessDetails from '../containers/businessDetails/addEditBusinessDetails';
import PriceAndSchedule from '../containers/certficationProcess/priceAndSchedule';
import DocumentListing from '../containers/businessDetails/documentListing';
import TutorOnBoard from '../containers/tutor/tutorOnBoard/index';
import PtStartScreen from '../containers/certficationProcess/ptStartScreen';
import ProficiencyTest from '../containers/tutor/proficiencyTest';
import CompleteYourProfile from "../containers/certficationProcess/completeYourProfile";

const Stack = createStackNavigator();

export const getTutorRoutes = (tutorInfo) => {
  return (
    <>
      {!tutorInfo.user.onBoarded && (
        <Stack.Screen
          name={NavigationRouteNames.TUTOR.ON_BOARDING}
          component={TutorOnBoard}
          options={{ headerShown: false }}
        />
      )}
      {tutorInfo.activeForListing ? (
        <Stack.Screen
          name={NavigationRouteNames.TUTOR.DASHBOARD}
          component={TutorDashboardContainer}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name={NavigationRouteNames.TUTOR.ADD_DATA}
          component={PriceAndSchedule}
          options={{ headerShown: false }}
        />
      )}

      <Stack.Screen
        name={NavigationRouteNames.ONLINE_CLASS}
        component={OnlineClass}
        options={{ headerShown: false, gestureEnabled: false }}
      />

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
        name={NavigationRouteNames.TUTOR.OTP_VERIFICATION}
        component={OtpVerification}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.SET_PASSWORD}
        component={SetPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.UPDATE_SCHEDULE}
        component={UpdateSchedule}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={NavigationRouteNames.PYTN_DETAILS} component={PytnSubmit} options={{ headerShown: false }} />
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
        name={NavigationRouteNames.PARENTS_LIST}
        component={ParentListing}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.ADD_EDIT_PARENTS}
        component={AddEditParents}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={NavigationRouteNames.BANK_DETAILS} component={BankDetails} options={{ headerShown: false }} />
      <Stack.Screen
        name={NavigationRouteNames.ADD_EDIT_BANK_DETAILS}
        component={AddEditBankDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.BUSINESS_DETAILS}
        component={BusinessDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.ADD_EDIT_BUSINESS_DETAILS}
        component={AddEditBusinessDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.DOCUMENT_LISTING}
        component={DocumentListing}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.PT_START_SCREEN}
        component={PtStartScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.PROFICIENCY_TEST}
        component={ProficiencyTest}
        options={{ headerShown: false }}
      />
    </>
  );
};
