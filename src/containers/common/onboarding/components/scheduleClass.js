import { Image, Text, View } from 'react-native';
import React from 'react';
import styles from '../styles';
import Images from '../../../../theme/Images';

function scheduleClass() {
  return (
    <View style={styles.swipeChild}>
      <Image style={styles.centerImage} source={Images.onboarding1} />
      <Text style={styles.title}>Schedule The Class</Text>
      <Text style={styles.subtitle}>Schedule your class according to your prefrence</Text>
    </View>
  );
}

export default scheduleClass;
