import { Image, Text, View } from 'react-native';
import React, { useEffect} from 'react';
import { useQuery } from '@apollo/react-hooks';
import commonStyles from '../../../theme/styles';
import styles from './styles';
import { Colors } from '../../../theme';
import { ME_QUERY } from '../graphql-query';
import { isLoggedIn, isTokenLoading, userDetails } from '../../../apollo/cache';

function splashScreen() {
  const { loading, error, data } = useQuery(ME_QUERY, {
    pollInterval:0,
    notifyOnNetworkStatusChange: true,
    onError: (e) => {
      isLoggedIn(false);
      isTokenLoading(false);
      userDetails({});
    },
    onCompleted: (d) => {
      isLoggedIn(true);
      isTokenLoading(false);
      userDetails(d.me);
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
