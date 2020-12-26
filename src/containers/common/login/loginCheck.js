import { View } from 'react-native';
import React, { useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { isEmpty } from 'lodash';
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
import { getFcmToken } from '../../../common/firebase';
import { createPayload } from '../../../utils/helpers';
import { REGISTER_DEVICE } from '../graphql-mutation';

function LoginCheck() {
  // const { error, data } = useQuery(ME_QUERY, { fetchPolicy: 'no-cache' });

  const [registerDevice, { loading: scheduleLoading }] = useMutation(REGISTER_DEVICE, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      // if (e.graphQLErrors && e.graphQLErrors.length > 0) {
    },
    onCompleted: (data) => {
      if (data) {
        console.log(data);
      }
    },
  });
  const [getMe, { data: userData, error: userError }] = useLazyQuery(ME_QUERY, {
    fetchPolicy: 'no-cache',
  });

  const [getCurrentStudent, { data: currentStudent }] = useLazyQuery(GET_CURRENT_STUDENT_QUERY, {
    fetchPolicy: 'no-cache',
  });
  const [getCurrentTutor, { data: currentTutor }] = useLazyQuery(GET_CURRENT_TUTOR_QUERY, { fetchPolicy: 'no-cache' });

  useEffect(() => {
    getMe();
  }, []);

  useEffect(() => {
    if (userError) {
      isLoggedIn(false);
      isTokenLoading(false);
      userDetails({});
      isSplashScreenVisible(false);
    }
  }, [userError]);

  useEffect(() => {
    if (!isEmpty(userData)) {
      userDetails(userData.me);
      userType(userData.me.type);

      getFcmToken().then((token) => {
        if (token) {
          createPayload(userData.me, token).then((payload) => {
            registerDevice({ variables: { deviceDto: payload } });
          });
        }
      });

      // registerDevice({variables:{deviceDto:{
      //   deviceId:
      //   deviceToken:
      //   buildVersion:
      //   userId:
      //   deviceModel:
      //     }}})
      if (userData.me.type === UserTypeEnum.STUDENT.label) {
        getCurrentStudent();
      } else if (userData.me.type === UserTypeEnum.TUTOR.label) {
        getCurrentTutor();
      }
    }
  }, [userData]);

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
