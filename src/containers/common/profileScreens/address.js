import { Image, Text, View } from 'react-native';
import React from 'react';
import { useReactiveVar } from '@apollo/client';
import AddressListing from './components/addressListing';
import { ScreenHeader } from '../../../components';
import { userDetails } from '../../../apollo/cache';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';

function Address() {
  const userInfo = useReactiveVar(userDetails);
  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader
        homeIcon
        label="Manage Addess"
        horizontalPadding={RfW(16)}
        showRightIcon
        rightIcon={Images.moreInformation}
        lineVisible={false}
      />
      <View style={{ height: RfH(44) }} />
      <AddressListing
        referenceType={userInfo.type}
        referenceId={userInfo.id}
        details={userInfo.contactDetail}
        isUpdateAllowed
      />
    </View>
  );
}

export default Address;
