import { Image, Text, View } from 'react-native';
import React, { useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import PersonalInformation from './components/personalInformation';
import { ScreenHeader } from '../../../components';
import { userDetails } from '../../../apollo/cache';
import commonStyles from '../../../theme/styles';
import { Colors } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';

function PersonalDetails() {
  const userInfo = useReactiveVar(userDetails);
  const [isEditClicked, setIsEditClicked] = useState(false);
  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader
        homeIcon
        label="Personal Details"
        horizontalPadding={RfW(16)}
        showRightText
        rightText="EDIT"
        onRightTextClick={() => setIsEditClicked(true)}
        lineVisible={false}
      />
      <View style={{ flex: 1 }}>
        <PersonalInformation
          referenceType={userInfo.type}
          referenceId={userInfo.id}
          details={userInfo}
          isUpdateAllowed={isEditClicked}
        />
      </View>
    </View>
  );
}

export default PersonalDetails;
