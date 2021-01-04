import { Text, View } from 'react-native';
import React from 'react';
import { Button } from 'native-base';
import { Loader, ScreenHeader } from '../../../../components';
import commonStyles from '../../../../theme/styles';
import { Colors, Fonts } from '../../../../theme';
import { RfH, RfW } from '../../../../utils/helpers';

function Refund(props) {
  const { route } = props;
  const bookingData = route?.params?.bookingData;

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader label="Refund" homeIcon horizontalPadding={RfW(16)} />
      <View style={{ paddingHorizontal: RfW(16) }}>
        <View style={{ height: RfH(32) }} />
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.bold }]}>Booking Id {bookingData.id}</Text>
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>
            {new Date(bookingData.createdDate).toDateString()}
          </Text>
        </View>
      </View>
      <View style={{ height: RfH(24) }} />
      <View>
        <Text style={{ paddingHorizontal: RfW(16), paddingVertical: RfH(12) }}>Payment details</Text>
        <View style={[commonStyles.lineSeparator, { flex: 0 }]} />
        <View style={{ height: RfH(16) }} />
        <View style={{ paddingHorizontal: RfW(16) }}>
          <View>
            <View style={commonStyles.horizontalChildrenSpaceView}>
              <Text style={commonStyles.mediumMutedText}>Amount</Text>
              <Text style={[commonStyles.mediumMutedText, { fontFamily: Fonts.semiBold }]}>
                ₹{parseFloat(bookingData.payableAmount).toFixed(2)}
              </Text>
            </View>
            <View style={commonStyles.horizontalChildrenSpaceView}>
              <Text style={commonStyles.mediumMutedText}>Convenience charges</Text>
              <Text style={[commonStyles.mediumMutedText, { fontFamily: Fonts.semiBold }]}>
                ₹{bookingData.convenienceCharges ? parseFloat(bookingData.convenienceCharges).toFixed(2) : '0.00'}
              </Text>
            </View>
          </View>
          <View style={{ height: RfH(16) }} />
          <View style={[commonStyles.lineSeparator, { flex: 0 }]} />
          <View>
            <View style={{ height: RfH(16) }} />
            <View style={commonStyles.horizontalChildrenSpaceView}>
              <Text style={commonStyles.mediumMutedText}>Paid by Q points</Text>
              <Text style={[commonStyles.mediumMutedText, { fontFamily: Fonts.semiBold }]}>
                ₹{bookingData.pointsRedeemed ? parseFloat(bookingData.pointsRedeemed).toFixed(2) : '0.00'}
              </Text>
            </View>
            {bookingData?.promotion?.code && (
              <View style={commonStyles.horizontalChildrenSpaceView}>
                <Text style={commonStyles.mediumMutedText}>{bookingData?.promotion?.code} Applied</Text>
                <Text style={[commonStyles.mediumMutedText, { fontFamily: Fonts.semiBold }]}>₹200</Text>
              </View>
            )}
            <View style={{ height: RfH(16) }} />
          </View>
          <View style={[commonStyles.lineSeparator, { flex: 0 }]} />
          <View style={{ height: RfH(16) }} />
          <View style={[commonStyles.horizontalChildrenSpaceView, { marginBottom: RfH(8) }]}>
            <Text style={[commonStyles.mediumPrimaryText, { fontFamily: Fonts.bold }]}>Total amount paid</Text>
            <Text style={[commonStyles.mediumPrimaryText, { fontFamily: Fonts.bold }]}>
              ₹{bookingData?.payableAmount ? parseFloat(bookingData?.payableAmount).toFixed(2) : '0.00'}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ height: RfH(32) }} />
      {/* <Button style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
        <Text style={commonStyles.textButtonPrimary}>Submit</Text>
      </Button> */}
    </View>
  );
}

export default Refund;
