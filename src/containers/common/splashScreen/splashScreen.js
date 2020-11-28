import { Image, Text, View } from 'react-native';
import React from 'react';
import commonStyles from '../../../theme/styles';
import styles from './styles';
import { Colors } from '../../../theme';
import LoginCheck from '../login/loginCheck';

function SplashScreen() {
  return (
    <View style={[commonStyles.mainContainer, { paddingHorizontal: 0, backgroundColor: Colors.brandBlue }]}>
      <LoginCheck />
      <Image style={styles.splashImage} source={require('../../../assets/images/splash_image.png')} />
      <Text style={styles.msgOne}>Find the best</Text>
      <Text style={styles.msgTwo}>Tutors and Institutes</Text>
      <Text style={styles.bottomMsg}>Powered by RHA Technologies</Text>
    </View>
  );
}

export default SplashScreen;
