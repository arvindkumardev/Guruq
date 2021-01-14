import { SafeAreaView, StatusBar } from 'react-native';
import React, { useEffect } from 'react';
import GetLocation from 'react-native-get-location';
import commonStyles from '../../../theme/styles';
import { Colors } from '../../../theme';
import { userLocation } from '../../../apollo/cache';
import { StudentBottomTabs } from '../../../routes/bottomTabs';

function StudentDashboardContainer(props) {
  useEffect(() => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then((location) => {
        userLocation(location);
      })
      .catch((error) => {
        const { code, message } = error;
        console.warn(code, message);
      });
  });

  return (
    <>
      <SafeAreaView style={[commonStyles.mainContainer, { paddingHorizontal: 0, backgroundColor: Colors.white }]}>
        <StatusBar barStyle="light-content" />
        <StudentBottomTabs />
      </SafeAreaView>
      <SafeAreaView style={{ flex: 0, backgroundColor: Colors.white }} />
    </>
  );
}

export default StudentDashboardContainer;
