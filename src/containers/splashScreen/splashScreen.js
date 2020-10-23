import { Image, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../../common/styles';
import styles from './styles';
import { Colors } from '../../theme';
import { getToken, RfH, RfW } from '../../utils/helpers';
import routeNames from '../../routes/ScreenNames';

function splashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    checkRoute();
  });

  const checkRoute = async () => {
    // const isOnBoardingShown = await getSaveData(LOCAL_STORAGE_DATA_KEY.ONBOARDING_SHOWN);
    // if (!isOnBoardingShown) {
    //   navigation.navigate(routeNames.ONBOARDING);
    // } else {
    const token = await getToken();
    if (token) {
      navigation.navigate(routeNames.DASHBOARD);
    } else {
      navigation.navigate(routeNames.ONBOARDING);
    }
    // }
  };
  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.onboardBackground }]}>
      <Image
        style={styles.splashImage}
        source={require('../../assets/images/splash_image.png')}
      />
      <Text
        style={styles.msgOne}>
        Find the best
      </Text>
      <Text
        style={styles.msgTwo}>
        Tutors and Institutes
      </Text>
      <Text
        style={styles.bottomMsg}>
        Powered by RHA Technologies
      </Text>
    </View>
  );
}

export default splashScreen;
