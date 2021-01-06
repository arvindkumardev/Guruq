import { KeyboardAvoidingView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useMutation, useReactiveVar } from '@apollo/client';
import { Button, Input, Item, Label } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import { CustomMobileNumber, CustomRadioButton, Loader, ScreenHeader } from '../../components';
import { studentDetails } from '../../apollo/cache';
import commonStyles from '../../theme/styles';
import { Colors } from '../../theme';
import { alertBox, getCountryObj, isValidEmail, isValidMobile, RfH, RfW } from '../../utils/helpers';
import { IND_COUNTRY_OBJ } from '../../utils/constants';
import { ParentInfoType } from '../common/enums';
import { ADD_UPDATE_GUARDIAN_DETAILS } from './parentDetail.mutation';

function AddEditParents(props) {
  const navigation = useNavigation();
  const parentDetail = props?.route?.params?.detail;
  const [selectedGuardian, setSelectedGuardian] = useState(ParentInfoType.PARENT.label);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileObj, setMobileObj] = useState({
    mobile: '',
    country: IND_COUNTRY_OBJ,
  });
  const [parentId, setParentId] = useState('');
  const studentInfo = useReactiveVar(studentDetails);

  useEffect(() => {
    if (!isEmpty(parentDetail)) {
      setEmail(parentDetail.contactDetail.email);
      setLastName(parentDetail.contactDetail.lastName);
      setFirstName(parentDetail.contactDetail.firstName);
      setMobileObj({
        mobile: parentDetail.contactDetail.phoneNumber.number,
        country: getCountryObj(parentDetail.contactDetail.phoneNumber.countryCode),
      });
      setParentId(parentDetail?.id);
    }
  }, [parentDetail]);

  const [saveParents, { loading: parentsLoading }] = useMutation(ADD_UPDATE_GUARDIAN_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        alertBox('Parents details saved successfully!', '', {
          positiveText: 'Ok',
          onPositiveClick: () => navigation.goBack(),
        });
      }
    },
  });

  const onSavingParents = () => {
    if (isEmpty(firstName)) {
      alertBox('Please provide the first name');
    } else if (isEmpty(lastName)) {
      alertBox('Please provide the last name');
    } else if (isEmpty(email)) {
      alertBox('Please provide the email');
    } else if (!isValidEmail(email)) {
      alertBox('Please provide a valid email');
    } else if (isEmpty(mobileObj.mobile)) {
      alertBox('Please provide the phone number');
    } else if (!isValidMobile(mobileObj)) {
      alertBox('Please provide a valid mobile number');
    } else {
      saveParents({
        variables: {
          guardianInfoDto: {
            studentId: studentInfo.Id,
            type: selectedGuardian,
            contactDetail: {
              firstName,
              lastName,
              email,
              phoneNumber: {
                countryCode: mobileObj.country.dialCode,
                number: mobileObj.mobile,
              },
            },
            ...(parentId && { id: parentId }),
          },
        },
      });
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ android: '', ios: 'padding' })} enabled>
      <Loader isLoading={parentsLoading} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
        <ScreenHeader homeIcon label="Guardians Details" horizontalPadding={RfW(16)} />
        <ScrollView style={{ paddingHorizontal: RfW(16) }}>
          <View style={{ height: RfH(44) }} />
          <Text style={commonStyles.smallMutedText}>Guardian Type</Text>
          <View style={{ marginTop: RfH(16) }}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => setSelectedGuardian(ParentInfoType.PARENT.label)}
                activeOpacity={0.8}
                style={[commonStyles.horizontalChildrenView, { alignItems: 'center' }]}>
                <CustomRadioButton
                  submitFunction={() => setSelectedGuardian(ParentInfoType.PARENT.label)}
                  enabled={selectedGuardian === ParentInfoType.PARENT.label}
                />
                <Text style={{ marginLeft: RfW(8) }}>Parent</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedGuardian(ParentInfoType.GUARDIAN.label)}
                style={{ marginLeft: RfW(20) }}
                activeOpacity={0.8}>
                <View style={[commonStyles.horizontalChildrenView, { alignItems: 'center' }]}>
                  <CustomRadioButton
                    submitFunction={() => setSelectedGuardian(ParentInfoType.GUARDIAN.label)}
                    enabled={selectedGuardian === ParentInfoType.GUARDIAN.label}
                  />
                  <Text style={{ marginLeft: RfW(8) }}>Guardian</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ height: RfH(24) }} />
          <Item floatingLabel>
            <Label>First Name</Label>
            <Input
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
              style={commonStyles.regularPrimaryText}
            />
          </Item>
          <View style={{ height: RfH(24) }} />

          <Item floatingLabel>
            <Label>Last Name</Label>
            <Input
              value={lastName}
              onChangeText={(text) => setLastName(text)}
              style={commonStyles.regularPrimaryText}
            />
          </Item>
          <View style={{ height: RfH(24) }} />
          <Text style={commonStyles.smallMutedText}>Phone Number</Text>
          <View style={{ height: RfH(44) }}>
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
          <View style={{ height: RfH(44) }} />

          <Item floatingLabel>
            <Label>Email Id</Label>
            <Input
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={commonStyles.regularPrimaryText}
              keyboardType="email-address"
            />
          </Item>
          <View style={{ height: RfH(24) }} />
          <View>
            <Button onPress={onSavingParents} block style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
              <Text style={commonStyles.textButtonPrimary}>Save</Text>
            </Button>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

export default AddEditParents;
