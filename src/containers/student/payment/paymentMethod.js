import { Image, Text, View } from 'react-native';
import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { Button, Card } from 'native-base';
import { Images, Colors, Fonts } from '../../../theme';
import commonStyles from '../../../theme/styles';
import { IconButtonWrapper, ScreenHeader } from '../../../components';
import { RfH, RfW } from '../../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import routeNames from '../../../routes/screenNames';

function paymentMethod() {
  const navigation = useNavigation();

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white }]}>
      <ScreenHeader homeIcon label="Payment" />
      <View style={{ height: RfH(44) }} />
      <Card style={{ borderRadius: 8, paddingHorizontal: RfW(8), paddingVertical: RfH(16) }}>
        <Text style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE), fontFamily: Fonts.semiBold }}>Payment Summary</Text>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(8) }]}>
          <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>Amount</Text>
          <Text
            style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey, fontFamily: Fonts.semiBold }}>
            ₹900
          </Text>
        </View>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>Taxes</Text>
          <Text
            style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey, fontFamily: Fonts.semiBold }}>
            ₹99
          </Text>
        </View>
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: Colors.darkGrey, marginTop: RfH(8) }} />
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(8) }]}>
          <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), fontFamily: Fonts.semiBold }}>
            Total Amount Payable
          </Text>
          <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), fontFamily: Fonts.semiBold }}>₹999</Text>
        </View>
      </Card>
      <View style={{ height: RfH(56) }} />
      <View>
        <Text style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE), fontFamily: Fonts.semiBold }}>Payment Options</Text>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(24) }]}>
          <Text style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE) }}>Credit/Debit Card</Text>
          <View style={commonStyles.horizontalChildrenView}>
            <IconButtonWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.white_plus_with_blue_back} />
            <Text style={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), color: Colors.brandBlue2 }}>Add New Card</Text>
          </View>
        </View>
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: Colors.darkGrey, marginVertical: RfH(16) }} />
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE) }}>Paytm</Text>
          <View style={commonStyles.horizontalChildrenView} />
        </View>
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: Colors.darkGrey, marginVertical: RfH(16) }} />
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE) }}>UPI</Text>
          <IconButtonWrapper iconHeight={RfH(24)} iconWidth={RfW(24)} iconImage={Images.expand_gray} />
        </View>
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: Colors.darkGrey, marginVertical: RfH(16) }} />
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE) }}>Net Banking</Text>
          <IconButtonWrapper iconHeight={RfH(24)} iconWidth={RfW(24)} iconImage={Images.expand_gray} />
        </View>
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: Colors.darkGrey, marginVertical: RfH(16) }} />
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE) }}>Cash on Service</Text>
        </View>
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: Colors.darkGrey, marginVertical: RfH(16) }} />
      </View>
      <View>
        <Button onPress={() => navigation.navigate(routeNames.STUDENT.BOOKING_CONFIRMED)}>
          <Text>Confirm</Text>
        </Button>
      </View>
    </View>
  );
}

export default paymentMethod;
