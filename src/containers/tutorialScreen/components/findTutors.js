import { Image, Text, View } from 'react-native';
import React from 'react';
import styles from '../styles';
import Images from '../../../theme/images';

function FindTutors() {
  return (
    <View style={styles.swipeChild}>
      <Image resizeMode="contain" style={styles.centerImage} source={Images.onBoardingSecond} />
      <Text style={styles.title}> Find the Best Tutors</Text>
      <Text style={styles.subtitle}>Choose from top tutors across India</Text>
    </View>
  );
}

export default FindTutors;
