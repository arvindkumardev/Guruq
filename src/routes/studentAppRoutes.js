import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationRouteNames from './screenNames';
import StudentDashboardContainer from '../containers/student/dashboard/studentDashboardContainer';
import StudyAreaSelector from '../containers/student/studyArea/studyAreaSelector';
import BoardSelector from '../containers/student/studyArea/boardSelector';
import ClassSelector from '../containers/student/studyArea/classSelector';
import CompareTutors from '../containers/student/tutorListing/compareTutors';
import TutorListing from '../containers/student/tutorListing/tutorListing';
import TutorDetails from '../containers/student/tutorDetails/tutorDetails';
import myCart from '../containers/student/myCart/myCart';
import BookingConfirmed from '../containers/student/payment/bookingConfirmed';
import paymentReceived from '../containers/student/payment/paymentReceived';
import RateAndReviews from '../containers/student/reviews/rateAndReview';
import DetailedRating from '../containers/student/reviews/detailedRating';
import FavouriteTutors from '../containers/student/dashboard/favouriteTutors';
import PytnSubjectSelection from '../containers/student/pytn/pytnSubjectSelection';
import PytnSubmit from '../containers/student/pytn/pytnSubmit';
import PytnListing from '../containers/student/pytn/pytnListing';
import PytnDetail from '../containers/student/pytn/pytnDetail';
import ParentListing from '../containers/student/parentsDetail/parentListing';
import AddEditParents from '../containers/student/parentsDetail/addEditParents';
import BookingList from '../containers/student/purchasedHistory/bookingList';
import BookingDetails from '../containers/student/purchasedHistory/bookingDetails';
import Refund from '../containers/student/purchasedHistory/refund';
import MyStudyAreas from '../containers/student/studyArea/myStudyAreas';
import OrderDetails from '../containers/student/purchasedHistory/orderDetails';
import StudentOnBoard from '../containers/student/studentOnBoard';
import {StudentBottomTabs} from "./bottomTabs";

const Stack = createStackNavigator();

export const getStudentRoutes = (studentInfo) => {
  return (
    <>
      {!studentInfo.user.onBoarded && (
        <Stack.Screen
          name={NavigationRouteNames.STUDENT.ON_BOARDING}
          component={StudentOnBoard}
          options={{ headerShown: false }}
        />
      )}
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.DASHBOARD}
        component={StudentBottomTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.MY_STUDY_AREAS}
        component={MyStudyAreas}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.STUDY_AREA}
        component={StudyAreaSelector}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.BOARD}
        component={BoardSelector}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.CLASS}
        component={ClassSelector}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.COMPARE_TUTORS}
        component={CompareTutors}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={NavigationRouteNames.STUDENT.TUTOR}
        component={TutorListing}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.TUTOR_DETAILS}
        component={TutorDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={NavigationRouteNames.STUDENT.MY_CART} component={myCart} options={{ headerShown: false }} />

      <Stack.Screen
        name={NavigationRouteNames.STUDENT.BOOKING_CONFIRMED}
        component={BookingConfirmed}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.PAYMENT_RECEIVED}
        component={paymentReceived}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={NavigationRouteNames.STUDENT.RATE_AND_REVIEW}
        component={RateAndReviews}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.DETAILED_RATING}
        component={DetailedRating}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.FAVOURITE_TUTOR}
        component={FavouriteTutors}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.PYTN_ADD}
        component={PytnSubjectSelection}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={NavigationRouteNames.PYTN_DETAILS} component={PytnSubmit} options={{ headerShown: false }} />
      <Stack.Screen name={NavigationRouteNames.PYTN_LISTING} component={PytnListing} options={{ headerShown: false }} />
      <Stack.Screen name={NavigationRouteNames.PYTN_HISTORY} component={PytnDetail} options={{ headerShown: false }} />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.PARENTS_LIST}
        component={ParentListing}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.ADD_EDIT_PARENTS}
        component={AddEditParents}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.BOOKING_DETAILS}
        component={BookingList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.VIEW_BOOKING_DETAILS}
        component={BookingDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={NavigationRouteNames.STUDENT.REFUND} component={Refund} options={{ headerShown: false }} />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.ORDER_DETAILS}
        component={OrderDetails}
        options={{ headerShown: false }}
      />
    </>
  );
};
