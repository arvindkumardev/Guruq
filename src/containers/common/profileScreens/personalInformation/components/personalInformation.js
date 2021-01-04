import { ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Item, Label } from 'native-base';
import { useMutation } from '@apollo/client';
import commonStyles from '../../../../../theme/styles';
import { TutorImageComponent } from '../../../../../components';
import { alertBox, isValidMobile, printDate, RfH, RfW } from '../../../../../utils/helpers';
import { IND_COUNTRY_OBJ } from '../../../../../utils/constants';
import { Colors } from '../../../../../theme';
import CustomDatePicker from '../../../../../components/CustomDatePicker';
import GenderModal from './genderModal';
import { UPDATE_STUDENT_CONTACT_DETAILS, UPDATE_TUTOR_CONTACT_DETAILS } from '../../../graphql-mutation';
import { GenderEnum } from '../../../enums';
import { UserTypeEnum } from '../../../../../common/userType.enum';

function PersonalInformation(props) {
  const { referenceType, referenceId, userInfo, onUpdate, isUpdateAllowed } = props;

  const [showGenderModal, setShowGenderModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDOB] = useState(new Date());
  const [gender, setGender] = useState(GenderEnum.MALE.label);
  const [mobileObj, setMobileObj] = useState({
    mobile: '',
    country: IND_COUNTRY_OBJ,
  });

  const showModal = () => {
    setShowGenderModal(true);
  };

  useEffect(() => {
    setFirstName(userInfo?.firstName);
    setLastName(userInfo?.lastName);
    setEmail(userInfo?.email);
    setMobileObj({ mobile: userInfo?.phoneNumber?.number, country: IND_COUNTRY_OBJ });
    setGender(userInfo?.gender);
    setDOB(userInfo?.dob);
  }, []);

  const [saveStudentDetails, { loading: updateLoading }] = useMutation(UPDATE_STUDENT_CONTACT_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        onUpdate(data.updateStudent);
        alertBox('Details updated!');
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
        onUpdate(data.updateTutor);
        alertBox('Details updated!');
      }
    },
  });

  const onSavingDetails = () => {
    console.log({
      firstName,
      lastName,
      gender,
      dob,
    });

    if (isValidMobile(mobileObj)) {
      if (referenceType === UserTypeEnum.STUDENT.label) {
        saveStudentDetails({
          variables: {
            studentDto: {
              contactDetail: {
                firstName,
                lastName,
                gender,
                dob,
                // email,
                // phoneNumber: {
                //   countryCode: mobileObj.country.dialCode,
                //   number: mobileObj.mobile,
                // },
              },
            },
          },
        });
      } else {
        saveTutorDetails({
          variables: {
            tutorDto: {
              contactDetail: {
                firstName,
                lastName,
                gender,
                dob,
                // email,
                // phoneNumber: {
                //   countryCode: mobileObj.country.dialCode,
                //   number: mobileObj.mobile,
                // },
              },
            },
          },
        });
      }
    } else {
      alertBox('Please enter valid phone number!');
    }
  };

  return (
    <View style={{ paddingHorizontal: RfW(16) }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: RfH(32) }}>
        <View style={{ height: RfH(44) }} />
        <TutorImageComponent
          tutor={{ profileImage: userInfo.profileImage, contactDetail: userInfo }}
          height={80}
          width={80}
          fontSize={24}
          styling={{ borderRadius: RfH(80) }}
        />

        <View style={{ height: RfH(24) }} />
        {isUpdateAllowed ? (
          <Item floatingLabel>
            <Label>First name</Label>
            <Input value={firstName} onChangeText={(text) => setFirstName(text)} />
          </Item>
        ) : (
          <View>
            <Text style={commonStyles.mediumMutedText}>First name</Text>
            <Text style={[commonStyles.regularPrimaryText, { marginTop: RfH(8) }]}>{userInfo?.firstName}</Text>
          </View>
        )}

        <View style={{ height: RfH(24) }} />
        {isUpdateAllowed ? (
          <Item floatingLabel>
            <Label>Last name</Label>
            <Input value={lastName} onChangeText={(text) => setLastName(text)} />
          </Item>
        ) : (
          <View>
            <Text style={commonStyles.mediumMutedText}>Last name</Text>
            <Text style={[commonStyles.regularPrimaryText, { marginTop: RfH(8) }]}>{userInfo?.lastName}</Text>
          </View>
        )}
        <View style={{ height: RfH(24) }} />
        {/* {isUpdateAllowed ? ( */}
        {/*  <Item floatingLabel> */}
        {/*    <Label>Email Id</Label> */}
        {/*    <Input value={email} onChangeText={(text) => setEmail(text)} /> */}
        {/*  </Item> */}
        {/* ) : ( */}
        <View>
          <Text style={commonStyles.mediumMutedText}>Email Id</Text>
          <Text style={[commonStyles.regularPrimaryText, { marginTop: RfH(8) }]}>{userInfo?.email}</Text>
        </View>
        {/* )} */}
        <View style={{ height: RfH(24) }} />
        <Text style={commonStyles.regularMutedText}>Phone Number</Text>
        {/* {isUpdateAllowed ? ( */}
        {/*  <View style={{ height: RfH(44), borderBottomColor: Colors.darkGrey, borderBottomWidth: 1 }}> */}
        {/*    <CustomMobileNumber */}
        {/*      value={mobileObj} */}
        {/*      topMargin={0} */}
        {/*      onChangeHandler={(m) => setMobileObj(m)} */}
        {/*      returnKeyType="done" */}
        {/*      refKey="mobileNumber" */}
        {/*      placeholder="Mobile number" */}
        {/*      label={' '} */}
        {/*    /> */}
        {/*  </View> */}
        {/* ) : ( */}
        <Text style={[commonStyles.regularPrimaryText, { marginTop: RfH(8) }]}>{userInfo?.phoneNumber?.number}</Text>
        {/* )} */}
        <View style={{ height: RfH(24) }} />
        <Text style={commonStyles.regularMutedText}>Date of birth</Text>
        {isUpdateAllowed ? (
          <View style={{ height: RfH(44), borderBottomColor: Colors.darkGrey, borderBottomWidth: 1 }}>
            <CustomDatePicker value={dob} onChangeHandler={(value) => setDOB(value)} />
          </View>
        ) : (
          <Text style={[commonStyles.regularPrimaryText, { marginTop: RfH(8) }]}>{printDate(userInfo?.dob)}</Text>
        )}
        <View style={{ height: RfH(24) }} />
        <Text style={commonStyles.regularMutedText}>Gender</Text>
        {isUpdateAllowed ? (
          <TouchableWithoutFeedback onPress={() => showModal()}>
            <View style={{ height: RfH(44), borderBottomColor: Colors.darkGrey, borderBottomWidth: 1 }}>
              <Text>{gender}</Text>
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <Text style={[commonStyles.regularPrimaryText, { marginTop: RfH(8) }]}>{userInfo?.gender}</Text>
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
  userInfo: PropTypes.object,
  onUpdate: PropTypes.func,
  isUpdateAllowed: PropTypes.bool,
};

PersonalInformation.defaultProps = {
  referenceType: '',
  referenceId: 0,
  userInfo: {},
  onUpdate: null,
  isUpdateAllowed: false,
};

export default PersonalInformation;
