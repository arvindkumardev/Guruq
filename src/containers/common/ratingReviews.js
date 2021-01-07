import { Text, View, TouchableWithoutFeedback } from 'react-native';
import React, { useRef, useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import { ActionSheet, IconButtonWrapper, ScreenHeader, UserRatings, UserReviews } from '../../components';
import { RfH, RfW } from '../../utils/helpers';
import commonStyles from '../../theme/styles';
import { Colors, Fonts, Images } from '../../theme';
import { tutorDetails } from '../../apollo/cache';

function RatingReviews() {
  const tutorInfo = useReactiveVar(tutorDetails);

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader label="Rating & Reviews" homeIcon horizontalPadding={RfW(16)} />
      <View style={{ flex: 1, backgroundColor: Colors.white }}>
        <View style={{ height: RfH(44) }} />
        <UserRatings tutorId={tutorInfo.id} />
        <View style={[commonStyles.lineSeparator, { flex: 0, marginTop: RfH(16) }]} />
        <UserReviews tutorId={tutorInfo.id} />
      </View>
    </View>
  );
}

export default RatingReviews;
