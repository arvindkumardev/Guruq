import React, { useEffect } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { studentDetails, tutorDetails, userDetails } from '../../apollo/cache';
import { getUserImageUrl } from '../../utils/helpers';
import { UserTypeEnum } from '../../common/userType.enum';
import Video from './components/Video';
import Loader from '../../components/Loader';
import { GET_AGORA_RTC_TOKEN } from './onlineClass.query';

const OnlineClass = (props) => {
  const navigation = useNavigation();

  const { route } = props;

  const { classDetails } = route.params;
  const userInfo = useReactiveVar(userDetails);
  const participantInfo =
    userInfo.type === UserTypeEnum.STUDENT ? useReactiveVar(studentDetails) : useReactiveVar(tutorDetails);

  const user = {
    uuid: participantInfo.uuid,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    profileImage: getUserImageUrl(
      participantInfo?.profileImage?.filename,
      participantInfo?.contactDetail?.gender,
      participantInfo.id
    ),
  };

  console.log('userInfo', userInfo);
  console.log('user', user);

  const [getToken, { data, loading }] = useLazyQuery(GET_AGORA_RTC_TOKEN);
  useEffect(() => {
    getToken();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      getToken();
    }, [])
  );

  const callEnded = (back) => {
    // navigation.navigate(NavigationRouteNames.STUDENT.SCHEDULED_CLASS_DETAILS, { classDetails, classEnded: !back });
  };

  const onPressBack = () => {
    navigation.goBack();
  };

  return loading ? (
    <Loader />
  ) : (
    <Video
      onCallEnd={callEnded}
      onPressBack={onPressBack}
      userInfo={user}
      channelName={classDetails?.uuid}
      token={data?.generateAgoraRTCToken}
    />
  );
};

OnlineClass.propTypes = {};

export default OnlineClass;
