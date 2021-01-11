import { BackHandler, SafeAreaView, StatusBar, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Container } from 'native-base';
import GetLocation from 'react-native-get-location';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import commonStyles from '../../../theme/styles';
import { Colors } from '../../../theme';
import CalendarView from '../../calendar/calendarView';
import MyClasses from '../../myClasses/classes';
import Profile from '../profile/profile';
import StudentDashboard from './components/studentDashboard';
import { userLocation } from '../../../apollo/cache';
import BottomTab from './components/bottomTab';
import { alertBox } from '../../../utils/helpers';
import Wallet from '../../wallet/wallet';

function StudentDashboardContainer(props) {
  const [activeTab, setActiveTab] = useState(1);
  const isFocussed = useIsFocused();
  const { route } = props;

  const changeTab = (tab) => {
    setActiveTab(tab);
  };

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
        <Container>
          <View style={{ flex: 1 }}>
            {activeTab === 1 && <StudentDashboard changeTab={changeTab} />}
            {activeTab === 2 && <CalendarView changeTab={() => changeTab(3)} />}
            {activeTab === 3 && <MyClasses />}
            {activeTab === 4 && <Wallet />}
            {activeTab === 5 && <Profile changeTab={(t) => changeTab(t)} />}
          </View>
          <BottomTab activeTab={activeTab} changeTab={changeTab} />
        </Container>
      </SafeAreaView>
      <SafeAreaView style={{ flex: 0, backgroundColor: Colors.white }} />
    </>
  );
}

export default StudentDashboardContainer;
