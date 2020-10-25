import { Image, Text, View } from 'react-native';
import React from 'react';
import commonStyles from '../../../common/styles';
import styles from './styles';
import { Colors } from '../../../theme';

function splashScreen() {
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
