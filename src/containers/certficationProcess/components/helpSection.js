import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { ActionSheet } from '../../../components';
import NavigationRouteNames from '../../../routes/screenNames';
import {
  interestingOfferingData,
  isLoggedIn,
  isSplashScreenVisible,
  isTokenLoading,
  networkConnectivityError,
  notificationPayload,
  offeringsMasterData,
  studentDetails,
  tutorDetails,
  userDetails,
  userLocation,
  userType,
} from '../../../apollo/cache';
import { clearAllLocalStorage, removeToken } from '../../../utils/helpers';
import initializeApollo from '../../../apollo/apollo';

const HelpSectionActionModal = ({ closeMenu, isVisible }) => {
  const navigation = useNavigation();
  const client = initializeApollo();
  const openPressHelp = () => {
    closeMenu(false);
    navigation.navigate(NavigationRouteNames.CUSTOMER_CARE);
  };

  const logout = () => {
    closeMenu(false);
    removeToken().then(() => {
      isTokenLoading(true);
      isLoggedIn(false);
      isSplashScreenVisible(true);
      userType('');
      networkConnectivityError(false);
      userDetails({});
      studentDetails({});
      tutorDetails({});
      userLocation({});
      offeringsMasterData([]);
      interestingOfferingData([]);
      notificationPayload({});
    });

    clearAllLocalStorage(); // .then(() => {
    client.resetStore(); // .then(() => {});
  };

  const [menuItem, setMenuItem] = useState([
    { label: 'Help', handler: openPressHelp, isEnabled: true },
    { label: 'Login as Another User', handler: logout, isEnabled: true },
  ]);

  return (
    <ActionSheet
      actions={menuItem}
      cancelText="Dismiss"
      handleCancel={() => closeMenu(false)}
      isVisible={isVisible}
      isTopLabelVisible={false}
    />
  );
};

export default HelpSectionActionModal;
