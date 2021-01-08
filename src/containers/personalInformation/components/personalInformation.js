import { ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, CheckBox, Input, Item, Label } from 'native-base';
import { useLazyQuery, useMutation } from '@apollo/client';
import commonStyles from '../../../theme/styles';
import { IconButtonWrapper, Loader, TutorImageComponent } from '../../../components';
import { alertBox, getToken, isValidMobile, printDate, RfH, RfW } from '../../../utils/helpers';
import { IND_COUNTRY_OBJ } from '../../../utils/constants';
import { Colors, Images } from '../../../theme';
import CustomDatePicker from '../../../components/CustomDatePicker';
import GenderModal from './genderModal';
import {
  UPDATE_STUDENT_CONTACT_DETAILS,
  UPDATE_STUDENT_IMAGE,
  UPDATE_TUTOR_CONTACT_DETAILS,
  UPDATE_TUTOR_IMAGE,
} from '../../common/graphql-mutation';
import { GenderEnum } from '../../common/enums';
import { UserTypeEnum } from '../../../common/userType.enum';
import UploadDocument from '../../../components/UploadDocument';
import { ME_QUERY } from '../../common/graphql-query';
import { userDetails, userType } from '../../../apollo/cache';
import UserImageComponent from '../../../components/UserImageComponent';

