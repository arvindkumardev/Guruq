import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_CURRENT_TUTOR_QUERY, GET_STUDENT_DETAILS, ME_QUERY } from '../graphql-query';
import {
  isLoggedIn,
  isSplashScreenVisible,
  isTokenLoading,
  studentDetails,
  tutorDetails,
  userDetails, userToken,
  userType,
} from '../../../apollo/cache';
import { UserTypeEnum } from '../../../common/userType.enum';
import { getFcmToken } from '../../../common/firebase';
import { createPayload } from '../../../utils/helpers';
import { REGISTER_DEVICE } from '../graphql-mutation';

function LoginCheck() {
  const [userDetailsData, setUserDetailsData] = useState({});
  const [registerDevice, { loading: registerDeviceLoading }] = useMutation(REGISTER_DEVICE, {
    fetchPolicy: 'no-cache',
    onError: (e) => {},
    onCompleted: (data) => {
      if (data) {
        console.log(data);
      }
    },
  });

  const [getCurrentStudent, { loading: getCurrentLoading }] = useLazyQuery(GET_STUDENT_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {},
    onCompleted: (data) => {
      if (data) {
        studentDetails(data?.getStudentDetails);
        userDetails(userDetailsData);
        userType(userDetailsData.type);
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
        userDetails(userDetailsData);
        userType(userDetailsData.type);
        isLoggedIn(true);
        isSplashScreenVisible(false);
      }
    },
  });

  const [getMe, { loading: getMeLoading }] = useLazyQuery(ME_QUERY, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      isLoggedIn(false);
      userToken('');
      isTokenLoading(false);
      userDetails({});
      isSplashScreenVisible(false);
    },
    onCompleted: (data) => {
      if (data) {
        getFcmToken().then((token) => {
          if (token) {
            createPayload(data.me, token).then((payload) => {
              registerDevice({ variables: { deviceDto: payload } });
            });
          }
        });
        setUserDetailsData(data.me);
        if (data.me.type === UserTypeEnum.STUDENT.label) {
          getCurrentStudent();
        } else if (data.me.type === UserTypeEnum.TUTOR.label) {
          getCurrentTutor();
        } else {
          userDetails(data.me);
          userType(data.me.type);
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
