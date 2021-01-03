import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Button } from 'native-base';
import { isEmpty } from 'lodash';
import { IconButtonWrapper, ScreenHeader } from '../../components';
import { RfH, RfW } from '../../utils/helpers';
import Loader from '../../components/Loader';
import { Colors, Images } from '../../theme';
import commonStyles from '../../theme/styles';
import styles from './styles';
import { GET_TUTOR_ALL_DETAILS } from './certification-query';
import NavigationRouteNames from '../../routes/screenNames';
import { MARK_CERTIFIED } from './certification-mutation';

const InterviewAndDocument = () => {
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

  const [markCertified, { loading: markTutorCertifiedLoading }] = useMutation(MARK_CERTIFIED, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        navigation.navigate(NavigationRouteNames.TUTOR.COMPLETE_PROFILE, { isOnBoarding: true });
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
      isEmpty(tutorDetail.experienceDetails) ||
      isEmpty(tutorDetail.addresses)
    );
  };

  const handleNext = () => {
    markCertified();
  };

  return (
    <View style={{ backgroundColor: Colors.white, flex: 1 }}>
      <Loader isLoading={tutorLeadDetailLoading || markTutorCertifiedLoading} />
      <ScreenHeader label="Schedule interview & upload documents" horizontalPadding={RfW(16)} homeIcon />
      <TouchableOpacity
        style={[styles.stepCard, { borderLeftColor: Colors.lightOrange, justifyContent: 'space-between' }]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate(NavigationRouteNames.TUTOR.SCHEDULE_YOUR_INTERVIEW)}>
        <View style={{ flexDirection: 'row' }}>
          <IconButtonWrapper
            iconImage={Images.schedule_interview}
            iconWidth={RfH(24)}
            iconHeight={RfW(24)}
            imageResizeMode="contain"
          />
          <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(10) }]}>Schedule Interview</Text>
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
            iconImage={Images.upload}
            iconWidth={RfH(24)}
            iconHeight={RfW(24)}
            imageResizeMode="contain"
          />
          <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(10) }]}>Upload Documents</Text>
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

      {!isEmpty(tutorDetail) && isButtonVisible() && (
        <Button
          onPress={handleNext}
          style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginTop: RfH(70), width: RfW(230) }]}>
          <Text style={commonStyles.textButtonPrimary}>Next Step</Text>
        </Button>
      )}
    </View>
  );
};

export default InterviewAndDocument;
