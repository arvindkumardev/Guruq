import { View } from 'react-native';
import React, { useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import PersonalInformation from './components/personalInformation';
import { ScreenHeader } from '../../../../components';
import { studentDetails, tutorDetails, userDetails } from '../../../../apollo/cache';
import commonStyles from '../../../../theme/styles';
import { Colors, Fonts } from '../../../../theme';
import { RfW } from '../../../../utils/helpers';
import { UserTypeEnum } from '../../../../common/userType.enum';

function PersonalDetails() {
  const navigation = useNavigation();

  const userInfo = useReactiveVar(userDetails);
  const studentInfo = useReactiveVar(studentDetails);
  const tutorInfo = useReactiveVar(tutorDetails);

  const [isEditClicked, setIsEditClicked] = useState(false);

  return (
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
          details={userInfo.type === UserTypeEnum.STUDENT.label ? studentInfo?.contactDetail : tutorInfo?.contactDetail}
          isUpdateAllowed={isEditClicked}
          onUpdate={() => setIsEditClicked(false)}
        />
      </View>
    </View>
  );
}

export default PersonalDetails;
