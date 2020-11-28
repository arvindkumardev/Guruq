import { View } from 'react-native';
import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useLazyQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { GET_CURRENT_STUDENT_QUERY, GET_CURRENT_TUTOR_QUERY, ME_QUERY } from '../graphql-query';
import {
  isLoggedIn,
  isTokenLoading,
  offeringsMasterData,
  studentDetails,
  tutorDetails,
  userDetails,
  userType,
} from '../../../apollo/cache';
import { UserTypeEnum } from '../../../common/userType.enum';
import { GET_OFFERINGS_MASTER_DATA } from '../../student/dashboard-query';
import NavigationRouteNames from '../../../routes/screenNames';

function LoginCheck() {
  const { error, data } = useQuery(ME_QUERY, { fetchPolicy: 'no-cache' });
  const navigation = useNavigation();

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
    }
  }, [offeringMasterData]);

  useEffect(() => {
    if (error) {
      isLoggedIn(false);
      isTokenLoading(false);
      userDetails({});
      navigation.navigate(NavigationRouteNames.GETTING_STARTED);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      getOfferingMasterData();
      userType(data.me.type);
      if (data.me.type === UserTypeEnum.STUDENT.label) {
        getCurrentStudent();
      } else if (data.me.type === UserTypeEnum.TUTOR.label) {
        getCurrentTutor();
      }
    }
  }, [data]);

  useEffect(() => {
    if (currentStudent && currentStudent?.getCurrentStudent) {
      studentDetails(currentStudent?.getCurrentStudent);
    }
  }, [currentStudent]);

  useEffect(() => {
    if (currentTutor && currentTutor?.getCurrentTutor) {
      tutorDetails(currentTutor?.getCurrentTutor);
    }
  }, [currentTutor]);

  return <View />;
}

export default LoginCheck;
