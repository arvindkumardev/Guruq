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

function UpdateVersion() {
  const navigation = useNavigation();

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: Colors.brandBlue2,
        },
      ]}>
      <StatusBar hidden barStyle="light-content" />
      <View style={{ flex: 1, backgroundColor: Colors.brandBlue2 }}>
        <ImageBackground
          source={Images.update_version}
          resizeMode="stretch"
          style={[
            {
              height: '100%',
              width: '100%',
            },
          ]}
        />
      </View>
      <View
        style={{
          flex: 0.7,
          backgroundColor: Colors.white,
          paddingHorizontal: 16,
          paddingVertical: RfH(16),
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
            Time to Update!
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
            There is newer version available for download. Please update the app now{' '}
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
              Update New Version
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

export default UpdateVersion;
