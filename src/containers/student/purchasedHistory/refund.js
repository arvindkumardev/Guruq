import { Text, View } from 'react-native';
import React from 'react';
import { Loader, ScreenHeader } from '../../../components';
import commonStyles from '../../../theme/styles';
import { Colors, Fonts } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';

function Refund(props) {
  const { route } = props;
  const bookingData = route?.params?.bookingData;

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader label="Refund Details" homeIcon horizontalPadding={RfW(16)} />
      <View style={{ paddingHorizontal: RfW(16) }}>
        <View style={{ height: RfH(32) }} />
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.bold }]}>Order Details</Text>
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>
            ₹ {bookingData?.payableAmount ? parseFloat(bookingData?.payableAmount).toFixed(2) : '0.00'}
          </Text>
        </View>
      </View>
      <View style={{ height: RfH(24) }} />
      <View />
      <View style={{ height: RfH(32) }} />
    </View>
  );
}

export default Refund;
