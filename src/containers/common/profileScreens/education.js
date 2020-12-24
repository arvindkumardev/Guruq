import { Image, Text, View } from 'react-native';
import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { ScreenHeader } from '../../../components';
import { userDetails } from '../../../apollo/cache';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import EducationListing from './components/educationListing';

function Education() {
  const userInfo = useReactiveVar(userDetails);
  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader
        homeIcon
        label="Education"
        horizontalPadding={RfW(16)}
        showRightIcon
        rightIcon={Images.moreInformation}
        lineVisible={false}
      />
      <View style={{ height: RfH(44) }} />
      <EducationListing
        referenceType={userInfo.type}
        referenceId={userInfo.id}
        details={userInfo.contactDetail}
        isUpdateAllowed
      />
    </View>
  );
}

export default Education;
