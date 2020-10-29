import { Image, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useLazyQuery } from '@apollo/client';
import commonStyles from '../../../theme/styles';
import styles from './styles';
import { Colors } from '../../../theme';
import { GET_CURRENT_STUDENT_QUERY, GET_CURRENT_TUTOR_QUERY, ME_QUERY } from '../graphql-query';
import { isLoggedIn, isTokenLoading, studentDetails, tutorDetails, userDetails } from '../../../apollo/cache';
import { UserTypeEnum } from '../../../common/userType.enum';
import Loader from '../../../components/Loader';

function SplashScreen() {
  const { error, data } = useQuery(ME_QUERY, { fetchPolicy: 'no-cache' });

  const [getCurrentStudent, { data: currentStudent }] = useLazyQuery(GET_CURRENT_STUDENT_QUERY, {
    fetchPolicy: 'no-cache',
  });
  const [getCurrentTutor, { data: currentTutor }] = useLazyQuery(GET_CURRENT_TUTOR_QUERY, { fetchPolicy: 'no-cache' });

  useEffect(() => {
    if (error) {
      isLoggedIn(false);
      isTokenLoading(false);
      userDetails({});
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      isLoggedIn(true);
      isTokenLoading(false);
      userDetails(data.me);

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
