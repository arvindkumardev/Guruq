import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { userDetails } from '../../apollo/cache';
import Video from './Video';
import Loader from '../../components/Loader';
import { GET_MEETING_DETAILS_FOR_CLASS, GET_MEETING_DETAILS_FOR_INTERVIEW } from './onlineClass.query';
import NavigationRouteNames from '../../routes/screenNames';

const OnlineClass = (props) => {
  const navigation = useNavigation();
  const isFocussed = useIsFocused();

  const { route } = props;
  const { uuid, forInterview } = route.params;

  const userInfo = useReactiveVar(userDetails);
  const [token, setToken] = useState('');

  const [meetingDetails, setMeetingDetails] = useState({});

  const [getMeetingDetailsForInterview, { loading: loadingMeetingDetailsForInterview }] = useLazyQuery(
    GET_MEETING_DETAILS_FOR_INTERVIEW,
    {
      fetchPolicy: 'no-cache',
      onError: (e) => {
        console.log(e);
      },
      onCompleted: (data) => {
        setMeetingDetails(data?.meetingDetails);
        console.log(data);
      },
    }
  );

  const [getMeetingDetailsForClass, { loading: loadingMeetingDetailsForClass }] = useLazyQuery(
    GET_MEETING_DETAILS_FOR_CLASS,
    {
      fetchPolicy: 'no-cache',
      onError: (e) => {
        console.log(e);
      },
      onCompleted: (data) => {
        setMeetingDetails(data?.meetingDetails);
        console.log(data);
      },
    }
  );

  // const [getToken, { loading }] = useLazyQuery(GET_AGORA_RTC_TOKEN, {
  //   onError: (e) => {
  //     console.log(e);
  //   },
  //   onCompleted: (data) => {
  //     setToken(data?.generateAgoraRTCToken);
  //   },
  // });

  // useEffect(() => {
  //   if (isFocussed) {
  //     getToken({ variables: { channelName: uuid, userId: userInfo.id } });
  //   }
  // }, [isFocussed]);

  useEffect(() => {
    if (isFocussed) {
      if (forInterview) {
        getMeetingDetailsForInterview({ variables: { uuid } });
      } else {
        getMeetingDetailsForClass({ variables: { uuid } });
      }
    }
  }, [isFocussed]);

  const callEnded = () => {
    if (forInterview) {
      navigation.goBack();
    } else {
      navigation.navigate(NavigationRouteNames.STUDENT.SCHEDULED_CLASS_DETAILS, {
        uuid,
        showReviewModal: true,
      });
    }
  };

  const onPressBack = () => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <Loader isLoading={loadingMeetingDetailsForInterview || loadingMeetingDetailsForClass} />

      <Video
        userInfo={userInfo}
        channelName={uuid}
        meetingDetails={meetingDetails}
        onCallEnd={callEnded}
        onPressBack={onPressBack}
      />
    </View>
  );
};

OnlineClass.propTypes = {};

export default OnlineClass;
