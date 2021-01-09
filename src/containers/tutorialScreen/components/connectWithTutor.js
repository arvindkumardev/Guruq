import { Image, Text, View } from 'react-native';
import React from 'react';
import styles from '../styles';
import Images from '../../../theme/images';

function ConnectWithTutors() {
  return (
    <View style={styles.swipeChild}>
      <Image resizeMode="stretch" style={styles.centerImage} source={Images.onBoardingThird} />
      <Text style={styles.title}>Connect with Tutors</Text>
      <Text style={styles.subtitle}>
        Students can connect with the best tutors and can take classes online and offline.
      </Text>
    </View>
  );
}

export default ConnectWithTutors;
