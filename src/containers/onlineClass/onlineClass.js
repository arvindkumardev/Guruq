import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useReactiveVar } from '@apollo/client';
import Video from '../../components/Video';
import { userDetails } from '../../apollo/cache';

const OnlineClass = (props) => {
  const navigation = useNavigation();

  const { route } = props;

  const { classDetails } = route.params;
  const userInfo = useReactiveVar(userDetails);

  console.log('userInfo', userInfo);

  const callEnded = (back) => {
    // navigation.navigate(NavigationRouteNames.STUDENT.SCHEDULED_CLASS_DETAILS, { classDetails, classEnded: !back });
  };

  return <Video onCallEnd={callEnded} userInfo={userInfo} />;
};

OnlineClass.propTypes = {};

export default OnlineClass;
