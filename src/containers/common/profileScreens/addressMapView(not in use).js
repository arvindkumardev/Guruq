import { Text, View } from 'react-native';
import React from 'react';
import { useReactiveVar } from '@apollo/client';
import MapView, { Marker } from 'react-native-maps';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button, Input, Item } from 'native-base';
import { IconButtonWrapper, ScreenHeader } from '../../../components';
import { userDetails } from '../../../apollo/cache';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';

function AddressMapViewNotInUse() {
  const userInfo = useReactiveVar(userDetails);
  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <MapView
        style={{ flex: 0.55, height: 300 }}
        liteMode
        initialRegion={{
          latitude: 28.561929,
          longitude: 77.06681,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <Marker coordinate={{ latitude: 28.561929, longitude: 77.06681 }} />
      </MapView>
      <ScreenHeader homeIcon lineVisible={false} horizontalPadding={RfW(16)} style={{ top: 0, position: 'absolute' }} />
      <View style={{ flex: 0.45, padding: RfW(16) }}>
        <View style={commonStyles.horizontalChildrenView}>
          <IconButtonWrapper iconWidth={RfW(16)} iconHeight={RfH(20)} iconImage={Images.pin} />
          <Text style={[commonStyles.headingPrimaryText, { marginLeft: RfW(8) }]}>Block 27</Text>
        </View>
        <Text style={{ fontSize: RFValue(15, STANDARD_SCREEN_SIZE), color: Colors.darkGrey, marginTop: RfH(8) }}>
          Block 72, , Ashok Nagar, New Delhi, Delhi 110018, India
        </Text>
        <View style={{ marginTop: RfH(16) }}>
          <Text style={commonStyles.smallMutedText}>House /Flat /Block no.</Text>
          <Item>
            <Input value="12/27" />
          </Item>
        </View>
        <View style={{ height: RfH(24) }} />
        <View>
          <Text style={commonStyles.smallMutedText}>Landmark</Text>
          <Item>
            <Input value="Monga Sweets" />
          </Item>
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

export default AddressMapViewNotInUse;
