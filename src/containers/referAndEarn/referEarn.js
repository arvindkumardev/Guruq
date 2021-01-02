import { Share, Text, View } from 'react-native';
import React, { useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button, Icon, Toast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-community/clipboard';
import { useReactiveVar } from '@apollo/client';
import { Images, Colors, Fonts } from '../../theme';
import routeNames from '../../routes/screenNames';
import { deviceWidth, RfH, RfW } from '../../utils/helpers';
import commonStyles from '../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { IconButtonWrapper, ScreenHeader } from '../../components';
import { userDetails } from '../../apollo/cache';

function ReferEarn() {
  const navigation = useNavigation();
  const userInfo = useReactiveVar(userDetails);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Your referral code is ${userInfo.referralCode}. Use this code to register in GuruQ.`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          navigation.navigate(routeNames.STUDENT.DASHBOARD);
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {}
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <View style={{ flex: 1, backgroundColor: Colors.lightBlue }}>
        <ScreenHeader
          homeIcon
          horizontalPadding={RfW(16)}
          lineVisible={false}
          style={{ backgroundColor: Colors.lightBlue }}
        />
        {/* <View style={{ height: RfH(56), paddingHorizontal: RfW(112) }}> */}
        {/*  <Text */}
        {/*    style={{ textAlign: 'center', fontFamily: Fonts.semiBold, fontSize: RFValue(19, STANDARD_SCREEN_SIZE) }}> */}
        {/*    Invite your Friends and Earn Money */}
        {/*  </Text> */}
        {/* </View> */}
        <View style={{ paddingHorizontal: RfW(16) }}>
          <IconButtonWrapper
            iconImage={Images.refer}
            iconWidth={deviceWidth() - 32}
            iconHeight={RfH((deviceWidth() - 32) * 1.3)}
            styling={{ alignSelf: 'flex-start' }}
          />
        </View>
      </View>
      <View
        style={{
          flex: 0.5,
          backgroundColor: Colors.white,
          // borderTopLeftRadius: 25,
          // borderTopRightRadius: 25,
          // marginTop: -24,
        }}>
        {/* <View style={{ height: RfH(56) }} /> */}
        {/* <View style={commonStyles.horizontalChildrenEqualSpaceView}> */}
        {/*  <Text style={commonStyles.smallMutedText}>Step 1</Text> */}
        {/*  <Text style={commonStyles.smallMutedText}>Step 2</Text> */}
        {/*  <Text style={commonStyles.smallMutedText}>Step 3</Text> */}
        {/* </View> */}
        {/* <View style={[commonStyles.horizontalChildrenEqualSpaceView, { marginTop: RfH(10) }]}> */}
        {/*  <IconButtonWrapper */}
        {/*    iconHeight={RfH(60)} */}
        {/*    iconWidth={RfW(60)} */}
        {/*    iconImage={Images.refer_one} */}
        {/*    styling={{ alignSelf: 'center' }} */}
        {/*  /> */}
        {/*  <IconButtonWrapper */}
        {/*    iconHeight={RfH(60)} */}
        {/*    iconWidth={RfW(60)} */}
        {/*    iconImage={Images.refer_two} */}
        {/*    styling={{ alignSelf: 'center' }} */}
        {/*  /> */}
        {/*  <IconButtonWrapper */}
        {/*    iconHeight={RfH(60)} */}
        {/*    iconWidth={RfW(60)} */}
        {/*    iconImage={Images.refer_three} */}
        {/*    styling={{ alignSelf: 'center' }} */}
        {/*  /> */}
        {/* </View> */}
        {/* <View style={[commonStyles.horizontalChildrenEqualSpaceView, { marginTop: RfH(20) }]}> */}
        {/*  <Text */}
        {/*    style={[commonStyles.mediumPrimaryText, { width: RfW(100), textAlign: 'center', alignSelf: 'flex-start' }]}> */}
        {/*    Invite Friends */}
        {/*  </Text> */}
        {/*  <Text */}
        {/*    style={[commonStyles.mediumPrimaryText, { width: RfW(100), textAlign: 'center', alignSelf: 'flex-start' }]}> */}
        {/*    Successful Sign-Ups */}
        {/*  </Text> */}
        {/*  <Text */}
        {/*    style={[commonStyles.mediumPrimaryText, { width: RfW(100), textAlign: 'center', alignSelf: 'flex-start' }]}> */}
        {/*    Get Q-Points */}
        {/*  </Text> */}
        {/* </View> */}
        {/* <View style={{ height: RfH(64) }} /> */}
        <View style={commonStyles.blankViewSmall} />
        <View>
          <Text style={{ textAlign: 'center' }}>Your Referral Code</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: RfH(8) }}>
          <Button
            style={commonStyles.buttonOutlinePrimary}
            onPress={() => {
              Clipboard.setString(userInfo.referralCode);
              Toast.show({
                text: 'Copied to clipboard',
                type: 'success',
              });
            }}>
            <Text style={{ color: Colors.brandBlue2 }}>{userInfo.referralCode}</Text>
          </Button>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: RfH(36) }}>
          <Button warning block style={{ width: RfW(166) }} onPress={() => onShare()}>
            <Icon type="Entypo" name="share" style={{ fontSize: 16 }} />
            <Text
              style={{ color: Colors.white, fontSize: RFValue(17, STANDARD_SCREEN_SIZE), fontFamily: Fonts.semiBold }}>
              Refer Now
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

export default ReferEarn;
