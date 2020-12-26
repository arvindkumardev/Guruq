import { Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { Button, Input, Item } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { IconButtonWrapper, ScreenHeader } from '../../../components';
import { userDetails } from '../../../apollo/cache';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import routeNames from '../../../routes/screenNames';

function AddEditAddress() {
  const navigation = useNavigation();
  const userInfo = useReactiveVar(userDetails);
  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader
        homeIcon
        label="Address"
        horizontalPadding={RfW(16)}
        showRightIcon
        rightIcon={Images.moreInformation}
        lineVisible={false}
      />
      <View style={{ height: RfH(24) }} />
      <View style={{ paddingHorizontal: RfW(16) }}>
        <TouchableWithoutFeedback onPress={() => navigation.navigate(routeNames.ADDRESS_MAP_VIEW)}>
          <View
            style={[
              commonStyles.horizontalChildrenView,
              {
                paddingHorizontal: RfW(16),
                paddingVertical: RfH(8),
                backgroundColor: Colors.lightBlue,
                borderRadius: 8,
              },
            ]}>
            <IconButtonWrapper iconHeight={RfH(24)} iconWidth={RfW(24)} iconImage={Images.gprs} />
            <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(16) }]}>Use My Current Location</Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={{ height: RfH(44) }} />
        <View>
          <Text style={commonStyles.smallMutedText}>House no. Buliding Name</Text>
          <Item>
            <Input value="12/27" />
          </Item>
        </View>
        <View style={{ height: RfH(24) }} />
        <View>
          <Text style={commonStyles.smallMutedText}>Area , locality</Text>
          <Item>
            <Input value="Ashok Nagar" />
          </Item>
        </View>
        <View style={{ height: RfH(24) }} />
        <View>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <View style={{ flex: 0.5, marginRight: RfW(16) }}>
              <Text style={commonStyles.smallMutedText}>City</Text>
              <Item>
                <Input value="New Delhi" />
                <IconButtonWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.searchIcon} />
              </Item>
            </View>
            <View style={{ flex: 0.5, marfinLeft: RfW(16) }}>
              <Text style={commonStyles.smallMutedText}>State</Text>
              <Item>
                <Input value="Delhi" />
                <IconButtonWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.searchIcon} />
              </Item>
            </View>
          </View>
        </View>
        <View style={{ height: RfH(24) }} />
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <View style={{ flex: 0.5, marginRight: RfW(16) }}>
            <Text style={commonStyles.smallMutedText}>Pincode </Text>
            <Item>
              <Input value="110047" />
            </Item>
          </View>
          <View style={{ flex: 0.5, marfinLeft: RfW(16) }}>
            <Text style={commonStyles.smallMutedText}>Country</Text>
            <Item>
              <Input value="India" />
            </Item>
          </View>
        </View>
        <View style={{ height: RfH(24) }} />
        <Text style={commonStyles.smallMutedText}>Save as</Text>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <View
            style={[
              commonStyles.horizontalChildrenView,
              { borderBottomWidth: 1, borderBottomColor: Colors.brandBlue2, paddingVertical: RfH(8) },
            ]}>
            <IconButtonWrapper iconImage={Images.home} iconWidth={RfW(16)} iconHeight={RfH(16)} />
            <Text style={{ marginLeft: RfW(12), color: Colors.brandBlue2 }}>Home</Text>
          </View>
          <View style={[commonStyles.horizontalChildrenView, { paddingVertical: RfH(8) }]}>
            <IconButtonWrapper iconImage={Images.work_office} iconWidth={RfW(16)} iconHeight={RfH(16)} />
            <Text style={{ marginLeft: RfW(12) }}>Work</Text>
          </View>
          <View style={[commonStyles.horizontalChildrenView, { paddingVertical: RfH(8) }]}>
            <IconButtonWrapper iconImage={Images.pin} iconWidth={RfW(16)} iconHeight={RfH(16)} />
            <Text style={{ marginLeft: RfW(12) }}>Other</Text>
          </View>
        </View>
        <View style={{ height: RfH(24) }} />
        <View>
          <Button block style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
            <Text style={commonStyles.textButtonPrimary}>Save</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

export default AddEditAddress;
