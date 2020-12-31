import { Alert, Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useState } from 'react';
import { useMutation, useReactiveVar } from '@apollo/client';
import { Button, Input, Item, Label, Picker } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  CustomCheckBox,
  CustomMobileNumber,
  CustomRadioButton,
  IconButtonWrapper,
  ScreenHeader,
} from '../../../components';
import { studentDetails, userDetails } from '../../../apollo/cache';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import { IND_COUNTRY_OBJ, STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { ADD_UPDATE_GUARDIAN_DETAILS } from '../graphql-mutation';
import { ParentInfoType } from '../enums';

function AddEditParents() {
  const navigation = useNavigation();
  const [selectedGuadian, setSelectedGuadian] = useState(ParentInfoType.PARENT.label);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileObj, setMobileObj] = useState({
    mobile: '',
    country: IND_COUNTRY_OBJ,
  });
  const studentInfo = useReactiveVar(studentDetails);

  const [saveParents, { loading: parentsLoading }] = useMutation(ADD_UPDATE_GUARDIAN_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        Alert.alert('Details updated!');
      }
    },
  });

  const onSavingParents = () => {
    saveParents({
      variables: {
        guardianInfoDto: {
          studentId: studentInfo.Id,
          type: selectedGuadian,
          contactDetail: {
            firstName,
            lastName,
            email,
            phoneNumber: {
              countryCode: mobileObj.country.dialCode,
              number: mobileObj.mobile,
            },
          },
        },
      },
    });
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader homeIcon label="Guardians Details" horizontalPadding={RfW(16)} lineVisible={false} />
      <View style={{ paddingHorizontal: RfW(16) }}>
        <View style={{ height: RfH(44) }} />
        <Text style={commonStyles.regularMutedText}>Guardian</Text>
        <View style={{ marginTop: RfH(16) }}>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <TouchableWithoutFeedback onPress={() => setSelectedGuadian(ParentInfoType.PARENT.label)}>
              <View style={commonStyles.horizontalChildrenView}>
                <CustomRadioButton
                  submitFunction={() => setSelectedGuadian(ParentInfoType.PARENT.label)}
                  enabled={selectedGuadian === ParentInfoType.PARENT.label}
                />
                <Text style={{ marginLeft: RfW(8) }}>Parent</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => setSelectedGuadian(ParentInfoType.GUARDIAN.label)}>
              <View style={commonStyles.horizontalChildrenView}>
                <CustomRadioButton
                  submitFunction={() => setSelectedGuadian(ParentInfoType.GUARDIAN.label)}
                  enabled={selectedGuadian === ParentInfoType.GUARDIAN.label}
                />
                <Text style={{ marginLeft: RfW(8) }}>Guardian</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <View style={{ height: RfH(24) }} />
        <View>
          <Item floatingLabel>
            <Label>First Name</Label>
            <Input value={firstName} onChangeText={(text) => setFirstName(text)} />
          </Item>
        </View>
        <View style={{ height: RfH(24) }} />
        <View>
          <Item floatingLabel>
            <Label>Last Name</Label>
            <Input value={lastName} onChangeText={(text) => setLastName(text)} />
          </Item>
        </View>
        <View style={{ height: RfH(24) }} />
        <Text style={commonStyles.regularMutedText}>Phone Number</Text>
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
          <Item floatingLabel>
            <Label>Email Id</Label>
            <Input value={email} onChangeText={(text) => setEmail(text)} />
          </Item>
        </View>
        <View style={{ height: RfH(24) }} />
        <View>
          <Button onPress={() => onSavingParents()} block style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
            <Text style={commonStyles.textButtonPrimary}>Save</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

export default AddEditParents;
