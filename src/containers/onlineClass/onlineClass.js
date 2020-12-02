import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { userDetails } from '../../apollo/cache';
import Video from './components/Video';
import Loader from '../../components/Loader';
import { GET_AGORA_RTC_TOKEN } from './onlineClass.query';
import { GET_AVAILABILITY } from '../student/class.query';
import { RateReview } from '../../components';

const OnlineClass = (props) => {
  const navigation = useNavigation();
  const [showReviewPopup, setShowReviewPopup] = useState(false);

  const { route } = props;

  const { classDetails } = route.params;
  const userInfo = useReactiveVar(userDetails);

  const [token, setToken] = useState('');

  console.log('userInfo', userInfo);
  console.log('classDetails', classDetails);

  const [getToken, { loading }] = useLazyQuery(GET_AGORA_RTC_TOKEN, {
    onError: (e) => {
      console.log(e);
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      setToken(data?.generateAgoraRTCToken);
    },
  });

  useEffect(() => {
    getToken({ variables: { channelName: classDetails.uuid, userId: userInfo.id } });
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      getToken({ variables: { channelName: classDetails.uuid, userId: userInfo.id } });
    }, [])
  );

  const callEnded = () => {
    setShowReviewPopup(true);
    // navigation.navigate(NavigationRouteNames.STUDENT.SCHEDULED_CLASS_DETAILS, { classDetails, classEnded: !back });
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
      {showReviewPopup && (
        <RateReview visible={showReviewPopup} onClose={() => setShowReviewPopup(false)} classDetails={classDetails} />
      )}
    </View>
  );
};

OnlineClass.propTypes = {};

export default OnlineClass;
