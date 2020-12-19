import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationRouteNames from './screenNames';
import StudentDashboardContainer from '../containers/student/dashboard/studentDashboardContainer';
import StudyAreaSelector from '../containers/student/studyArea/studyAreaSelector';
import BoardSelector from '../containers/student/studyArea/boardSelector';
import ClassSelector from '../containers/student/studyArea/classSelector';
import PersonalDetails from '../containers/student/profile/personalDetails';
import CompareTutors from '../containers/student/tutorListing/compareTutors';
import TutorListing from '../containers/student/tutorListing/tutorListing';
import TutorDetails from '../containers/student/tutorListing/tutorDetails';
import myCart from '../containers/student/tutorListing/bookingTutor/myCart';
import bookingConfirmed from '../containers/student/payment/bookingConfirmed';
import paymentReceived from '../containers/student/payment/paymentReceived';
import myClasses from '../containers/student/classes/classes';
import scheduleClass from '../containers/student/classes/scheduleClass';
import scheduledClassDetails from '../containers/student/calendar/scheduledClassDetails';
import PaymentMethod from '../containers/student/payment/paymentMethod';
import cancelReason from '../containers/student/calendar/cancelReason';
import RateAndReviews from '../containers/student/reviews/rateAndReview';
import DetailedRating from '../containers/student/reviews/detailedRating';
import OnlineClass from '../containers/onlineClass/onlineClass';
import CalendarView from '../containers/student/calendar/calendarView';
import FavouriteTutors from '../containers/student/dashboard/favouriteTutors';
import ReferEarn from '../containers/referAndEarn/referEarn';
import PostTutionNeeds from '../containers/tutionNeeds/postTutionNeeds';
import PostTutionNeedDetails from '../containers/tutionNeeds/postTutionNeedDetails';
import WebViewPages from '../containers/student/profile/webViewPages';
import TutionNeedsListing from '../containers/tutionNeeds/tutionNeedsListing';
import TutionNeedsHistory from '../containers/tutionNeeds/TutionNeedsHistory';
import WebViewPage from '../components/WebViewPage';
import Notifications from '../containers/student/dashboard/notifications';

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
        name={NavigationRouteNames.STUDENT.PERSONAL_DETAILS}
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
        component={bookingConfirmed}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.PAYMENT_RECEIVED}
        component={paymentReceived}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.MY_CLASSES}
        component={myClasses}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.SCHEDULE_CLASS}
        component={scheduleClass}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.SCHEDULED_CLASS_DETAILS}
        component={scheduledClassDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.CANCEL_REASON}
        component={cancelReason}
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
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.CALENDAR}
        component={CalendarView}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={NavigationRouteNames.ONLINE_CLASS} component={OnlineClass} options={{ headerShown: false }} />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.FAVOURITE_TUTOR}
        component={FavouriteTutors}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={NavigationRouteNames.REFER_EARN} component={ReferEarn} options={{ headerShown: false }} />
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
      <Stack.Screen
        name={NavigationRouteNames.WEB_VIEW_PAGES}
        component={WebViewPages}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.TUTION_NEEDS_LISTING}
        component={TutionNeedsListing}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationRouteNames.TUTION_NEEDS_HISTORY}
        component={TutionNeedsHistory}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={NavigationRouteNames.WEB_VIEW} component={WebViewPage} options={{ headerShown: false }} />
      <Stack.Screen
        name={NavigationRouteNames.STUDENT.NOTIFICATIONS}
        component={Notifications}
        options={{ headerShown: false }}
      />
    </>
  );
};
