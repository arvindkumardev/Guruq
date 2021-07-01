import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useLazyQuery } from '@apollo/client';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Button } from 'native-base';
import { IconButtonWrapper, ScreenHeader } from '../../components';
import { RfH, RfW } from '../../utils/helpers';
import Loader from '../../components/Loader';
import { Colors, Images } from '../../theme';
import commonStyles from '../../theme/styles';
import styles from './styles';
import { GET_TUTOR_LEAD_DETAIL } from './certification-query';
import { TutorCertificationStageEnum } from '../tutor/enums';
import NavigationRouteNames from '../../routes/screenNames';
import { GET_OFFERINGS_MASTER_DATA } from '../student/dashboard-query';
import { offeringsMasterData, tutorDetails } from '../../apollo/cache';
import { GET_CURRENT_TUTOR_QUERY } from '../common/graphql-query';
import ActionModal from './components/helpSection';

const CertificationProcessSteps = (props) => {
  const isFocussed = useIsFocused();
  const navigation = useNavigation();
  const [leadDetail, setLeadDetail] = useState({});
  const [openMenu, setOpenMenu] = useState(false);

  const [getTutorLeadDetails, { loading: tutorLeadDetailLoading }] = useLazyQuery(GET_TUTOR_LEAD_DETAIL, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        setLeadDetail(data.getTutorLeadDetails);
      }
    },
  });

  const [getOfferingMasterData, { loading: loadingOfferingMasterData }] = useLazyQuery(GET_OFFERINGS_MASTER_DATA, {
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        console.log('e', e);
      }
    },
    onCompleted: (data) => {
      if (data) {
        offeringsMasterData(data.offerings.edges);
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

  const handleClick = () => {
    if (leadDetail.certificationStage === TutorCertificationStageEnum.OFFERING_PENDING.label) {
      navigation.navigate(NavigationRouteNames.TUTOR.SUBJECT_SELECTION, {
        isOnBoarding: true,
      });
    }
    if (leadDetail.certificationStage === TutorCertificationStageEnum.PROFICIENCY_TEST_PENDING.label) {
      navigation.navigate(NavigationRouteNames.TUTOR.PT_START_SCREEN, {
        isOnBoarding: true,
        offeringId: leadDetail.tutorOffering?.id,
      });
      // navigation.navigate(NavigationRouteNames.TUTOR.COMPLETE_PROFILE, {
      //   isOnBoarding: true,
      // });
    }
    if (leadDetail.certificationStage === TutorCertificationStageEnum.PROFILE_COMPLETION_PENDING.label) {
      navigation.navigate(NavigationRouteNames.TUTOR.COMPLETE_PROFILE, {
        isOnBoarding: true,
      });
    }
    if (leadDetail.certificationStage === TutorCertificationStageEnum.INTERVIEW_PENDING.label) {
      navigation.navigate(NavigationRouteNames.TUTOR.INTERVIEW_AND_DOCUMENTS, {
        isOnBoarding: true,
      });
    }
    if (leadDetail.certificationStage === TutorCertificationStageEnum.BACKGROUND_CHECK_PENDING.label) {
      navigation.navigate(NavigationRouteNames.TUTOR.BACKGROUND_CHECK);
    }
  };

  useEffect(() => {
    getOfferingMasterData();
  }, []);

  useEffect(() => {
    if (isFocussed) {
      getTutorLeadDetails();
      getCurrentTutor();
    }
  }, [isFocussed]);

  const [step, setStep] = useState(0);
  const [buttonText, setButtonText] = useState('Loading...');

  useEffect(() => {
    if (leadDetail.certificationStage === TutorCertificationStageEnum.OFFERING_PENDING.label) {
      setStep(1);
      setButtonText('Start');
    }
    if (leadDetail.certificationStage === TutorCertificationStageEnum.PROFICIENCY_TEST_PENDING.label) {
      setStep(2);
      setButtonText('Start Proficiency Test');
    }
    if (leadDetail.certificationStage === TutorCertificationStageEnum.PROFILE_COMPLETION_PENDING.label) {
      setStep(3);
      setButtonText('Complete Profile');
    }
    if (leadDetail.certificationStage === TutorCertificationStageEnum.INTERVIEW_PENDING.label) {
      setStep(4);
      setButtonText('Interview & Documents');
    }
    if (leadDetail.certificationStage === TutorCertificationStageEnum.BACKGROUND_CHECK_PENDING.label) {
      setStep(5);
      setButtonText('Background Check');
    }
  }, [leadDetail]);

  return (
    <View style={{ backgroundColor: Colors.white }}>
      <Loader isLoading={tutorLeadDetailLoading} />
      <ScreenHeader
        label="Tutor Certification Process"
        showRightIcon
        rightIcon={Images.vertical_dots_b}
        onRightIconClick={() => setOpenMenu(true)}
        homeIcon={false}
        horizontalPadding={RfW(16)}
      />

      <ScrollView contentContainerStyle={{ backgroundColor: Colors.white }} showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.stepCard,
            {
              borderColor: step === 1 ? Colors.brandBlue2 : step > 1 ? Colors.green : Colors.lightGrey,
            },
          ]}>
          <IconButtonWrapper
            iconImage={Images.subjects}
            imageResizeMode="contain"
            iconHeight={RfH(24)}
            iconWidth={RfW(24)}
          />
          <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(10) }]}>
            Select Subject You Want To Teach
          </Text>
        </View>

        <View
          style={[
            styles.stepCard,
            {
              borderColor: step === 2 ? Colors.brandBlue2 : step > 2 ? Colors.green : Colors.lightGrey,
            },
          ]}>
          <IconButtonWrapper
            iconImage={Images.proficiency_test}
            imageResizeMode="contain"
            iconHeight={RfH(24)}
            iconWidth={RfW(24)}
          />
          <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(10), width: '80%' }]}>
            Take the Proficiency Test
          </Text>
        </View>

        <View
          style={[
            styles.stepCard,
            {
              borderColor: step === 3 ? Colors.brandBlue2 : step > 3 ? Colors.green : Colors.lightGrey,
            },
          ]}>
          <IconButtonWrapper
            iconImage={Images.education_g}
            imageResizeMode="contain"
            iconHeight={RfH(24)}
            iconWidth={RfW(24)}
          />
          <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(10), width: '80%' }]}>
            Complete Your Profile - Personal, Address, Education and Experience
          </Text>
        </View>

        <View
          style={[
            styles.stepCard,
            {
              borderColor: step === 4 ? Colors.brandBlue2 : step > 4 ? Colors.green : Colors.lightGrey,
            },
          ]}>
          <IconButtonWrapper
            iconImage={Images.schedule_interview}
            imageResizeMode="contain"
            iconHeight={RfH(24)}
            iconWidth={RfW(24)}
          />
          <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(10), width: '80%' }]}>
            Schedule your Interview and Upload Required Documents
          </Text>
        </View>

        {/* <View style={[styles.stepCard, { borderLeftColor: Colors.lightGreen }]}> */}
        {/*  <IconButtonWrapper */}
        {/*    iconImage={Images.documentUpload} */}
        {/*    imageResizeMode="contain" */}
        {/*    iconHeight={RfH(24)} */}
        {/*    iconWidth={RfW(24)} */}
        {/*  /> */}
        {/*  <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(10), width: '80%' }]}> */}
        {/*    Upload the required documents */}
        {/*  </Text> */}
        {/* </View> */}

        <View
          style={[
            styles.stepCard,
            {
              borderColor: step === 5 ? Colors.brandBlue2 : step > 5 ? Colors.green : Colors.lightGrey,
            },
          ]}>
          <IconButtonWrapper
            iconImage={Images.background_check}
            imageResizeMode="contain"
            iconHeight={RfH(24)}
            iconWidth={RfW(24)}
          />
          <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(10), width: '80%' }]}>
            Consent to Background Check
          </Text>
        </View>

        <Button
          onPress={handleClick}
          style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginTop: RfH(70), width: RfW(230) }]}>
          <Text style={commonStyles.textButtonPrimary}>{buttonText}</Text>
        </Button>

        <View style={{ height: RfH(150) }} />
      </ScrollView>
      {openMenu && <ActionModal isVisible={openMenu} closeMenu={() => setOpenMenu(false)} navigation={navigation} />}
    </View>
  );
};

export default CertificationProcessSteps;
