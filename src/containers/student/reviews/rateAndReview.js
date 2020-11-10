import { Image, Text, View } from 'react-native';
import React from 'react';
import { ScreenHeader } from '../../../components';
import commonStyles from '../../../theme/styles';

function RateAndReviews() {
  return (
    <View style={commonStyles.mainContainer}>
      <ScreenHeader homeIcon label="Rate & Review" />
    </View>
  );
}

export default RateAndReviews;
