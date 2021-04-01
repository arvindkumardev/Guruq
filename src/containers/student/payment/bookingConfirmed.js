import { Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { Images, Colors, Fonts } from '../../../theme';
import routeNames from '../../../routes/screenNames';
import { RfH, RfW } from '../../../utils/helpers';
import commonStyles from '../../../theme/styles';
import { LOCAL_STORAGE_DATA_KEY, STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { IconButtonWrapper } from '../../../components';
import { PaymentMethodEnum } from '../../../components/PaymentMethodModal/paymentMethod.enum';
import { activeCoupon } from '../../../apollo/cache';

function bookingConfirmed(props) {
  const { route } = props;

  const { orderId, paymentMethod } = route?.params;
  const isCash = PaymentMethodEnum.CASH.value === paymentMethod;

  const navigation = useNavigation();

  useEffect(() => {
    // reset coupon
    activeCoupon({});
    AsyncStorage.removeItem(LOCAL_STORAGE_DATA_KEY.ACTIVE_COUPON);
  }, []);

  return (
    <View style={commonStyles.mainContainer}>
      <Text
        style={{
          marginTop: RfH(146),
          fontSize: RFValue(28, STANDARD_SCREEN_SIZE),
          color: Colors.brandBlue2,
          alignSelf: 'center',
          fontFamily: Fonts.semiBold,
        }}>
        {'Booking '}
        {isCash ? 'Received' : 'Confirmed'}
      </Text>
      <View style={{ height: RfH(56) }} />
      <IconButtonWrapper
        styling={{ alignSelf: 'center' }}
        iconWidth={RfW(264)}
        iconHeight={RfH(224)}
        iconImage={Images.confirmed_booking}
      />
      <View style={{ height: RfH(24) }} />
      <Text
        style={{
          fontSize: RFValue(22, STANDARD_SCREEN_SIZE),
          color: Colors.orange,
          alignSelf: 'center',
          fontFamily: Fonts.bold,
        }}>
        {isCash ? 'Cash Collection Pending' : 'Happy Learning'}
      </Text>
      {!isCash && (
        <Text
          style={{
            marginTop: RfH(5),
            fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
            color: Colors.darkGrey,
            alignSelf: 'center',
          }}>
          Booking ID {orderId}
        </Text>
      )}
      <Button
        onPress={() => navigation.navigate(routeNames.STUDENT.DASHBOARD)}
        style={[commonStyles.buttonPrimary, { bottom: RfH(34), position: 'absolute', alignSelf: 'center' }]}>
        <Text style={commonStyles.textButtonPrimary}>Go To Dashboard</Text>
      </Button>
    </View>
  );
}

export default bookingConfirmed;
