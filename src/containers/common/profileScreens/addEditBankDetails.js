import { Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Button, Input, Item, Picker } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  CustomCheckBox,
  CustomMobileNumber,
  CustomRadioButton,
  IconButtonWrapper,
  ScreenHeader,
} from '../../../components';
import { userDetails } from '../../../apollo/cache';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import { IND_COUNTRY_OBJ, STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import CustomDatePicker from '../../../components/CustomDatePicker';

function AddEditBankDetails() {
  const navigation = useNavigation();
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAddress, setBankAddress] = useState('');

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader homeIcon label="Bank Details" horizontalPadding={RfW(16)} lineVisible={false} />
      <View style={{ paddingHorizontal: RfW(16) }}>
        <View style={{ height: RfH(44) }} />
        <Text style={commonStyles.smallMutedText}>A/C holder Name</Text>
        <Item>
          <Input value={accountHolder} onChangeText={(text) => setAccountHolder(text)} />
        </Item>
        <View style={{ height: RfH(24) }} />
        <View>
          <Text style={commonStyles.smallMutedText}>Account number</Text>
          <Item>
            <Input value={accountNumber} onChangeText={(text) => setAccountNumber(text)} />
          </Item>
        </View>
        <View style={{ height: RfH(24) }} />
        <Text style={commonStyles.smallMutedText}>IFSC Code</Text>
        <Item>
          <Input value={ifscCode} onChangeText={(text) => setIfscCode(text)} />
        </Item>
        <View style={{ height: RfH(24) }} />
        <View>
          <Text style={commonStyles.smallMutedText}>Bank Name</Text>
          <Item>
            <Input value={bankName} onChangeText={(text) => setBankName(text)} />
          </Item>
        </View>
        <View style={{ height: RfH(24) }} />
        <View>
          <Text style={commonStyles.smallMutedText}>Bank Address</Text>
          <Item>
            <Input value={bankAddress} onChangeText={(text) => setBankAddress(text)} />
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

export default AddEditBankDetails;
