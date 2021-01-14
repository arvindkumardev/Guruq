import { BackHandler, SafeAreaView, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import GetLocation from 'react-native-get-location';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import commonStyles from '../../../theme/styles';
import { Colors } from '../../../theme';
import { userLocation } from '../../../apollo/cache';
import { alertBox } from '../../../utils/helpers';
import { StudentBottomTabs } from '../../../routes/bottomTabs';

function StudentDashboardContainer(props) {
  const [activeTab, setActiveTab] = useState(1);
  const isFocussed = useIsFocused();
  const { route } = props;

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

  useEffect(() => {
    if (route?.params?.tabId && isFocussed) {
      setActiveTab(route?.params?.tabId);
    }
  }, [isFocussed]);

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
    <>
      <SafeAreaView style={[commonStyles.mainContainer, { paddingHorizontal: 0, backgroundColor: Colors.white }]}>
        <StatusBar barStyle="dark-content" />
        <StudentBottomTabs />
      </SafeAreaView>
      <SafeAreaView style={{ flex: 0, backgroundColor: Colors.white }} />
    </>
  );
}

export default StudentDashboardContainer;
