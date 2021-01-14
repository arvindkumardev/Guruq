import { KeyboardAvoidingView, Text, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Input, Item, Label } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import { useMutation } from '@apollo/client';
import { Loader, ScreenHeader } from '../../../components';
import commonStyles from '../../../theme/styles';
import { Colors } from '../../../theme';
import { alertBox, RfH, RfW } from '../../../utils/helpers';
import { ADD_UPDATE_BANK_DETAILS } from './bank.mutation';

function AddEditBankDetails(props) {
  const navigation = useNavigation();
  const bankDetail = props?.route?.params?.detail;
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [branchAddress, setBranchAddress] = useState('');
  const [bankId, setBankId] = useState('');

  useEffect(() => {
    if (!isEmpty(bankDetail)) {
      setAccountHolder(bankDetail.accountHolder);
      setAccountNumber(bankDetail.accountNumber);
      setIfscCode(bankDetail.ifscCode);
      setBankName(bankDetail.bankName);
      setBranchAddress(bankDetail.branchAddress);
      setBankId(bankDetail?.id);
    }
  }, [bankDetail]);

  const [saveBankDetail, { loading: saveBankDetailLoading }] = useMutation(ADD_UPDATE_BANK_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        alertBox('Bank Details saved successfully!', '', {
          positiveText: 'Ok',
          onPositiveClick: () => navigation.goBack(),
        });
      }
    },
  });

  const onSubmitBankDetail = () => {
    if (isEmpty(accountHolder)) {
      alertBox("Please provide the account holder's name");
    } else if (isEmpty(accountNumber)) {
      alertBox('Please provide the account number');
    } else if (isEmpty(ifscCode)) {
      alertBox('Please provide the IFSC code');
    } else if (isEmpty(bankName)) {
      alertBox('Please provide the bank name');
    } else if (isEmpty(branchAddress)) {
      alertBox('Please provide the bank address');
    } else {
      saveBankDetail({
        variables: {
          bankDetailsDto: {
            accountHolder,
            bankName,
            branchAddress,
            accountNumber,
            ifscCode,
          },
        },
      });
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ android: '', ios: 'padding' })}
      // keyboardVerticalOffset={Platform.OS === 'ios' ? (isDisplayWithNotch() ? 44 : 20) : 0}
      enabled>
      <Loader isLoading={saveBankDetailLoading} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
        <ScreenHeader homeIcon label="Bank Details" horizontalPadding={RfW(16)} lineVisible={true} />
        <ScrollView contentContainerStyle={{ paddingHorizontal: RfW(16) }}>
          <View style={{ height: RfH(24) }} />
          <Item floatingLabel>
            <Label style={commonStyles.regularMutedText}>A/C holder Name</Label>
            <Input value={accountHolder} onChangeText={(text) => setAccountHolder(text)} />
          </Item>
          <View style={{ height: RfH(24) }} />
          <View>
            <Item floatingLabel>
              <Label style={commonStyles.regularMutedText}>Account number</Label>
              <Input value={accountNumber} onChangeText={(text) => setAccountNumber(text)} keyboardType="numeric" />
            </Item>
          </View>
          <View style={{ height: RfH(24) }} />
          <Item floatingLabel>
            <Label style={commonStyles.regularMutedText}>IFSC Code</Label>
            <Input value={ifscCode} onChangeText={(text) => setIfscCode(text)} />
          </Item>
          <View style={{ height: RfH(24) }} />
          <View>
            <Item floatingLabel>
              <Label style={commonStyles.regularMutedText}>Bank Name</Label>
              <Input value={bankName} onChangeText={(text) => setBankName(text)} />
            </Item>
          </View>
          <View style={{ height: RfH(24) }} />
          <View>
            <Item floatingLabel>
              <Label>Branch Address</Label>
              <Input value={branchAddress} onChangeText={(text) => setBranchAddress(text)} />
            </Item>
          </View>
          <View style={{ height: RfH(24) }} />
          <View>
            <Button
              block
              style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}
              onPress={() => onSubmitBankDetail()}>
              <Text style={commonStyles.textButtonPrimary}>Save</Text>
            </Button>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

export default AddEditBankDetails;
