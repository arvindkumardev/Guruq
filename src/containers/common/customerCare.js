import { View, Text } from 'react-native';
import React from 'react';
import { IconButtonWrapper, ScreenHeader } from '../../components';
import commonStyles from '../../theme/styles';
import { Colors, Fonts, Images } from '../../theme';
import { RfH, RfW } from '../../utils/helpers';

function CustomerCare() {
  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader label="Customer Care" homeIcon horizontalPadding={RfW(16)} lineVisible={false} />
      <View style={{ height: RfH(44) }} />
      <View style={{ paddingHorizontal: RfW(16) }}>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={commonStyles.regularMutedText}>contact@guruq.in</Text>
          <IconButtonWrapper iconWidth={RfH(24)} iconHeight={RfH(16)} iconImage={Images.email} />
        </View>
        <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={commonStyles.regularMutedText}>1800-419-7300</Text>
          <IconButtonWrapper iconWidth={RfH(20)} iconHeight={RfH(20)} iconImage={Images.call_blue} />
        </View>
        <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={commonStyles.regularMutedText}>+91-9891587300</Text>
          <IconButtonWrapper iconWidth={RfH(20)} iconHeight={RfH(20)} iconImage={Images.whatsapp} />
        </View>
        <View style={[commonStyles.lineSeparator, { marginTop: RfH(16) }]} />
        <View style={{ height: RfH(32) }} />
        <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>
          Need help with recent Bookings?
        </Text>
        <View style={{ height: RfH(20) }} />
      </View>
    </View>
  );
}

export default CustomerCare;
