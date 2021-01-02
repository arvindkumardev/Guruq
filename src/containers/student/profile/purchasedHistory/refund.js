import { Text, View } from 'react-native';
import React from 'react';
import { Button } from 'native-base';
import { ScreenHeader } from '../../../../components';
import commonStyles from '../../../../theme/styles';
import { Colors, Fonts } from '../../../../theme';
import { RfH, RfW } from '../../../../utils/helpers';

function Refund() {
  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader label="Refund" homeIcon horizontalPadding={RfW(16)} />
      <View style={{ paddingHorizontal: RfW(16) }}>
        <View style={{ height: RfH(32) }} />
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.bold }]}>Bookinggqid73839</Text>
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>Sept 25,2020</Text>
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
              <Text style={[commonStyles.mediumMutedText, { fontFamily: Fonts.semiBold }]}>₹1200</Text>
            </View>
            <View style={commonStyles.horizontalChildrenSpaceView}>
              <Text style={commonStyles.mediumMutedText}>Convenience charges</Text>
              <Text style={[commonStyles.mediumMutedText, { fontFamily: Fonts.semiBold }]}>₹100</Text>
            </View>
          </View>
          <View style={{ height: RfH(16) }} />
          <View style={[commonStyles.lineSeparator, { flex: 0 }]} />
          <View>
            <View style={{ height: RfH(16) }} />
            <View style={commonStyles.horizontalChildrenSpaceView}>
              <Text style={commonStyles.mediumMutedText}>Paid by Q points</Text>
              <Text style={[commonStyles.mediumMutedText, { fontFamily: Fonts.semiBold }]}>₹300</Text>
            </View>
            <View style={commonStyles.horizontalChildrenSpaceView}>
              <Text style={commonStyles.mediumMutedText}>GURUQ1ST Applied</Text>
              <Text style={[commonStyles.mediumMutedText, { fontFamily: Fonts.semiBold }]}>₹200</Text>
            </View>
            <View style={{ height: RfH(16) }} />
          </View>
          <View style={[commonStyles.lineSeparator, { flex: 0 }]} />
          <View style={{ height: RfH(16) }} />
          <View style={[commonStyles.horizontalChildrenSpaceView, { marginBottom: RfH(8) }]}>
            <Text style={[commonStyles.mediumPrimaryText, { fontFamily: Fonts.bold }]}>Total amount paid</Text>
            <Text style={[commonStyles.mediumPrimaryText, { fontFamily: Fonts.bold }]}>₹800</Text>
          </View>
        </View>
      </View>
      <View style={{ height: RfH(32) }} />
      <Button style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
        <Text style={commonStyles.textButtonPrimary}>Submit</Text>
      </Button>
    </View>
  );
}

export default Refund;
