import { View } from 'react-native';
import React, { useState } from 'react';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import PersonalInformation from './components/personalInformation';
import { Loader, ScreenHeader } from '../../../../components';
import {
  isLoggedIn,
  isSplashScreenVisible,
  isTokenLoading,
  studentDetails,
  tutorDetails,
  userDetails,
  userType,
} from '../../../../apollo/cache';
import commonStyles from '../../../../theme/styles';
import { Colors, Fonts } from '../../../../theme';
import { createPayload, RfW } from '../../../../utils/helpers';
import { UserTypeEnum } from '../../../../common/userType.enum';
import { ME_QUERY } from '../../graphql-query';
import { getFcmToken } from '../../../../common/firebase';

function PersonalDetails() {
  const navigation = useNavigation();

  const userInfo = useReactiveVar(userDetails);
  const studentInfo = useReactiveVar(studentDetails);
  const tutorInfo = useReactiveVar(tutorDetails);

  const [isEditClicked, setIsEditClicked] = useState(false);

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

  const updateDetails = (data) => {
    setIsEditClicked(false);

    const newData = { ...data };

    delete newData.phoneNumber;
    delete newData.email;
    getMe();
    if (userInfo.type === UserTypeEnum.STUDENT.label) {
      studentDetails({ ...studentInfo, ...newData });
    } else if (userInfo.type === UserTypeEnum.TUTOR.label) {
      tutorDetails({ ...tutorInfo, ...newData });
    }
  };

  return (
    <>
      <Loader isLoading={getMeLoading} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
        <ScreenHeader
          homeIcon
          label={isEditClicked ? 'Edit Personal Details' : 'Personal Details'}
          horizontalPadding={RfW(16)}
          showRightText
          rightText={isEditClicked ? '' : 'EDIT'}
          rightTextStyle={{ color: Colors.orangeRed, fontFamily: Fonts.semiBold }}
          onRightTextClick={() => setIsEditClicked(true)}
          lineVisible={false}
          handleBack={() => {
            if (isEditClicked) {
              setIsEditClicked(false);
            } else {
              navigation.goBack();
            }
          }}
        />
        <View style={{ flex: 1 }}>
          <PersonalInformation
            referenceType={userInfo.type}
            referenceId={userInfo.type === UserTypeEnum.STUDENT.label ? studentInfo.id : tutorInfo.id}
            userInfo={userInfo}
            isUpdateAllowed={isEditClicked}
            onUpdate={(data) => updateDetails(data)}
          />
        </View>
      </View>
    </>
  );
}

export default PersonalDetails;
