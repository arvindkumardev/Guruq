import { BackHandler, SafeAreaView, StatusBar, View } from 'react-native';
import React, { useState } from 'react';
import { Container } from 'native-base';
import { useFocusEffect } from '@react-navigation/native';
import commonStyles from '../../../theme/styles';
import { Colors } from '../../../theme';
import TutorDashboard from './components/tutorDashboard';
import BottomTab from './components/bottomTab';
import Profile from '../profile/profile';
import Wallet from '../../common/wallet/wallet';
import CalendarView from '../../calendar/calendarView';
import MyClasses from '../../myClasses/classes';
import { alertBox } from '../../../utils/helpers';

function TutorDashboardContainer(props) {
  const [activeTab, setActiveTab] = useState(1);

  const changeTab = (tab) => {
    setActiveTab(tab);
  };

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
      <Container>
        <View style={{ flex: 1 }}>
          {activeTab === 1 && <TutorDashboard changeTab={changeTab} />}
          {activeTab === 2 && <CalendarView changeTab={changeTab} />}
          {activeTab === 3 && <MyClasses />}
          {activeTab === 4 && <Wallet />}
          {activeTab === 5 && <Profile changeTab={changeTab} />}
        </View>
        <BottomTab activeTab={activeTab} changeTab={changeTab} />
      </Container>
    </SafeAreaView>
  );
}

export default TutorDashboardContainer;
