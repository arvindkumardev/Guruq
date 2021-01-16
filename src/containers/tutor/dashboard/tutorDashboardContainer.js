import { SafeAreaView, StatusBar } from 'react-native';
import React from 'react';
import commonStyles from '../../../theme/styles';
import { Colors } from '../../../theme';
import { TutorBottomTabs } from '../../../routes/bottomTabs';
import NotificationRedirection from '../../notification/notificationRedirection';

function TutorDashboardContainer(props) {
  return (
    <SafeAreaView style={[commonStyles.mainContainer, { paddingHorizontal: 0, backgroundColor: Colors.white }]}>
      <StatusBar barStyle="dark-content" />
      <TutorBottomTabs />
      <NotificationRedirection />
    </SafeAreaView>
  );
}

export default TutorDashboardContainer;
