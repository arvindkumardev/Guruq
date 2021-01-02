import { Image, Text, View } from 'react-native';
import React, { useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import PersonalInformation from './components/personalInformation';
import { ScreenHeader } from '../../../../components';
import { userDetails, studentDetails } from '../../../../apollo/cache';
import commonStyles from '../../../../theme/styles';
import { Colors } from '../../../../theme';
import { RfH, RfW } from '../../../../utils/helpers';

function PersonalDetails() {
  const navigation = useNavigation();

  const userInfo = useReactiveVar(userDetails);
  const studentInfo = useReactiveVar(studentDetails);
  const [isEditClicked, setIsEditClicked] = useState(false);

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader
        homeIcon
        label={isEditClicked ? 'Edit Personal Details' : 'Personal Details'}
        horizontalPadding={RfW(16)}
        showRightText
        rightText={isEditClicked ? '' : 'EDIT'}
        rightTextStyle={{ color: Colors.orangeRed }}
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
          referenceId={studentInfo.id}
          details={studentInfo?.contactDetail}
          isUpdateAllowed={isEditClicked}
          onUpdate={() => setIsEditClicked(false)}
        />
      </View>
    </View>
  );
}

export default PersonalDetails;
