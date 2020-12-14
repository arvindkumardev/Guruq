import { Image, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'native-base';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useReactiveVar } from '@apollo/client';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { RfH, storeData } from '../../../utils/helpers';
import { LOCAL_STORAGE_DATA_KEY } from '../../../utils/constants';
import styles from './style';
import { isLoggedIn, studentDetails, tutorDetails, userDetails } from '../../../apollo/cache';
import { CREATE_STUDENT, CREATE_TUTOR } from '../graphql-mutation';

function UserTypeSelector(props) {
  const [userName, setUserName] = useState('');
  const navigation = useNavigation();

  const { route } = props;
  // const { user } = route.params;
  const userInfo = useReactiveVar(userDetails);

  const onBackPress = () => {
    navigation.goBack();
  };

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
        // set in apollo cache
        // isLoggedIn(true);
        userDetails({ ...userInfo, type: 'STUDENT' });
        studentDetails(data);
      }
    },
  });

  const [createTutor, { loading: createTutorLoading }] = useMutation(CREATE_TUTOR, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
        console.log(error);
      }
    },
    onCompleted: (data) => {
      if (data) {
        // storeData(LOCAL_STORAGE_DATA_KEY.USER_TOKEN, user.token);
        // set in apollo cache
        // isLoggedIn(true);
        userDetails({ ...userInfo, type: 'TUTOR' });
        tutorDetails(data);
      }
    },
  });

  return (
    <View style={commonStyles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.helloView}>
        {/* <Icon */}
        {/*  onPress={() => onBackPress()} */}
        {/*  type="MaterialIcons" */}
        {/*  name="keyboard-backspace" */}
        {/*  style={{ color: Colors.primaryText }} */}
        {/* /> */}
        <Text style={styles.helloText}>Hello</Text>
        <Text style={styles.userName}>{userInfo.firstName}</Text>
      </View>
      <Text style={styles.subHeading}>Continue as </Text>

      <View style={{ marginTop: RfH(16) }}>
        <TouchableOpacity onPress={() => createStudent()}>
          <Image style={{ alignSelf: 'center', marginTop: 16 }} source={Images.student} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.subHeading, { marginTop: RfH(16) }]}>Student</Text>

      <View style={{ marginTop: RfH(48) }}>
        <TouchableOpacity onPress={() => createTutor()}>
          <Image style={{ alignSelf: 'center', marginTop: 12 }} source={Images.tutor} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.subHeading, { marginTop: RfH(16) }]}>Tutor</Text>
    </View>
  );
}

export default UserTypeSelector;
