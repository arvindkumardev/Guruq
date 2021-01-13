import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { userDetails } from '../../apollo/cache';
import Video from './Video';
import Loader from '../../components/Loader';
import { GET_AGORA_RTC_TOKEN, GET_MEETING_DETAILS } from './onlineClass.query';
import NavigationRouteNames from '../../routes/screenNames';

const OnlineClass = (props) => {
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const { route } = props;
  const { classDetails } = route.params;
  const userInfo = useReactiveVar(userDetails);
  const [token, setToken] = useState('');

  const [meetingDetails, setMeetingDetails] = useState({});

  const [getMeetingDetails, { loading: loadingMeetingDetails }] = useLazyQuery(GET_MEETING_DETAILS, {
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      setMeetingDetails(data?.meetingDetails);
      console.log(getMeetingDetails);
    },
  });
  const [getToken, { loading }] = useLazyQuery(GET_AGORA_RTC_TOKEN, {
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      setToken(data?.generateAgoraRTCToken);
    },
  });

  useEffect(() => {
    if (isFocussed) {
      getToken({ variables: { channelName: classDetails.uuid, userId: userInfo.id } });
    }
  }, [isFocussed]);

  useEffect(() => {
    if (isFocussed) {
      getMeetingDetails({ variables: { uuid: classDetails.uuid } });
    }
  }, [isFocussed]);

  const callEnded = () => {
    navigation.navigate(NavigationRouteNames.STUDENT.SCHEDULED_CLASS_DETAILS, {
      classId: classDetails.id,
      showReviewModal: true,
    });
  };

  const onPressBack = () => {
    navigation.goBack();
  };

  return loading ? (
    <Loader />
  ) : (
    <View style={{ flex: 1 }}>
      <Video
        onCallEnd={callEnded}
        onPressBack={onPressBack}
        classDetails={classDetails}
        userInfo={userInfo}
        channelName={classDetails?.uuid}
        token={token}
        meetingDetails={meetingDetails}
      />
    </View>
  );
};

OnlineClass.propTypes = {};

export default OnlineClass;
