import React from 'react';
import { Image, Text, View } from 'react-native';
import { Button } from 'native-base';
import { useLazyQuery } from '@apollo/client';
import { RfH, RfW } from '../../utils/helpers';
import commonStyles from '../../theme/styles';
import Images from '../../theme/images';
import { Colors } from '../../theme';
import { Loader } from '../../components';
import { GET_CURRENT_TUTOR_QUERY } from '../common/graphql-query';
import { tutorDetails } from '../../apollo/cache';

const TutorVerificationScreen = () => {
  const [getCurrentTutor, { loading: getCurrentTutorLoading }] = useLazyQuery(GET_CURRENT_TUTOR_QUERY, {
    fetchPolicy: 'no-cache',
    onError: (e) => {},
    onCompleted: (data) => {
      if (data) {
        tutorDetails(data?.getCurrentTutor);
      }
    },
  });

  const handleClick = () => {
    getCurrentTutor();
  };

  return (
    <>
      <Loader isLoading={getCurrentTutorLoading} />
      <View style={{ flex: 1, alignItems: 'center', paddingTop: RfH(140), backgroundColor: Colors.white }}>
        <Image source={Images.pendingStatus} style={{ width: RfW(300), height: RfH(300) }} resizeMode="cover" />
        <View style={{ marginTop: RfH(52), alignItems: 'center' }}>
          <Text style={commonStyles.headingPrimaryText}> Verification pending</Text>
          <Text
            style={[
              commonStyles.regularPrimaryText,
              { marginTop: RfH(14), paddingHorizontal: RfW(15), textAlign: 'center' },
            ]}>
            Your background verification is pending. Once its done you will be able to avail sessions.
          </Text>
        </View>
        <Button
          onPress={handleClick}
          style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginTop: RfH(70), width: RfW(230) }]}>
          <Text style={commonStyles.textButtonPrimary}>Check Status</Text>
        </Button>
      </View>
    </>
  );
};

export default TutorVerificationScreen;
