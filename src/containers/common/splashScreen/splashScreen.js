import { Image, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useLazyQuery } from '@apollo/client';
import commonStyles from '../../../theme/styles';
import styles from './styles';
import { Colors } from '../../../theme';
import { GET_CURRENT_STUDENT_QUERY, GET_CURRENT_TUTOR_QUERY, ME_QUERY } from '../graphql-query';
import {
  isLoggedIn,
  isTokenLoading,
  offeringsMasterData,
  studentDetails,
  tutorDetails,
  userDetails,
} from '../../../apollo/cache';
import { UserTypeEnum } from '../../../common/userType.enum';
import Loader from '../../../components/Loader';
import { GET_OFFERINGS_MASTER_DATA } from '../../student/dashboard-query';

function SplashScreen() {
  const { error, data } = useQuery(ME_QUERY, { fetchPolicy: 'no-cache' });

  const [
    getOfferingMasterData,
    { loading: loadingOfferingMasterData, error: offeringMasterError, data: offeringMasterData },
  ] = useLazyQuery(GET_OFFERINGS_MASTER_DATA, { fetchPolicy: 'no-cache' });

  const [getCurrentStudent, { data: currentStudent }] = useLazyQuery(GET_CURRENT_STUDENT_QUERY, {
    fetchPolicy: 'no-cache',
  });
  const [getCurrentTutor, { data: currentTutor }] = useLazyQuery(GET_CURRENT_TUTOR_QUERY, { fetchPolicy: 'no-cache' });

  useEffect(() => {
    if (offeringMasterData && offeringMasterData.offerings && offeringMasterData.offerings.edges) {
      offeringsMasterData(offeringMasterData && offeringMasterData.offerings && offeringMasterData.offerings.edges);

      // after fetching this, push the user to dashboard
      isLoggedIn(true);
      isTokenLoading(false);
      userDetails(data.me);
    }
  }, [offeringMasterData]);

  useEffect(() => {
    if (error) {
      isLoggedIn(false);
      isTokenLoading(false);
      userDetails({});
    }
  }, [error]);

  useEffect(() => {
    if (data) {

      getOfferingMasterData();

      if (data.me.type === UserTypeEnum.STUDENT.label) {
        getCurrentStudent();
      } else if (data.me.type === UserTypeEnum.TUTOR.label) {
        getCurrentTutor();
      }
    }
  }, [data]);

  useEffect(() => {
    if (currentStudent && currentStudent.id > 0) {
      studentDetails(currentStudent);
    }
  }, [currentStudent]);

  useEffect(() => {
    if (currentTutor && currentTutor.id > 0) {
      tutorDetails(currentTutor);
    }
  }, [currentTutor]);

  return (
    <View style={[commonStyles.mainContainer, { paddingHorizontal: 0, backgroundColor: Colors.brandBlue }]}>
      <Loader isLoading />
      {/* eslint-disable-next-line global-require */}
      <Image style={styles.splashImage} source={require('../../../assets/images/splash_image.png')} />
      <Text style={styles.msgOne}>Find the best</Text>
      <Text style={styles.msgTwo}>Tutors and Institutes</Text>
      <Text style={styles.bottomMsg}>Powered by RHA Technologies</Text>
    </View>
  );
}

export default SplashScreen;
