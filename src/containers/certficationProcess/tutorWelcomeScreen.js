import React from 'react';
import { Image, Text, View } from 'react-native';
import { Button } from 'native-base';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { RfH, RfW } from '../../utils/helpers';
import commonStyles from '../../theme/styles';
import Images from '../../theme/images';
import { Colors } from '../../theme';
import { MARK_CERTIFIED } from './certification-mutation';
import { Loader } from '../../components';
import { GET_CURRENT_TUTOR_QUERY } from '../common/graphql-query';
import { tutorDetails } from '../../apollo/cache';
import { TutorCertificationStageEnum } from '../tutor/enums';

const TutorWelcomeScreen = () => {
  const navigation = useNavigation();
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

  const handleClick = () => {
    markCertified({ variables: { currentStage: TutorCertificationStageEnum.REGISTERED.label } });
  };

  return (
    <>
      <Loader isLoading={markTutorCertifiedLoading || getCurrentTutorLoading} />
      <View style={{ flex: 1, alignItems: 'center', paddingTop: RfH(140), backgroundColor: Colors.white }}>
        <Image source={Images.tutorWelcome} style={{ height: RfH(219), width: RfH(256) }} />

        <View style={{ marginTop: RfH(52), alignItems: 'center' }}>
          <Text style={commonStyles.headingPrimaryText}> Welcome to GuruQ!</Text>
          <Text style={[commonStyles.regularPrimaryText, { marginTop: RfH(14), textAlign: 'center' }]}>
            Please proceed to provide the required data for certification process.
          </Text>
        </View>
        <Button
          onPress={handleClick}
          style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginTop: RfH(70), width: RfW(230) }]}>
          <Text style={commonStyles.textButtonPrimary}>Click here for Certification</Text>
        </Button>
      </View>
    </>
  );
};

export default TutorWelcomeScreen;
