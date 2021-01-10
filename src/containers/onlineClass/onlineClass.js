import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { userDetails } from '../../apollo/cache';
import Video from './Video';
import Loader from '../../components/Loader';
import { GET_AGORA_RTC_TOKEN } from './onlineClass.query';
import NavigationRouteNames from '../../routes/screenNames';
import { alertBox } from '../../utils/helpers';

const OnlineClass = (props) => {
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const { route } = props;
  const { classDetails } = route.params;
  const userInfo = useReactiveVar(userDetails);
  const [token, setToken] = useState('');

  const [getToken, { loading }] = useLazyQuery(GET_AGORA_RTC_TOKEN, {
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
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
      />
    </View>
  );
};

OnlineClass.propTypes = {};

export default OnlineClass;
