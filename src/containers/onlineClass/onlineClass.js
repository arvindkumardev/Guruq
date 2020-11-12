import React from 'react';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import Video from '../../components/Video';
import NavigationRouteNames from '../../routes/screenNames';

const OnlineClass = (props) => {
  const navigation = useNavigation();

  const { route } = props;

  const { classDetails } = route.params;

  const callEnded = (back) => {
    navigation.navigate(NavigationRouteNames.STUDENT.SCHEDULED_CLASS_DETAILS, { classDetails, classEnded: !back });
  };

  return <Video onCallEnd={callEnded} />;
};

OnlineClass.propTypes = {};

export default OnlineClass;
