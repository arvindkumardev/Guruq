import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useLazyQuery, useMutation } from '@apollo/client';
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
import { GET_TUTOR_ALL_DETAILS } from '../../certficationProcess/certification-query';
import { GET_CURRENT_TUTOR_QUERY } from '../../common/graphql-query';
import { tutorDetails } from '../../../apollo/cache';
import { MARK_ON_BOARDED } from '../../common/graphql-mutation';

const TutorOnBoard = () => {
  const isFocussed = useIsFocused();
  const navigation = useNavigation();
  const [tutorDetail, setTutorDetail] = useState({});

  const [getTutorDetails, { loading: tutorLeadDetailLoading }] = useLazyQuery(GET_TUTOR_ALL_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setTutorDetail(data.getTutorDetails);
      }
    },
  });

  const [getCurrentTutor, { loading: getCurrentTutorLoading }] = useLazyQuery(GET_CURRENT_TUTOR_QUERY, {
    fetchPolicy: 'no-cache',
    onError: (e) => {},
    onCompleted: (data) => {
      if (data) {
        tutorDetails(data?.getCurrentTutor);
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
        getCurrentTutor();
      }
    },
  });

  useEffect(() => {
    if (isFocussed) {
      getTutorDetails();
    }
  }, [isFocussed]);

  const checkForPersonalDetails = () => {
    if (!isEmpty(tutorDetail)) {
      const { firstName, lastName, gender, email } = tutorDetail.contactDetail;
      return !(isEmpty(firstName) || isEmpty(lastName) || isEmpty(gender) || isEmpty(email));
    }
    return false;
  };

  const isButtonVisible = () => {
    return !(
      !checkForPersonalDetails() ||
      isEmpty(tutorDetail.educationDetails) ||
      // isEmpty(tutorDetail.experienceDetails) ||
      isEmpty(tutorDetail.addresses)
    );
  };

  const handleNext = () => {
    markOnboarded();
  };

  return (
    <View style={{ backgroundColor: Colors.white, flex: 1 }}>
      <Loader isLoading={tutorLeadDetailLoading || getCurrentTutorLoading || markOnboardedLoading} />
      <ScreenHeader label="Complete Profile" horizontalPadding={RfW(16)} homeIcon />
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
              { color: isEmpty(tutorDetail?.addresses) ? Colors.orangeRed : Colors.green },
            ]}>
            {isEmpty(tutorDetail?.addresses) ? 'Pending' : 'Updated'}
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
              { color: isEmpty(tutorDetail?.educationDetails) ? Colors.orangeRed : Colors.green },
            ]}>
            {isEmpty(tutorDetail?.educationDetails) ? 'Pending' : 'Updated'}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.stepCard, { borderLeftColor: Colors.lightOrange, justifyContent: 'space-between' }]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate(NavigationRouteNames.EXPERIENCE)}>
        <View style={{ flexDirection: 'row' }}>
          <IconButtonWrapper
            iconImage={Images.experienceOrange}
            iconWidth={RfH(24)}
            iconHeight={RfW(24)}
            imageResizeMode="contain"
          />
          <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(10) }]}>Experience</Text>
        </View>
        <View>
          <Text
            style={[
              commonStyles.regularPrimaryText,
              { color: isEmpty(tutorDetail?.experienceDetails) ? Colors.orangeRed : Colors.green },
            ]}>
            {isEmpty(tutorDetail?.experienceDetails) ? 'Pending' : 'Updated'}
          </Text>
        </View>
      </TouchableOpacity>

      {!isEmpty(tutorDetail) && isButtonVisible() && (
        <Button
          onPress={handleNext}
          style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginTop: RfH(70), width: RfW(230) }]}>
          <Text style={[commonStyles.textButtonPrimary, { marginRight: RfW(16) }]}>Next Step</Text>
          <IconButtonWrapper iconHeight={RfH(24)} iconWidth={RfW(24)} iconImage={Images.rightArrow_white} />
        </Button>
      )}
    </View>
  );
};

export default TutorOnBoard;
