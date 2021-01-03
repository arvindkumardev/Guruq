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
import { offeringsMasterData } from '../../apollo/cache';
import {WebView} from "react-native-webview";

const CertificationProcessSteps = (props) => {
  const isFocussed = useIsFocused();
  const navigation = useNavigation();
  const [leadDetail, setLeadDetail] = useState({});

  const [getTutorLeadDetails, { loading: tutorLeadDetailLoading }] = useLazyQuery(GET_TUTOR_LEAD_DETAIL, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
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

  const handleClick = () => {
    if (leadDetail.certificationStage === TutorCertificationStageEnum.OFFERING_PENDING.label) {
      navigation.navigate(NavigationRouteNames.TUTOR.SUBJECT_SELECTION, { isOnBoarding: true });
    }
    if (leadDetail.certificationStage === TutorCertificationStageEnum.PROFICIENCY_TEST_PENDING.label) {
      navigation.navigate(NavigationRouteNames.TUTOR.PT_START_SCREEN, {
        isOnBoarding: true,
        offeringId: leadDetail.tutorOffering?.id,
      });
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
  };

  useEffect(() => {
    getOfferingMasterData();
  }, []);

  useEffect(() => {
    if (isFocussed) {
      getTutorLeadDetails();
    }
  }, [isFocussed]);

  const getButtonText = () => {
    if (leadDetail.certificationStage === TutorCertificationStageEnum.OFFERING_PENDING.label) {
      return 'Start';
    }
    if (leadDetail.certificationStage === TutorCertificationStageEnum.PROFICIENCY_TEST_PENDING.label) {
      return 'Start proficiency test';
    }
    if (leadDetail.certificationStage === TutorCertificationStageEnum.PROFILE_COMPLETION_PENDING.label) {
      return 'Complete profile';
    }
    if (leadDetail.certificationStage === TutorCertificationStageEnum.INTERVIEW_PENDING.label) {
      return 'Schedule Interview';
    }
  };

  return (
    <View style={{ backgroundColor: Colors.white }}>
      <Loader isLoading={tutorLeadDetailLoading} />
      <ScreenHeader label="Certification Process" homeIcon={false} horizontalPadding={RfW(16)} />
      <ScrollView contentContainerStyle={{ backgroundColor: Colors.white }}  showsVerticalScrollIndicator={false}>
        <View style={[styles.stepCard, { borderLeftColor: Colors.lightGreen }]}>
          <IconButtonWrapper iconImage={Images.subjects} />
          <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(10) }]}>
            Select Subject you want to teach
          </Text>
        </View>

        <View style={[styles.stepCard, { borderLeftColor: Colors.lightPurple }]}>
          <IconButtonWrapper iconImage={Images.proficiency_test} />
          <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(10), width: '80%' }]}>
            Pass the Proficiency test to become a Tutor
          </Text>
        </View>

        <View style={[styles.stepCard, { borderLeftColor: Colors.skyBlue }]}>
          <IconButtonWrapper iconImage={Images.education_g} />
          <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(10), width: '80%' }]}>
            Fill in the Personal details, address Education and Experience
          </Text>
        </View>

        <View style={[styles.stepCard, { borderLeftColor: Colors.lightOrange }]}>
          <IconButtonWrapper iconImage={Images.schedule_interview} />
          <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(10), width: '80%' }]}>
            Schedule your Interview on your preferences
          </Text>
        </View>

        <View style={[styles.stepCard, { borderLeftColor: Colors.lightGreen }]}>
          <IconButtonWrapper iconImage={Images.upload} />
          <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(10), width: '80%' }]}>
            Upload the required documents
          </Text>
        </View>

        <View style={[styles.stepCard, { borderLeftColor: Colors.lightPurple }]}>
          <IconButtonWrapper iconImage={Images.background_check} />
          <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(10), width: '80%' }]}>
            Background Check by GuruQ team to verify credentials
          </Text>
        </View>

        <Button
          onPress={handleClick}
          style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginTop: RfH(70), width: RfW(230) }]}>
          <Text style={commonStyles.textButtonPrimary}>{getButtonText()}</Text>
        </Button>

        <View style={{ height: RfH(150) }} />
      </ScrollView>
    </View>
  );
};

export default CertificationProcessSteps;
