import { Image, StatusBar, Text, View } from 'react-native';
import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useReactiveVar } from '@apollo/client';
import { SafeAreaView } from 'react-navigation';
import { Colors, Fonts, Images } from '../../../theme';
import { RfH } from '../../../utils/helpers';
import commonStyles from '../../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { userDetails } from '../../../apollo/cache';

function UpdateVersion(props) {
  const navigation = useNavigation();
  const { appMetaData } = props.route.params;

  return (
    <View
      style={[
        {
          flex: 1,
        },
      ]}>
      <StatusBar hidden barStyle="light-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
        <View
          style={{
            alignItems: 'center',
            height: '40%',
            marginTop: appMetaData.isUnderMaintenance ? RfH(100) : RfH(0),
          }}>
          <Image
            source={appMetaData.isUnderMaintenance ? Images.under_maintainance : Images.update_version}
            resizeMode="cover"
            h
          />
        </View>
        <View
          style={{
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
              {appMetaData.isUnderMaintenance ? "We'll be back soon" : 'Time to Update!'}
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
              {appMetaData.isUnderMaintenance
                ? 'Currently the app is under maintenance, We apologize for the inconvenience'
                : 'There is newer version available for download. Please update the app now'}
            </Text>
          </View>

          {!appMetaData.isUnderMaintenance && (
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
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

export default UpdateVersion;
