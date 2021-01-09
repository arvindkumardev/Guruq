import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { ActionSheet } from '../../../components';
import NavigationRouteNames from '../../../routes/screenNames';
import { logout } from '../../../utils/helpers';

const HelpSectionActionModal = ({ closeMenu, isVisible }) => {
  const navigation = useNavigation();
  const openPressHelp = () => {
    closeMenu(false);
    navigation.navigate(NavigationRouteNames.CUSTOMER_CARE);
  };

  const logoutHandle = () => {
    closeMenu(false);
    logout();
  };

  const [menuItem, setMenuItem] = useState([
    { label: 'Help', handler: openPressHelp, isEnabled: true },
    { label: 'Login as Another User', handler: logoutHandle, isEnabled: true },
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
