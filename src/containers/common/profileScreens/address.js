import { Image, Text, View } from 'react-native';
import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import AddressListing from './components/addressListing';
import { ScreenHeader } from '../../../components';
import { userDetails } from '../../../apollo/cache';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import routeNames from '../../../routes/screenNames';

function Address(props) {
  const userInfo = useReactiveVar(userDetails);
  const navigation = useNavigation();
  const { route } = props;
  const { addresses } = route.params;
  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader
        homeIcon
        label="Manage Address"
        horizontalPadding={RfW(16)}
        showRightIcon
        onRightIconClick={() => navigation.navigate(routeNames.ADD_EDIT_ADDRESS)}
        rightIcon={Images.moreInformation}
        lineVisible={false}
      />
      <View style={{ height: RfH(44) }} />
      <AddressListing referenceType={userInfo.type} referenceId={userInfo.id} details={addresses} isUpdateAllowed />
    </View>
  );
}

export default Address;
