import { Image, Text, View } from 'react-native';
import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { ScreenHeader } from '../../../components';
import { userDetails } from '../../../apollo/cache';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import EducationListing from './components/educationListing';
import routeNames from '../../../routes/screenNames';
import ExperienceListing from './components/experienceListing';

function Experience() {
  const navigation = useNavigation();
  const userInfo = useReactiveVar(userDetails);
  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader
        homeIcon
        label="Experience"
        horizontalPadding={RfW(16)}
        showRightIcon
        rightIcon={Images.moreInformation}
        onRightIconClick={() => navigation.navigate(routeNames.ADD_EDIT_EXPERIENCE)}
        lineVisible={false}
      />
      <View style={{ height: RfH(44) }} />
      <ExperienceListing
        referenceType={userInfo.type}
        referenceId={userInfo.id}
        details={userInfo.contactDetail}
        isUpdateAllowed
      />
    </View>
  );
}

export default Experience;
