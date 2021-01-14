import { SafeAreaView, StatusBar } from 'react-native';
import React, { useState } from 'react';
import commonStyles from '../../../theme/styles';
import { Colors } from '../../../theme';
import { TutorBottomTabs } from '../../../routes/bottomTabs';

function TutorDashboardContainer(props) {
  return (
    <SafeAreaView style={[commonStyles.mainContainer, { paddingHorizontal: 0, backgroundColor: Colors.white }]}>
      <StatusBar barStyle="dark-content" />
      <TutorBottomTabs />
    </SafeAreaView>
  );
}

export default TutorDashboardContainer;
