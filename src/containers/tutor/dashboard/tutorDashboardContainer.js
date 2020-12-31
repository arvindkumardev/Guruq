import { SafeAreaView, StatusBar, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Container } from 'native-base';
import { useLazyQuery } from '@apollo/client';
import commonStyles from '../../../theme/styles';
import { Colors } from '../../../theme';
import TutorDashboard from './components/tutorDashboard';
import BottomTab from './components/bottomTab';
import Profile from '../profile/profile';
import Wallet from '../../common/wallet/wallet';
import CalendarView from '../../calendar/calendarView';
import MyClasses from '../../myClasses/classes';

import { GET_OFFERINGS_MASTER_DATA } from '../../student/dashboard-query';
import { offeringsMasterData } from '../../../apollo/cache';

function TutorDashboardContainer(props) {
  const [activeTab, setActiveTab] = useState(1);

  const changeTab = (tab) => {
    setActiveTab(tab);
  };

  console.log('saass');

  const [getOfferingMasterData] = useLazyQuery(GET_OFFERINGS_MASTER_DATA, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        offeringsMasterData(data.offerings.edges);
      }
    },
  });

  useEffect(() => {
    getOfferingMasterData();
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
          {activeTab === 5 && <Profile changeTab={() => changeTab(3)} />}
        </View>
        <BottomTab activeTab={activeTab} changeTab={changeTab} />
      </Container>
    </SafeAreaView>
  );
}

export default TutorDashboardContainer;
