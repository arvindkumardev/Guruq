import { View } from 'react-native';
import React, { useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
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
  const [registerDevice, { loading: registerDeviceLoading }] = useMutation(REGISTER_DEVICE, {
    fetchPolicy: 'no-cache',
    onError: (e) => {},
    onCompleted: (data) => {
      if (data) {
        console.log(data);
      }
    },
  });

  const [getCurrentStudent, { loading: getCurrentLoading }] = useLazyQuery(GET_CURRENT_STUDENT_QUERY, {
    fetchPolicy: 'no-cache',
    onError: (e) => {},
    onCompleted: (data) => {
      if (data) {
        studentDetails(data?.getCurrentStudent);
        isLoggedIn(true);
        isSplashScreenVisible(false);
      }
    },
  });

  const [getCurrentTutor, { loading: getCurrentTutorLoading }] = useLazyQuery(GET_CURRENT_TUTOR_QUERY, {
    fetchPolicy: 'no-cache',
    onError: (e) => {},
    onCompleted: (data) => {
      if (data) {
        tutorDetails(data?.getCurrentTutor);
        isLoggedIn(true);
        isSplashScreenVisible(false);
      }
    },
  });

  const [getMe, { loading: getMeLoading }] = useLazyQuery(ME_QUERY, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      isLoggedIn(false);
      isTokenLoading(false);
      userDetails({});
      isSplashScreenVisible(false);
    },
    onCompleted: (data) => {
      if (data) {
        userDetails(data.me);
        userType(data.me.type);

        getFcmToken().then((token) => {
          if (token) {
            createPayload(data.me, token).then((payload) => {
              registerDevice({ variables: { deviceDto: payload } });
            });
          }
        });
        if (data.me.type === UserTypeEnum.STUDENT.label) {
          getCurrentStudent();
        } else if (data.me.type === UserTypeEnum.TUTOR.label) {
          getCurrentTutor();
        }
      }
    },
  });

  useEffect(() => {
    getMe();
  }, []);

  return <View />;
}

export default LoginCheck;
