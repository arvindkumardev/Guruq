import { SafeAreaView, StatusBar, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Container, Content, Footer, FooterTab, Thumbnail } from 'native-base';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import styles from './styles';
import TutorDashboard from './components/tutorDashboard';
import CalendarView from '../calendar/calendarView';
import BottomTab from './components/bottomTab';
import ClassView from '../classes/classesView';
import Performance from '../performance/performance';

function TutorDashboardContainer(props) {
  const [activeTab, setActiveTab] = useState(1);

  const { route } = props;
  const refetchStudentOfferings = route?.params?.refetchStudentOfferings;

  const changeTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <SafeAreaView style={[commonStyles.mainContainer, { paddingHorizontal: 0, backgroundColor: Colors.white }]}>
      <StatusBar barStyle="dark-content" />
      <Container>
        <View style={{ flex: 1 }}>
          {activeTab === 1 && (
            <TutorDashboard refetchStudentOfferings={refetchStudentOfferings} changeTab={() => changeTab(2)} />
          )}
          {activeTab === 2 && <CalendarView changeTab={() => changeTab(3)} />}
          {activeTab === 3 && <ClassView />}
          {activeTab === 4 && <Performance />}
          {/* {activeTab === 5 && <Profile />} */}
        </View>
        <BottomTab activeTab={activeTab} changeTab={changeTab} />
      </Container>
    </SafeAreaView>
  );
}

export default TutorDashboardContainer;
