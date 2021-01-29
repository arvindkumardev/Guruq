import { Image, Text, View } from 'react-native';
import React from 'react';
import styles from '../styles';
import Images from '../../../theme/images';

function ConnectWithTutors() {
  return (
    <View style={styles.swipeChild}>
      <Image resizeMode="contain" style={styles.centerImage} source={Images.onBoardingThird} />
      <Text style={styles.title}>Connect with Your Tutors</Text>
      <Text style={styles.subtitle}>Connect with your favourite tutors to take classes online or offline</Text>
    </View>
  );
}

export default ConnectWithTutors;
