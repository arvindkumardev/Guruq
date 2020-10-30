import { SafeAreaView, StatusBar, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Button, Container, Footer, FooterTab, Thumbnail } from 'native-base';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import styles from './styles';
import Calendar from '../calendar/calendar';
import Classes from '../classes/classes';
import TutorListing from '../tutor/tutorListing';
import Profile from '../profile/profile';
import { RfH, RfW } from '../../../utils/helpers';
import StudentDashboard from './components/studentDashboard';

function StudentDashboardContainer(props) {
  const [activeTab, setActiveTab] = useState(1);

  const { route } = props;
  const refetchStudentOfferings = route?.params?.refetchStudentOfferings;

  const changeTab = (number) => {
    setActiveTab(number);
  };

  return (
    <SafeAreaView style={[commonStyles.mainContainer, { paddingHorizontal: 0, backgroundColor: Colors.white }]}>
      <StatusBar barStyle="light-content" />
      <Container>
        <View style={{ flex: 1 }}>
          {activeTab === 1 && <StudentDashboard refetchStudentOfferings={refetchStudentOfferings} />}
          {activeTab === 2 && <Calendar />}
          {activeTab === 3 && <Classes />}
          {/* {activeTab === 4 && <TutorListing />} */}
          {activeTab === 5 && <Profile />}
        </View>
        <Footer>
          <FooterTab style={{ backgroundColor: Colors.white }}>
            <Button
              style={{ backgroundColor: Colors.white }}
              vertical
              active={activeTab === 1}
              onPress={() => changeTab(1)}>
              <Thumbnail
                square
                style={{ height: RfH(17), width: RfW(17.7) }}
                source={activeTab === 1 ? Images.home_active : Images.home}
              />
              <Text style={activeTab === 1 ? styles.bottomTabActive : styles.bottomText}>Home</Text>
            </Button>
            <Button
              style={{ backgroundColor: Colors.white }}
              vertical
              active={activeTab === 2}
              onPress={() => changeTab(2)}>
              <Thumbnail
                square
                style={{ height: RfH(18.7), width: RfW(19.2) }}
                source={activeTab === 2 ? Images.calendar_active : Images.calendar}
              />
              <Text style={activeTab === 2 ? styles.bottomTabActive : styles.bottomText}>Calendar</Text>
            </Button>
            <Button
              style={{ backgroundColor: Colors.white }}
              vertical
              active={activeTab === 3}
              onPress={() => changeTab(3)}>
              <Thumbnail
                square
                style={{ height: RfH(18.4), width: RfW(18.4) }}
                source={activeTab === 3 ? Images.classes_active : Images.classes}
              />
              <Text style={activeTab === 3 ? styles.bottomTabActive : styles.bottomText}>Classes</Text>
            </Button>
            {/* <Button */}
            {/*  style={{ backgroundColor: Colors.white }} */}
            {/*  vertical */}
            {/*  active={activeTab === 4} */}
            {/*  onPress={() => changeTab(4)}> */}
            {/*  <Thumbnail */}
            {/*    square */}
            {/*    style={{ height: RfH(16.8), width: RfW(20.8) }} */}
            {/*    source={activeTab === 4 ? Images.tutor_active : Images.tutor_tab} */}
            {/*  /> */}
            {/*  <Text style={activeTab === 4 ? styles.bottomTabActive : styles.bottomText}>Tutor</Text> */}
            {/* </Button> */}
            <Button
              style={{ backgroundColor: Colors.white }}
              vertical
              active={activeTab === 5}
              onPress={() => changeTab(5)}>
              <Thumbnail
                square
                style={{ height: RfH(16), width: RfW(13.9) }}
                source={activeTab === 5 ? Images.user_active : Images.profile}
              />
              <Text style={activeTab === 5 ? styles.bottomTabActive : styles.bottomText}>Profile</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    </SafeAreaView>
  );
}

export default StudentDashboardContainer;
