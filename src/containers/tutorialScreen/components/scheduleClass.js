import { Image, Text, View } from 'react-native';
import React from 'react';
import styles from '../styles';
import Images from '../../../theme/images';

function ScheduleClass() {
  return (
    <View style={styles.swipeChild}>
      <Image style={styles.centerImage} source={Images.onBoardingFirst} />
      <Text style={styles.title}>Schedule Your Class</Text>
      <Text style={styles.subtitle}>Schedule your class based on your convenience</Text>
    </View>
  );
}

export default ScheduleClass;
