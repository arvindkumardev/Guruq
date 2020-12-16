import { View } from 'react-native';
import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useLazyQuery } from '@apollo/client';
import { GET_CURRENT_STUDENT_QUERY, GET_CURRENT_TUTOR_QUERY, ME_QUERY } from '../graphql-query';
import {
  isLoggedIn,
  isSplashScreenVisible,
  isTokenLoading,
  studentDetails,
  tutorDetails,
  userDetails,
  userType,
} from '../../../apollo/cache';
import { UserTypeEnum } from '../../../common/userType.enum';

function LoginCheck() {
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
      isSplashScreenVisible(false);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      userDetails(data.me);
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
      isLoggedIn(true);
      isSplashScreenVisible(false);
    }
  }, [currentStudent]);

  useEffect(() => {
    if (currentTutor && currentTutor?.getCurrentTutor) {
      tutorDetails(currentTutor?.getCurrentTutor);
      isLoggedIn(true);
      isSplashScreenVisible(false);
    }
  }, [currentTutor]);

  return <View />;
}

export default LoginCheck;
