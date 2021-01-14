/* eslint-disable no-nested-ternary */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { IconButtonWrapper } from '../components';
import CalendarView from '../containers/calendar/calendarView';
import MyClasses from '../containers/myClasses/classes';
import StudentDashboard from '../containers/student/dashboard/components/studentDashboard';
import StudentProfile from '../containers/student/profile/profile';
import TutorDashboard from '../containers/tutor/dashboard/components/tutorDashboard';
import TutorProfile from '../containers/tutor/profile/profile';
import Wallet from '../containers/wallet/wallet';
import { Colors, Images } from '../theme';
import { RfH, RfW } from '../utils/helpers';
import NavigationRouteNames from './screenNames';
import { STANDARD_SCREEN_SIZE } from '../utils/constants';

const Tab = createBottomTabNavigator();

function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View style={{ flexDirection: 'row', paddingVertical: RfH(12) }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const renderIcon = (name) => {
          if (name === 'Home') {
            return (
              <IconButtonWrapper
                iconHeight={RfH(20)}
                iconWidth={RfW(16)}
                iconImage={isFocused ? Images.home_active : Images.home}
                imageResizeMode="contain"
              />
            );
          }
          if (name === 'Calendar') {
            return (
              <IconButtonWrapper
                iconHeight={RfH(20)}
                iconWidth={RfW(16)}
                iconImage={isFocused ? Images.calendar_active : Images.calendar}
                imageResizeMode="contain"
              />
            );
          }
          if (name === 'My Classes') {
            return (
              <IconButtonWrapper
                iconHeight={RfH(20)}
                iconWidth={RfW(16)}
                iconImage={isFocused ? Images.classes_active : Images.classes}
                imageResizeMode="contain"
              />
            );
          }
          if (name === 'Wallet') {
            return (
              <IconButtonWrapper
                iconHeight={RfH(20)}
                iconWidth={RfW(16)}
                iconImage={isFocused ? Images.wallet_active : Images.wallet}
                imageResizeMode="contain"
              />
            );
          }
          if (name === 'Profile') {
            return (
              <IconButtonWrapper
                iconHeight={RfH(20)}
                iconWidth={RfW(16)}
                iconImage={isFocused ? Images.profile_active : Images.profile}
                imageResizeMode="contain"
              />
            );
          }
        };

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {renderIcon(label)}
            <Text
              style={{
                color: isFocused ? Colors.brandBlue2 : Colors.black,
                fontSize: RFValue(12, STANDARD_SCREEN_SIZE),
                marginTop: RfH(4),
              }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export function StudentBottomTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <MyTabBar {...props} />}
      initialRouteName={NavigationRouteNames.STUDENT.DASHBOARD}>
      <Tab.Screen
        options={{
          tabBarLabel: 'Home',
        }}
        name={NavigationRouteNames.STUDENT.DASHBOARD}
        component={StudentDashboard}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Calendar',
        }}
        name={NavigationRouteNames.CALENDAR}
        component={CalendarView}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'My Classes',
        }}
        name={NavigationRouteNames.STUDENT.MY_CLASSES}
        component={MyClasses}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Wallet',
        }}
        name={NavigationRouteNames.WALLET}
        component={Wallet}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Profile',
        }}
        name={NavigationRouteNames.STUDENT.PROFILE}
        component={StudentProfile}
      />
    </Tab.Navigator>
  );
}

export function TutorBottomTabs() {
  return (
    <Tab.Navigator initialRouteName={NavigationRouteNames.TUTOR.DASHBOARD} tabBar={(props) => <MyTabBar {...props} />}>
      <Tab.Screen
        options={{
          tabBarLabel: 'Home',
        }}
        name={NavigationRouteNames.TUTOR.DASHBOARD}
        component={TutorDashboard}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Calendar',
        }}
        name={NavigationRouteNames.CALENDAR}
        component={CalendarView}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Wallet',
        }}
        name={NavigationRouteNames.WALLET}
        component={Wallet}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Profile',
        }}
        name={NavigationRouteNames.TUTOR.PROFILE}
        component={TutorProfile}
      />
    </Tab.Navigator>
  );
}
