import { Image, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import commonStyles from '../../theme/styles';
import { Images } from '../../theme';
import { RfH, RfW, storeData } from '../../utils/helpers';
import { LOCAL_STORAGE_DATA_KEY } from '../../utils/constants';
import styles from './style';
import { studentDetails, tutorDetails, userDetails, userType } from '../../apollo/cache';
import { CREATE_STUDENT, CREATE_TUTOR, REFRESH_TOKEN } from '../common/graphql-mutation';
import { GET_CURRENT_TUTOR_QUERY, GET_STUDENT_DETAILS } from '../common/graphql-query';
import { Loader } from '../../components';

function UserTypeSelector() {
  const userInfo = useReactiveVar(userDetails);

  const [refreshToken, { loading: refreshTokenLoading }] = useMutation(REFRESH_TOKEN, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        storeData(LOCAL_STORAGE_DATA_KEY.USER_TOKEN, data.refreshToken.token);
      }
    },
  });

  const [getCurrentStudent, { loading: getCurrentStudentLoading }] = useLazyQuery(GET_STUDENT_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {},
    onCompleted: (data) => {
      if (data) {
        studentDetails(data?.getStudentDetails);
        userDetails({ ...userInfo, type: 'STUDENT' });
        userType('STUDENT');
      }
    },
  });

  const [createStudent, { loading: createStudentLoading }] = useMutation(CREATE_STUDENT, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
        console.log(error);
      }
    },
    onCompleted: (data) => {
      if (data) {
        getCurrentStudent();
        refreshToken();
      }
    },
  });

  const [getCurrentTutor, { loading: getCurrentTutorLoading }] = useLazyQuery(GET_CURRENT_TUTOR_QUERY, {
    fetchPolicy: 'no-cache',
    onError: (e) => {},
    onCompleted: (data) => {
      if (data) {
        tutorDetails(data?.getCurrentTutor);
        userDetails({ ...userInfo, type: 'TUTOR' });
        userType('TUTOR');
      }
    },
  });

  const [createTutor, { loading: createTutorLoading }] = useMutation(CREATE_TUTOR, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        getCurrentTutor();
        refreshToken();
      }
    },
  });

  return (
    <>
      <Loader
        isLoading={
          createTutorLoading ||
          getCurrentTutorLoading ||
          refreshTokenLoading ||
          createStudentLoading ||
          getCurrentStudentLoading
        }
      />
      <View style={commonStyles.mainContainer}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.helloView}>
          <Text style={styles.helloText}>Hello</Text>
          <Text style={styles.userName}>{userInfo.firstName}</Text>
        </View>
        <Text style={styles.subHeading}>Continue as </Text>

        <View style={{ marginTop: RfH(16) }}>
          <TouchableOpacity onPress={() => createStudent()}>
            <Image
              style={{ alignSelf: 'center', marginTop: 16, width: RfW(80), height: RfH(80) }}
              source={Images.student}
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.subHeading, { marginTop: RfH(16) }]}>Student</Text>

        <View style={{ marginTop: RfH(48) }}>
          <TouchableOpacity onPress={createTutor}>
            <Image
              style={{ alignSelf: 'center', marginTop: 12, width: RfW(80), height: RfH(80) }}
              source={Images.tutor}
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.subHeading, { marginTop: RfH(16) }]}>Tutor</Text>
      </View>
    </>
  );
}

export default UserTypeSelector;
