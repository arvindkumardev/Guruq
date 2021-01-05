import { View } from 'react-native';
import React from 'react';
import { ScreenHeader } from '../../../components';
import commonStyles from '../../../theme/styles';
import { Colors } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';

function AboutUs() {
  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader label="About Us" homeIcon horizontalPadding={RfW(16)} lineVisible={false} />
      <View style={{ height: RfH(44) }} />
      <View style={{ paddingHorizontal: RfW(16) }} />
    </View>
  );
}

export default AboutUs;
