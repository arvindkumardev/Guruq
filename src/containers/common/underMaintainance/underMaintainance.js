import { ImageBackground, StatusBar, Text, View } from 'react-native';
import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useReactiveVar } from '@apollo/client';
import { Colors, Fonts, Images } from '../../../theme';
import { RfH } from '../../../utils/helpers';
import commonStyles from '../../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { userDetails } from '../../../apollo/cache';

function UnderMaintainance() {
  const navigation = useNavigation();
  const userInfo = useReactiveVar(userDetails);

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: Colors.white,
        },
      ]}>
      <StatusBar barStyle="light-content" />
      <View style={{ height: RfH(44) }} />
      <View
        style={{
          flex: 1,
          marginTop: RfH(32),
          backgroundColor: Colors.white,
          paddingHorizontal: RfH(16),
          justifyContent: 'center',
        }}>
        <View style={{ flex: 0.8 }}>
          <ImageBackground
            source={Images.under_maintainance}
            resizeMode="contain"
            style={[
              {
                height: '100%',
                width: '100%',
              },
            ]}
          />
        </View>
      </View>
      <View style={{ height: RfH(32) }} />
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.white,
          paddingHorizontal: RfH(16),
        }}>
        <View>
          <Text
            style={[
              commonStyles.pageTitleThirdRow,
              {
                fontSize: RFValue(24, STANDARD_SCREEN_SIZE),
                textAlign: 'center',
              },
            ]}>
            We'll be back soon
          </Text>
          <View style={{ height: RfH(8) }} />
          <Text
            style={[
              commonStyles.regularMutedText,
              {
                lineHeight: 25,
                textAlign: 'center',
              },
            ]}>
            {`Currently the app is under maintenance, We apologize for the inconvenience `}
          </Text>
        </View>

        <View
          style={[
            commonStyles.buttonContainerView,
            {
              marginVertical: RfH(36),
            },
          ]}>
          <Button
            primary
            block
            style={{
              backgroundColor: Colors.brandBlue2,
              borderRadius: 8,
              flex: 0.68,
              alignSelf: 'center',
            }}
            onPress={() => navigation.goBack()}>
            <Text
              style={{
                color: Colors.white,
                fontSize: RFValue(18, STANDARD_SCREEN_SIZE),
                fontFamily: Fonts.semiBold,
              }}>
              Go Home
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

export default UnderMaintainance;
