import { Image, Text, View } from 'react-native';
import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Images, Colors, Fonts } from '../../theme';
import routeNames from '../../routes/screenNames';
import { RfH, RfW } from '../../utils/helpers';
import commonStyles from '../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { IconButtonWrapper } from '../../components';

function ReferEarn(props) {
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
        Refer reached
      </Text>
    </View>
  );
}

export default ReferEarn;
