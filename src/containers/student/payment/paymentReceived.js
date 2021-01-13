import { Image, Text, View } from 'react-native';
import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Images, Colors, Fonts } from '../../../theme';
import routeNames from '../../../routes/screenNames';
import { RfH, RfW } from '../../../utils/helpers';
import commonStyles from '../../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { IconButtonWrapper } from '../../../components';

function paymentReceived() {
  const navigation = useNavigation();

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
        Payment Received
      </Text>
      <View style={{ height: RfH(56) }} />
      <IconButtonWrapper
        styling={{ alignSelf: 'center' }}
        iconWidth={RfW(280)}
        iconHeight={RfH(280)}
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
        Happy Learning
      </Text>
      <Text
        style={{
          marginTop: RfH(5),
          fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
          color: Colors.darkGrey,
          alignSelf: 'center',
        }}>
        Booking ID 9E03U8W9292
      </Text>
      <Button
        onPress={() => navigation.navigate(routeNames.STUDENT.DASHBOARD)}
        style={[commonStyles.buttonPrimary, { bottom: RfH(34), position: 'absolute', alignSelf: 'center' }]}>
        <Text style={commonStyles.textButtonPrimary}>Dashboard</Text>
      </Button>
    </View>
  );
}

export default paymentReceived;
