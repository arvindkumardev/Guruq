import { Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Button, Input, Item } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { CustomCheckBox, CustomMobileNumber, ScreenHeader } from '../../../components';
import { userDetails } from '../../../apollo/cache';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import { IND_COUNTRY_OBJ } from '../../../utils/constants';

function AddEditParents() {
  const navigation = useNavigation();
  const [mobileObj, setMobileObj] = useState({
    mobile: '',
    country: IND_COUNTRY_OBJ,
  });
  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader homeIcon label="Parents Details" horizontalPadding={RfW(16)} lineVisible={false} />
      <View style={{ paddingHorizontal: RfW(16) }}>
        <View style={{ height: RfH(44) }} />
        <View>
          <Text style={commonStyles.smallMutedText}>Parents Name</Text>
          <Item>
            <Input value="Ravi Kumar" />
          </Item>
        </View>
        <View style={{ height: RfH(24) }} />
        <Text style={commonStyles.smallMutedText}>Phone Number</Text>
        <View style={{ height: RfH(44), borderBottomColor: Colors.darkGrey, borderBottomWidth: 1 }}>
          <CustomMobileNumber
            value={mobileObj}
            topMargin={0}
            onChangeHandler={(m) => setMobileObj(m)}
            returnKeyType="done"
            refKey="mobileNumber"
            placeholder="Mobile number"
            label={' '}
          />
        </View>
        <View style={{ height: RfH(24) }} />
        <View>
          <Text style={commonStyles.smallMutedText}>Email Id</Text>
          <Item>
            <Input value="Ravikumar123@gmail.com" />
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

export default AddEditParents;