function PersonalInformation(props) {
  const { referenceType, userInfo, onUpdate, isUpdateAllowed } = props;

  const [showGenderModal, setShowGenderModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDOB] = useState('');
  const [gender, setGender] = useState(GenderEnum.MALE.label);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [mobileObj, setMobileObj] = useState({
    mobile: '',
    country: IND_COUNTRY_OBJ,
  });
  const [token, setToken] = useState();
  useEffect(() => {
    getToken().then((tk) => {
      setToken(tk);
    });
  }, []);
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
  }, [userInfo]);

  const [getMe, { loading: getMeLoading }] = useLazyQuery(ME_QUERY, {
    fetchPolicy: 'no-cache',
    onError: (e) => {},
    onCompleted: (data) => {
      if (data) {
        userDetails(data.me);
        userType(data.me.type);
      }
    },
  });

  const [saveStudentDetails, { loading: saveStudentDetailsLoading }] = useMutation(UPDATE_STUDENT_CONTACT_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        onUpdate(data.updateStudent);
        getMe();
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
        getMe();
        alertBox('Details updated!');
      }
    },
  });

  const onSavingDetails = () => {
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
              },
            },
          },
        });
      }
    } else {
      alertBox('Please enter valid phone number!');
    }
  };

  const [addStudentImage, { loading: studentImageLoading }] = useMutation(UPDATE_STUDENT_IMAGE, {
    fetchPolicy: 'no-cache',
    onError(e) {
      console.log(e);
    },
    onCompleted(data) {
      if (data) {
        alertBox('Profile image updated successfully!');
        getMe();
      }
    },
  });

  const [addTutorImage, { loading: tutorImageLoading }] = useMutation(UPDATE_TUTOR_IMAGE, {
    fetchPolicy: 'no-cache',
    onError(e) {
      console.log(e);
    },
    onCompleted(data) {
      if (data) {
        alertBox('Profile image updated successfully!');
        getMe();
      }
    },
  });

  const handleAcceptedFiles = async (file) => {
    setIsUploadModalOpen(false);
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Content-Type', `multipart/form-data`);
    const formdata = new FormData();
    formdata.append('file', file);
    setIsFileUploading(true);

    try {
      const res = await fetch(`http://apiv2.guruq.in/api/upload/file`, {
        headers,
        method: 'POST',
        body: formdata,
      }).then((response) => response.json());

      const profileImageDto = {
        userId: userInfo.id,
        filename: res.filename,
        size: res.size,
        type: res.type,
      };
      if (profileImageDto.filename) {
        if (referenceType === UserTypeEnum.STUDENT.label) {
          addStudentImage({ variables: { profileImageDto } });
        } else {
          addTutorImage({ variables: { profileImageDto } });
        }
      }
      setIsFileUploading(false);
    } catch (error) {
      setIsFileUploading(false);
    }
  };

  return (
    <>
      <Loader
        isLoading={
          isFileUploading ||
          saveStudentDetailsLoading ||
          tutorImageLoading ||
          studentImageLoading ||
          updateTutorLoading ||
          getMeLoading
        }
      />
      <View style={{ paddingHorizontal: RfW(16) }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: RfH(32) }}>
          <View style={{ height: RfH(24) }} />
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <UserImageComponent height={100} width={100} fontSize={30} styling={{ borderRadius: RfH(80) }} />
            <IconButtonWrapper
              iconImage={Images.editPicture}
              iconWidth={RfW(25)}
              iconHeight={RfH(25)}
              styling={{ position: 'absolute', left: -RfW(25), top: RfH(5) }}
              submitFunction={() => setIsUploadModalOpen(true)}
            />
          </View>
          <View style={{ height: RfH(24) }} />
          {isUpdateAllowed ? (
            <Item floatingLabel>
              <Label style={commonStyles.mediumMutedText}>First name</Label>
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
          <View>
            <Text style={commonStyles.mediumMutedText}>Email Id</Text>
            <Text style={[commonStyles.regularPrimaryText, { marginTop: RfH(8) }]}>{userInfo?.email}</Text>
          </View>
          <View style={{ height: RfH(24) }} />
          <Text style={commonStyles.regularMutedText}>Phone Number</Text>
          <Text style={[commonStyles.regularPrimaryText, { marginTop: RfH(8) }]}>{userInfo?.phoneNumber?.number}</Text>

          <View style={{ height: RfH(24) }} />
          <Text style={commonStyles.regularMutedText}>Date of birth</Text>
          {isUpdateAllowed ? (
            <View style={{ height: RfH(44), borderBottomColor: Colors.darkGrey, borderBottomWidth: 1 }}>
              <CustomDatePicker value={dob} onChangeHandler={(value) => setDOB(value)} />
            </View>
          ) : (
            <>
              <Text style={[commonStyles.regularPrimaryText, { marginTop: RfH(8) }]}>
                {userInfo?.dob ? printDate(userInfo?.dob) : '-'}
              </Text>
            </>
          )}
          <View style={{ height: RfH(24) }} />
          <Text style={commonStyles.regularMutedText}>Gender</Text>
          {isUpdateAllowed ? (
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: RfH(15) }}>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => setGender(GenderEnum.MALE.label)}
                activeOpacity={0.8}>
                <CheckBox
                  checked={gender === GenderEnum.MALE.label}
                  onPress={() => {
                    setGender(GenderEnum.MALE.label);
                  }}
                  style={{ marginRight: RfW(20) }}
                  color={Colors.brandBlue}
                />
                <Text style={commonStyles.mediumPrimaryText}> Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => setGender(GenderEnum.FEMALE.label)}
                activeOpacity={0.8}>
                <CheckBox
                  checked={gender === GenderEnum.FEMALE.label}
                  onPress={() => {
                    setGender(GenderEnum.FEMALE.label);
                  }}
                  style={{ marginRight: RfW(20) }}
                  color={Colors.brandBlue}
                />
                <Text style={commonStyles.mediumPrimaryText}> Female</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => setGender(GenderEnum.OTHER.label)}
                activeOpacity={0.8}>
                <CheckBox
                  checked={gender === GenderEnum.OTHER.label}
                  onPress={() => {
                    setGender(GenderEnum.OTHER.label);
                  }}
                  style={{ marginRight: RfW(20) }}
                  color={Colors.brandBlue}
                />
                <Text style={commonStyles.mediumPrimaryText}> Other</Text>
              </TouchableOpacity>
            </View>
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
        {isUploadModalOpen && (
          <UploadDocument
            isVisible={isUploadModalOpen}
            handleClose={() => setIsUploadModalOpen(!isUploadModalOpen)}
            handleUpload={handleAcceptedFiles}
            snapCount={1}
          />
        )}
      </View>
    </>
  );
}

PersonalInformation.propTypes = {
  referenceType: PropTypes.string,
  userInfo: PropTypes.object,
  onUpdate: PropTypes.func,
  isUpdateAllowed: PropTypes.bool,
};

PersonalInformation.defaultProps = {
  referenceType: '',
  userInfo: {},
  onUpdate: null,
  isUpdateAllowed: false,
};

export default PersonalInformation;
