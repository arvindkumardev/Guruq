import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import commonStyles from '../../../common/styles';
import styles from './styles';
import Colors from '../../../theme/colors';
import ScheduleClass from './components/scheduleClass';
import FindTutors from './components/findTutors';
import ConnectWithTutor from './components/connectWithTutor';
import { RfH, storeData } from '../../../utils/helpers';
import { LOCAL_STORAGE_DATA_KEY } from '../../../utils/constants';
import routeNames from '../../../routes/ScreenNames';

function scheduleClass() {
  const navigation = useNavigation();

  const goToLogin = () => {
    storeData(LOCAL_STORAGE_DATA_KEY.ONBOARDING_SHOWN, true);
    navigation.navigate(routeNames.LOGIN);
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.onboardBackground }]}>
      <StatusBar barStyle="light-content" />
      <TouchableOpacity onPress={() => goToLogin()}>
        <Text style={styles.skip}>Skip</Text>
      </TouchableOpacity>
      <Swiper horizontal autoplay autoplayTimeout={3}>
        <View>
          <ScheduleClass />
        </View>
        <View>
          <FindTutors />
        </View>
        <View>
          <ConnectWithTutor />
        </View>
      </Swiper>
      <TouchableOpacity style={[commonStyles.buttonPrimary, { marginBottom: RfH(58) }]} onPress={() => goToLogin()}>
        <Text style={commonStyles.textButtonPrimary}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

export default scheduleClass;
