import { Text, View } from 'react-native';
import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'native-base';
import { IconButtonWrapper, Loader, ScreenHeader } from '../../../components';
import commonStyles from '../../../theme/styles';
import { Colors, Fonts } from '../../../theme';
import { getSubjectIcons, RfH, RfW } from '../../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';

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
            ₹ {bookingData?.price ? parseFloat(bookingData?.price).toFixed(2) : '0.00'}
          </Text>
        </View>
        <Text style={commonStyles.mediumMutedText}>
          {bookingData?.offering?.parentOffering?.parentOffering?.name} | {bookingData?.offering?.parentOffering?.name}
        </Text>
        <View style={[commonStyles.lineSeparator, { marginTop: RfH(8) }]} />
        <View
          style={[commonStyles.horizontalChildrenSpaceView, { paddingVertical: RfH(16), alignItems: 'flex-start' }]}>
          <View style={commonStyles.horizontalChildrenView}>
            <IconButtonWrapper
              iconHeight={RfH(52)}
              iconWidth={RfH(52)}
              iconImage={getSubjectIcons(bookingData?.offering?.name)}
              styling={{ borderRadius: RfH(8) }}
            />
            <View style={{ marginLeft: RfH(8) }}>
              <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>
                {bookingData?.offering?.name}
              </Text>
              <Text style={commonStyles.mediumMutedText}>₹{bookingData?.mrp}/per class</Text>
            </View>
          </View>
          <View style={[commonStyles.verticallyCenterItemsView, { alignSelf: 'flex-end' }]}>
            <Text
              style={[
                commonStyles.headingPrimaryText,
                { backgroundColor: Colors.lightBlue, padding: RfH(8), borderRadius: 8 },
              ]}>
              {bookingData?.count}
            </Text>
            <Text style={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>Total</Text>
            <Text style={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>Classes</Text>
          </View>
        </View>
        <View style={commonStyles.lineSeparator} />
        <View style={[commonStyles.horizontalChildrenSpaceView, { paddingVertical: RfH(12) }]}>
          <Text style={commonStyles.mediumMutedText}>Classes Taken</Text>
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>
            {bookingData?.count - bookingData?.availableClasses}
          </Text>
        </View>
        <View style={commonStyles.lineSeparator} />
        <View style={[commonStyles.horizontalChildrenSpaceView, { paddingVertical: RfH(12) }]}>
          <Text style={commonStyles.mediumMutedText}>Classes Left</Text>
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>
            {bookingData?.availableClasses}
          </Text>
        </View>
      </View>
      <View style={commonStyles.blankGreyViewSmall} />
      <View style={[commonStyles.mainContainer, { flex: 0 }]}>
        <View style={[commonStyles.horizontalChildrenSpaceView, { paddingVertical: RfH(12) }]}>
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>Refundable amount</Text>
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>
            ₹ {bookingData?.availableClasses * bookingData?.mrp}
          </Text>
        </View>
      </View>
      <View style={commonStyles.blankGreyViewSmall} />
      <View
        style={[
          commonStyles.horizontalChildrenEqualSpaceView,
          { bottom: 0, left: 0, right: 0, position: 'absolute', paddingBottom: RfH(32) },
        ]}>
        <Button style={commonStyles.buttonPrimary}>
          <Text style={commonStyles.textButtonPrimary}>Don't Cancel</Text>
        </Button>
        <Button style={commonStyles.buttonOutlinePrimary}>
          <Text style={commonStyles.textButtonOutlinePrimary}>Initiate Refund</Text>
        </Button>
      </View>
    </View>
  );
}

export default Refund;
