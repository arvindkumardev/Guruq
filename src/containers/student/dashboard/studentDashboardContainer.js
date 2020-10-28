import { SafeAreaView, StatusBar, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Button, Container, Content, Footer, FooterTab, Thumbnail } from 'native-base';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import styles from './styles';
import Calendar from '../calendar/calendar';
import Classes from '../classes/classes';
import Tutor from '../tutor/tutor';
import Profile from '../profile/profile';
import StudentDashboard from './components/dashboard';

function StudentDashboardContainer() {
  const [activeTab, setActiveTab] = useState(1);

  const changeTab = (number) => {
    setActiveTab(number);
  };

  return (
    <SafeAreaView style={[commonStyles.mainContainer, { backgroundColor: Colors.white }]}>
      <StatusBar barStyle="light-content" />
      <Container>
        <Content>
          <View>
            {activeTab === 1 && <StudentDashboard />}
            {activeTab === 2 && <Calendar />}
            {activeTab === 3 && <Classes />}
            {activeTab === 4 && <Tutor />}
            {activeTab === 5 && <Profile />}
          </View>
        </Content>

        <Footer style={{ height: 48 }}>
          <FooterTab style={{ backgroundColor: Colors.white }}>
            <Button
              style={{ backgroundColor: Colors.white }}
              vertical
              active={activeTab === 1}
              onPress={() => changeTab(1)}>
              <Thumbnail
                square
                style={{ height: 17, width: 17.7 }}
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
                style={{ height: 18.7, width: 19.2 }}
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
                style={{ height: 18.4, width: 18.4 }}
                source={activeTab === 3 ? Images.classes_active : Images.classes}
              />
              <Text style={activeTab === 3 ? styles.bottomTabActive : styles.bottomText}>Classes</Text>
            </Button>
            <Button
              style={{ backgroundColor: Colors.white }}
              vertical
              active={activeTab === 4}
              onPress={() => changeTab(4)}>
              <Thumbnail
                square
                style={{ height: 16.8, width: 20.8 }}
                source={activeTab === 4 ? Images.tutor_active : Images.tutor_tab}
              />
              <Text style={activeTab === 4 ? styles.bottomTabActive : styles.bottomText}>Tutor</Text>
            </Button>
            <Button
              style={{ backgroundColor: Colors.white }}
              vertical
              active={activeTab === 5}
              onPress={() => changeTab(5)}>
              <Thumbnail
                square
                style={{ height: 16, width: 13.9 }}
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
