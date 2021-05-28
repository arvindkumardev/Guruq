import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationRouteNames from './screenNames';
import TutorDashboardContainer from '../containers/tutor/dashboard/tutorDashboardContainer';
import SubjectList from '../containers/tutor/mySubjects/subjectList';
import PriceMatrix from '../containers/tutor/mySubjects/priceMatrix';
import ClassPriceMatrix from '../containers/tutor/mySubjects/classPriceMatrixView';
import DemoPriceMatrix from '../containers/tutor/mySubjects/demoPriceMatrixView';
import WhyMeView from '../containers/tutor/mySubjects/components/whyMeView';
import AddSubjectDetails from '../containers/tutor/mySubjects/addsubjectdetails';
import ViewSchedule from '../containers/tutor/schedule/viewSchedule';
import UpdateSchedule from '../containers/tutor/schedule/updateSchedule';
import PytnSubmit from '../containers/student/pytn/pytnSubmit';
import PytnRequests from '../containers/tutor/pytn/pytnRequests';
import BankDetails from '../containers/tutor/bankDetails/bankDetails';
import AddEditBankDetails from '../containers/tutor/bankDetails/addEditBankDetails';
import BusinessDetails from '../containers/tutor/businessDetails/businessDetails';
import AddEditBusinessDetails from '../containers/tutor/businessDetails/addEditBusinessDetails';
import PriceAndSchedule from '../containers/certficationProcess/priceAndSchedule';
import DocumentListing from '../containers/tutor/documentListing/documentListing';
import TutorOnBoard from '../containers/tutor/tutorOnBoard/index';
import PtStartScreen from '../containers/certficationProcess/ptStartScreen';
import ProficiencyTest from '../containers/tutor/proficiencyTest';
import StudentListing from '../containers/tutor/studentList';
import StudentDetails from '../containers/tutor/studentDetails';
import Profile from '../containers/tutor/profile/profile';
import scheduleClass from '../containers/myClasses/scheduleClass';
import MyClasses from '../containers/myClasses/classes';
import TestResult from '../containers/tutor/testresult';

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
        name={NavigationRouteNames.TUTOR.PROFILE}
        component={Profile}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={NavigationRouteNames.TUTOR.SUBJECTS_LIST}
        component={SubjectList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.PRICE_MATRIX}
        component={ClassPriceMatrix}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.PRICE_MATRIX_OLD}
        component={PriceMatrix}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.WHY_ME}
        component={WhyMeView}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.DEMO_PRICE_MATRIX}
        component={DemoPriceMatrix}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.ADD_SUBJECT_DETAILS}
        component={AddSubjectDetails}
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
        name={NavigationRouteNames.PYTN_DETAILS}
        component={PytnSubmit}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.STUDENT_REQUESTS}
        component={PytnRequests}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.BANK_DETAILS}
        component={BankDetails}
        options={{ headerShown: false }}
      />
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
        name={NavigationRouteNames.TUTOR.PROFICIENCY_RESULT}
        component={TestResult}
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
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.STUDENT_LISTING}
        component={StudentListing}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.TUTOR.STUDENT_DETAILS}
        component={StudentDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.MY_CLASSES}
        component={MyClasses}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.SCHEDULE_CLASS}
        component={scheduleClass}
        options={{ headerShown: false }}
      />
    </>
  );
};
