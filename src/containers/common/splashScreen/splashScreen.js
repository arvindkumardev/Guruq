import { Image, Text, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import commonStyles from '../../../common/styles';
import styles from './styles';
import { Colors } from '../../../theme';
// import routeNames from '../../../routes/ScreenNames';
import NavigationRouteNames from '../../../routes/ScreenNames';
import { ME_QUERY } from '../graphql-query';
import { UserTypeEnum } from '../../../common/userType.enum';

function splashScreen() {
  const navigation = useNavigation();
  //
  // useEffect(() => {
  //   checkRoute();
  // });
  //
  // const checkRoute = async () => {
  //   // const isOnBoardingShown = await getSaveData(LOCAL_STORAGE_DATA_KEY.ONBOARDING_SHOWN);
  //   // if (!isOnBoardingShown) {
  //   //   navigation.navigate(routeNames.ON_BOARDING);
  //   // } else {
  //   const token = await getToken();
  //   if (token) {
  //     // TODO: check user type and send to corresponding dashboard
  //     navigation.navigate(NavigationRouteNames.STUDENT.DASHBOARD);
  //   } else {
  //     navigation.navigate(routeNames.ON_BOARDING);
  //   }
  //   // }
  // };

  const { loading } = useQuery(ME_QUERY, {
    onError: (e) => {
      navigation.navigate(NavigationRouteNames.ON_BOARDING);
    },
    onCompleted: (d) => {
      if (d) {
        if (d.type === UserTypeEnum.TUTOR.label) {
          navigation.navigate(NavigationRouteNames.TUTOR.DASHBOARD);
        } else {
          navigation.navigate(NavigationRouteNames.STUDENT.DASHBOARD);
        }
        // } else {
        //   navigation.navigate(NavigationRouteNames.ON_BOARDING);
      }
    },
  });

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.onboardBackground }]}>
      <Image style={styles.splashImage} source={require('../../../assets/images/splash_image.png')} />
      <Text style={styles.msgOne}>Find the best</Text>
      <Text style={styles.msgTwo}>Tutors and Institutes</Text>
      <Text style={styles.bottomMsg}>Powered by RHA Technologies</Text>
    </View>
  );
}

export default splashScreen;
