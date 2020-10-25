import { View, Image, Text } from 'react-native';
import React from 'react';
import styles from '../styles';
import Images from '../../../../theme/Images';

function findTutors() {
  return (
    <View style={styles.swipeChild}>
      <Image resizeMode="stretch" style={styles.centerImage} source={Images.onboarding2} />
      <Text style={styles.title}>Find Best Tutors</Text>
      <Text style={styles.subtitle}>Find the list of best tutors.</Text>
    </View>
  );
}

export default findTutors;
