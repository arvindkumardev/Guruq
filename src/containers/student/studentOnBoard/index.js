import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Button } from 'native-base';
import { isEmpty } from 'lodash';
import { IconButtonWrapper, ScreenHeader } from '../../../components';
import { RfH, RfW } from '../../../utils/helpers';
import Loader from '../../../components/Loader';
import { Colors, Images } from '../../../theme';
import commonStyles from '../../../theme/styles';
import styles from './style';
import NavigationRouteNames from '../../../routes/screenNames';
import { GET_STUDENT_DETAILS } from '../../common/graphql-query';
import { studentDetails } from '../../../apollo/cache';
import { MARK_ON_BOARDED } from '../../common/graphql-mutation';

const StudentOnBoard = () => {
  const isFocussed = useIsFocused();
  const navigation = useNavigation();
  const studentDetail = useReactiveVar(studentDetails);

  const [getStudentDetails, { loading: getStudentDetailsLoading }] = useLazyQuery(GET_STUDENT_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        studentDetails(data.getStudentDetails);
      }
    },
  });

  const [markOnboarded, { loading: markOnboardedLoading }] = useMutation(MARK_ON_BOARDED, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        getStudentDetails();
      }
    },
  });

  useEffect(() => {
    if (isFocussed) {
      getStudentDetails();
    }
  }, [isFocussed]);

  const checkForPersonalDetails = () => {
    if (!isEmpty(studentDetail)) {
      const { firstName, lastName, gender, email } = studentDetail.contactDetail;
      return !(isEmpty(firstName) || isEmpty(lastName) || isEmpty(gender) || isEmpty(email));
    }
    return false;
  };

  const isButtonVisible = () => {
    return !(!checkForPersonalDetails() || isEmpty(studentDetail.educationDetails) || isEmpty(studentDetail.addresses));
  };

  const handleNext = () => {
    markOnboarded();
  };

  return (
    <View style={{ backgroundColor: Colors.white, flex: 1 }}>
      <Loader isLoading={getStudentDetailsLoading || markOnboardedLoading} />
      <ScreenHeader
        label="Complete Profile"
        horizontalPadding={RfW(16)}
        homeIcon={false}
        rightText="Skip"
        showRightText
        onRightTextClick={handleNext}
      />
      <TouchableOpacity
        style={[styles.stepCard, { borderLeftColor: Colors.lightGreen, justifyContent: 'space-between' }]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate(NavigationRouteNames.PERSONAL_DETAILS)}>
        <View style={{ flexDirection: 'row' }}>
          <IconButtonWrapper
            iconImage={Images.personalGreen}
            iconWidth={RfH(24)}
            iconHeight={RfW(24)}
            imageResizeMode="contain"
          />
          <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(10) }]}>Personal Information</Text>
        </View>
        <View>
          <Text
            style={[
              commonStyles.regularPrimaryText,
              { color: !checkForPersonalDetails() ? Colors.orangeRed : Colors.green },
            ]}>
            {!checkForPersonalDetails() ? 'Pending' : 'Updated'}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.stepCard, { borderLeftColor: Colors.lightPurple, justifyContent: 'space-between' }]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate(NavigationRouteNames.ADDRESS)}>
        <View style={{ flexDirection: 'row' }}>
          <IconButtonWrapper
            iconImage={Images.addressBlue}
            iconWidth={RfH(24)}
            iconHeight={RfW(24)}
            imageResizeMode="contain"
          />
          <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(10) }]}>Address</Text>
        </View>
        <View>
          <Text
            style={[
              commonStyles.regularPrimaryText,
              { color: isEmpty(studentDetail?.addresses) ? Colors.orangeRed : Colors.green },
            ]}>
            {isEmpty(studentDetail?.addresses) ? 'Pending' : 'Updated'}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.stepCard, { borderLeftColor: Colors.skyBlue, justifyContent: 'space-between' }]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate(NavigationRouteNames.EDUCATION)}>
        <View style={{ flexDirection: 'row' }}>
          <IconButtonWrapper
            iconImage={Images.education_g}
            iconWidth={RfH(35)}
            iconHeight={RfW(30)}
            imageResizeMode="contain"
          />
          <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(10) }]}>Education</Text>
        </View>
        <View>
          <Text
            style={[
              commonStyles.regularPrimaryText,
              { color: isEmpty(studentDetail?.educationDetails) ? Colors.orangeRed : Colors.green },
            ]}>
            {isEmpty(studentDetail?.educationDetails) ? 'Pending' : 'Updated'}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.stepCard, { borderLeftColor: Colors.lightOrange, justifyContent: 'space-between' }]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate(NavigationRouteNames.STUDENT.PARENTS_LIST)}>
        <View style={{ flexDirection: 'row' }}>
          <IconButtonWrapper
            iconImage={Images.parent_details}
            iconWidth={RfH(24)}
            iconHeight={RfW(24)}
            imageResizeMode="contain"
          />
          <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(10) }]}>Parents Details</Text>
        </View>
        <View>
          <Text
            style={[
              commonStyles.regularPrimaryText,
              { color: isEmpty(studentDetail?.guardians) ? Colors.orangeRed : Colors.green },
            ]}>
            {isEmpty(studentDetail?.guardians) ? 'Pending' : 'Updated'}
          </Text>
        </View>
      </TouchableOpacity>

      {!isEmpty(studentDetail) && isButtonVisible() && (
        <Button
          onPress={handleNext}
          style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginTop: RfH(70), width: RfW(230) }]}>
          <Text style={[commonStyles.textButtonPrimary, { marginRight: RfW(16) }]}>Continue</Text>
          <IconButtonWrapper iconHeight={RfH(24)} iconWidth={RfW(24)} iconImage={Images.rightArrow_white} />
        </Button>
      )}
    </View>
  );
};

export default StudentOnBoard;
