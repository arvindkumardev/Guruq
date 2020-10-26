import { Image, Text, View } from 'react-native';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import commonStyles from '../../../theme/styles';
import styles from './styles';
import { Colors } from '../../../theme';
import { ME_QUERY } from '../graphql-query';
import { isLoggedIn, isTokenLoading, userDetails } from '../../../apollo/cache';

function splashScreen() {
  const { loading, error, data } = useQuery(ME_QUERY, { fetchPolicy: 'no-cache' });

  if (error) {
    isLoggedIn(false);
    isTokenLoading(false);
    userDetails({});
  }
  if (data) {
    isLoggedIn(true);
    isTokenLoading(false);
    userDetails(data.me);
  }

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
