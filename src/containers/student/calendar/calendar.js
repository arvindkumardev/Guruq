import { Image, Text, View } from 'react-native';
import React from 'react';
import commonStyles from '../../../theme/styles';
import { Colors } from '../../../theme';

function calendar() {
  return (
    <View style={commonStyles.mainContainer}>
      <Text>You are on Calendar</Text>
    </View>
  );
}

export default calendar;
