import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Button } from 'native-base';
import { isEmpty } from 'lodash';
import GetLocation from 'react-native-get-location';
import { IconButtonWrapper, ScreenHeader } from '../../components';
import { RfH, RfW } from '../../utils/helpers';
import Loader from '../../components/Loader';
import { Colors, Images } from '../../theme';
import commonStyles from '../../theme/styles';
import styles from './styles';
import { GET_TUTOR_ALL_DETAILS } from './certification-query';
import NavigationRouteNames from '../../routes/screenNames';
import { MARK_CERTIFIED } from './certification-mutation';
import ActionModal from './components/helpSection';
import { GET_CURRENT_TUTOR_QUERY } from '../common/graphql-query';
import { tutorDetails, userLocation } from '../../apollo/cache';
import { TutorCertificationStageEnum } from '../tutor/enums';

const CompleteYourProfile = () => {
  const isFocussed = useIsFocused();
  const navigation = useNavigation();
  const [tutorDetail, setTutorDetail] = useState({});
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then((location) => {
        userLocation(location);
      })
      .catch((error) => {
        const { code, message } = error;
        console.warn(code, message);
      });
  });

  const [getTutorDetails, { loading: tutorLeadDetailLoading }] = useLazyQuery(GET_TUTOR_ALL_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
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

  const [markCertified, { loading: markTutorCertifiedLoading }] = useMutation(MARK_CERTIFIED, {
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
    markCertified({ variables: { currentStage: TutorCertificationStageEnum.PROFILE_COMPLETION_PENDING.label } });
  };

  return (
    <View style={{ backgroundColor: Colors.white, flex: 1 }}>
      <Loader isLoading={tutorLeadDetailLoading || markTutorCertifiedLoading || getCurrentTutorLoading} />
      <ScreenHeader
        label="Complete Profile"
        showRightIcon
        rightIcon={Images.vertical_dots_b}
        onRightIconClick={() => setOpenMenu(true)}
        horizontalPadding={RfW(16)}
        homeIcon
      />
      {openMenu && <ActionModal isVisible={openMenu} closeMenu={() => setOpenMenu(false)} />}
      <TouchableOpacity
        style={[
          styles.stepCard,
          {
            borderLeftColor: Colors.lightGreen,
            justifyContent: 'space-between',
          },
        ]}
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
              {
                color: !checkForPersonalDetails() ? Colors.orangeRed : Colors.green,
              },
            ]}>
            {!checkForPersonalDetails() ? 'Pending' : 'Updated'}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.stepCard,
          {
            borderLeftColor: Colors.lightPurple,
            justifyContent: 'space-between',
          },
        ]}
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
              {
                color: isEmpty(tutorDetail?.addresses) ? Colors.orangeRed : Colors.green,
              },
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
              {
                color: isEmpty(tutorDetail?.educationDetails) ? Colors.orangeRed : Colors.green,
              },
            ]}>
            {isEmpty(tutorDetail?.educationDetails) ? 'Pending' : 'Updated'}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.stepCard,
          {
            borderLeftColor: Colors.lightOrange,
            justifyContent: 'space-between',
          },
        ]}
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
              {
                color: isEmpty(tutorDetail?.experienceDetails) ? Colors.orangeRed : Colors.green,
              },
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

export default CompleteYourProfile;
