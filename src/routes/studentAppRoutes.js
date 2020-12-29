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
import PaymentMethod from '../containers/student/payment/paymentMethod';
import RateAndReviews from '../containers/student/reviews/rateAndReview';
import DetailedRating from '../containers/student/reviews/detailedRating';
import OnlineClass from '../containers/onlineClass/onlineClass';
import FavouriteTutors from '../containers/student/dashboard/favouriteTutors';
import ReferEarn from '../containers/referAndEarn/referEarn';
import PytnSubjectSelection from '../containers/student/pytn/pytnSubjectSelection';
import PytnSubmit from '../containers/student/pytn/pytnSubmit';
import WebViewPages from '../containers/student/profile/webViewPages';
import PytnListing from '../containers/student/pytn/pytnListing';
import PytnDetail from '../containers/student/pytn/pytnDetail';
import WebViewPage from '../components/WebViewPage';
import Notifications from '../containers/student/dashboard/notifications';
import SendFeedback from '../containers/common/sendFeedback';
import CustomerCare from '../containers/common/customerCare';
import PersonalDetails from '../containers/common/profileScreens/personalDetails';
import Address from '../containers/common/profileScreens/address';
import AddEditAddress from '../containers/common/profileScreens/addEditAddress';
import AddressMapView from '../containers/common/profileScreens/addressMapView';
import Education from '../containers/common/profileScreens/education';
import AddEditEducation from '../containers/common/profileScreens/addEditEducation';
import Parents from '../containers/common/profileScreens/parents';
import AddEditParents from '../containers/common/profileScreens/addEditParents';

const Stack = createStackNavigator();

export const getStudentRoutes = () => {
  return (
    <>
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.DASHBOARD}
        component={StudentDashboardContainer}
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
        name={NavigationRouteNames.PERSONAL_DETAILS}
        component={PersonalDetails}
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
        name={NavigationRouteNames.STUDENT.PAYMENT_METHOD}
        component={PaymentMethod}
        options={{ headerShown: false }}
      />
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

      {/* <Stack.Screen
        name={NavigationRouteNames.STUDENT.ONLINE_CLASS}
        component={onlineClass}
        options={{ headerShown: false }}
      /> */}
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
      {/* <Stack.Screen */}
      {/*  name={NavigationRouteNames.STUDENT.CALENDAR} */}
      {/*  component={CalendarView} */}
      {/*  options={{ headerShown: false }} */}
      {/* /> */}
      <Stack.Screen
        name={NavigationRouteNames.ONLINE_CLASS}
        component={OnlineClass}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.FAVOURITE_TUTOR}
        component={FavouriteTutors}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={NavigationRouteNames.REFER_EARN} component={ReferEarn} options={{ headerShown: false }} />
      <Stack.Screen
        name={NavigationRouteNames.POST_TUTION_NEEDS}
        component={PytnSubjectSelection}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.POST_TUTION_NEED_DETAILS}
        component={PytnSubmit}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.WEB_VIEW_PAGES}
        component={WebViewPages}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.TUTION_NEEDS_LISTING}
        component={PytnListing}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.TUTION_NEEDS_HISTORY}
        component={PytnDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={NavigationRouteNames.WEB_VIEW} component={WebViewPage} options={{ headerShown: false }} />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.NOTIFICATIONS}
        component={Notifications}
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
    </>
  );
};
