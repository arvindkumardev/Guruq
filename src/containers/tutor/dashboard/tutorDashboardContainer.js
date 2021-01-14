import { BackHandler, SafeAreaView, StatusBar, View } from 'react-native';
import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import commonStyles from '../../../theme/styles';
import { Colors } from '../../../theme';
import { alertBox } from '../../../utils/helpers';
import { TutorBottomTabs } from '../../../routes/bottomTabs';

function TutorDashboardContainer(props) {
  const [activeTab, setActiveTab] = useState(1);

  useFocusEffect(() => {
    const backAction = () => {
      if (activeTab === 1) {
        alertBox('Alert', 'Do you really want to exit?', {
          positiveText: 'Yes',
          onPositiveClick: () => {
            BackHandler.exitApp();
          },
          negativeText: 'No',
        });
      } else {
        setActiveTab(1);
      }
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={[commonStyles.mainContainer, { paddingHorizontal: 0, backgroundColor: Colors.white }]}>
      <StatusBar barStyle="dark-content" />
      <TutorBottomTabs />
    </SafeAreaView>
  );
}

export default TutorDashboardContainer;
