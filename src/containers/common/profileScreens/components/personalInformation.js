import { Alert, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Item, Input, Button } from 'native-base';
import { useMutation } from '@apollo/client';
import commonStyles from '../../../../theme/styles';
import { CustomMobileNumber, IconButtonWrapper } from '../../../../components';
import { RfH, RfW } from '../../../../utils/helpers';
import { IND_COUNTRY_OBJ } from '../../../../utils/constants';
import { Colors, Images } from '../../../../theme';
import CustomDatePicker from '../../../../components/CustomDatePicker';
import GenderModal from './genderModal';
import { UPDATE_STUDENT_CONTACT_DETAILS, UPDATE_TUTOR_CONTACT_DETAILS } from '../../graphql-mutation';
import { GenderEnum } from '../../enums';

function PersonalInformation(props) {
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDOB] = useState(new Date());
  const [gender, setGender] = useState(GenderEnum.MALE.label);
  const { referenceType, referenceId, details, onUpdate, isUpdateAllowed } = props;
  const [mobileObj, setMobileObj] = useState({
    mobile: '',
    country: IND_COUNTRY_OBJ,
  });

  const showModal = () => {
    setShowGenderModal(true);
  };

  const [saveStudentDetails, { loading: updateLoading }] = useMutation(UPDATE_STUDENT_CONTACT_DETAILS, {
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

  const [saveTutorDetails, { loading: updateTutorLoading }] = useMutation(UPDATE_TUTOR_CONTACT_DETAILS, {
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

  const onSavingDetails = () => {
    saveStudentDetails({
      variables: {
        studentDto: {
          contactDetail: {
            firstName,
            lastName,
            gender,
            dob,
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
    <View style={{ paddingHorizontal: RfW(16) }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: RfH(32) }}>
        <View style={{ height: RfH(44) }} />
        <IconButtonWrapper
          iconHeight={RfH(80)}
          iconWidth={RfW(80)}
          iconImage={Images.user}
          styling={{ borderRadius: RfH(8) }}
        />
        <View style={{ height: RfH(24) }} />
        <Text style={commonStyles.smallMutedText}>First name</Text>
        {isUpdateAllowed ? (
          <Item>
            <Input value={firstName} onChangeText={(text) => setFirstName(text)} />
          </Item>
        ) : (
          <Text style={[commonStyles.regularPrimaryText, { marginTop: RfH(8) }]}>Sheena</Text>
        )}

        <View style={{ height: RfH(24) }} />
        <Text style={commonStyles.smallMutedText}>Last name</Text>
        {isUpdateAllowed ? (
          <Item>
            <Input value={lastName} onChangeText={(text) => setLastName(text)} />
          </Item>
        ) : (
          <Text style={[commonStyles.regularPrimaryText, { marginTop: RfH(8) }]}>Jain</Text>
        )}
        <View style={{ height: RfH(24) }} />
        <Text style={commonStyles.smallMutedText}>Email Id</Text>
        {isUpdateAllowed ? (
          <Item>
            <Input value={email} onChangeText={(text) => setEmail(text)} />
          </Item>
        ) : (
          <Text style={[commonStyles.regularPrimaryText, { marginTop: RfH(8) }]}>Sheenajain123@gmail.com</Text>
        )}
        <View style={{ height: RfH(24) }} />
        <Text style={commonStyles.smallMutedText}>Phone Number</Text>
        {isUpdateAllowed ? (
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
        ) : (
          <Text style={[commonStyles.regularPrimaryText, { marginTop: RfH(8) }]}>9876543210</Text>
        )}
        <View style={{ height: RfH(24) }} />
        <Text style={commonStyles.smallMutedText}>Date of birth</Text>
        {isUpdateAllowed ? (
          <View style={{ height: RfH(44), borderBottomColor: Colors.darkGrey, borderBottomWidth: 1 }}>
            <CustomDatePicker value={dob} onChangeHandler={(value) => setDOB(value)} />
          </View>
        ) : (
          <Text style={[commonStyles.regularPrimaryText, { marginTop: RfH(8) }]}>15/10/1991</Text>
        )}
        <View style={{ height: RfH(24) }} />
        <Text style={commonStyles.smallMutedText}>Gender</Text>
        {isUpdateAllowed ? (
          <TouchableWithoutFeedback onPress={() => showModal()}>
            <View style={{ height: RfH(44), borderBottomColor: Colors.darkGrey, borderBottomWidth: 1 }}>
              <Text>{gender}</Text>
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <Text style={[commonStyles.regularPrimaryText, { marginTop: RfH(8) }]}>Male</Text>
        )}
        <View style={{ height: RfH(24) }} />
        {isUpdateAllowed && (
          <View>
            <Button
              block
              onPress={() => onSavingDetails()}
              style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
              <Text style={commonStyles.textButtonPrimary}>Save</Text>
            </Button>
          </View>
        )}
      </ScrollView>
      <GenderModal
        visible={showGenderModal}
        onClose={() => setShowGenderModal(false)}
        onGenderSelect={(val) => setGender(val)}
      />
    </View>
  );
}

PersonalInformation.propTypes = {
  referenceType: PropTypes.string,
  referenceId: PropTypes.number,
  details: PropTypes.object,
  onUpdate: PropTypes.func,
  isUpdateAllowed: PropTypes.bool,
};

PersonalInformation.defaultProps = {
  referenceType: '',
  referenceId: 0,
  details: {},
  onUpdate: null,
  isUpdateAllowed: false,
};

export default PersonalInformation;
