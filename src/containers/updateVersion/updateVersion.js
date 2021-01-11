import { Image, Linking, StatusBar, Text, View } from 'react-native';
import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'native-base';
import { SafeAreaView } from 'react-navigation';
import { useReactiveVar } from '@apollo/client';
import { Colors, Fonts, Images } from '../../theme';
import { RfH, RfW } from '../../utils/helpers';
import commonStyles from '../../theme/styles';
import { ANDROID_APP_URL, IOS_APP_URL, STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { appMetaData } from '../../apollo/cache';

function UpdateVersion(props) {
  const appMetaDataObj = useReactiveVar(appMetaData);

  const goForUpdate = () => {
    Linking.openURL(Platform.OS === 'ios' ? IOS_APP_URL : ANDROID_APP_URL);
  };

  const appMaintenance = () => (
    <View>
      <View
        style={{
          alignItems: 'center',
          paddingTop: RfH(50),
        }}>
        <Image source={Images.under_maintainance} resizeMode="cover" />
      </View>
      <View style={{ paddingHorizontal: RfW(16), marginTop: RfH(100) }}>
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
          <View style={{ height: RfH(20) }} />
          <Text
            style={[
              commonStyles.regularMutedText,
              {
                lineHeight: 25,
                textAlign: 'center',
              },
            ]}>
            {'Currently the app is under maintenance. \nWe apologize for the inconvenience'}
          </Text>
        </View>
      </View>
    </View>
  );

  const forceUpdate = () => (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <View
        style={{
          backgroundColor: Colors.brandBlue2,
          alignItems: 'center',
        }}>
        <Image source={Images.update_version} resizeMode="stretch" width={RfW(375)} />
      </View>
      <View style={{ paddingHorizontal: RfW(16), paddingVertical: RfH(40) }}>
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
            There is newer version available for download. Please update the app now
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
            onPress={goForUpdate}>
            <Text
              style={{
                color: Colors.white,
                fontSize: RFValue(18, STANDARD_SCREEN_SIZE),
                fontFamily: Fonts.semiBold,
              }}>
              Update App
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );

  return (
    <View
      style={[
        {
          flex: 1,
        },
      ]}>
      <StatusBar hidden barStyle="light-content" />
      {!appMetaDataObj.isUnderMaintenance && forceUpdate()}
      {appMetaDataObj.isUnderMaintenance && (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>{appMaintenance()}</SafeAreaView>
      )}
    </View>
  );
}

export default UpdateVersion;
