import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { Button } from 'native-base';
import { useMutation } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { alertBox, RfH, RfW } from '../../utils/helpers';
import commonStyles from '../../theme/styles';
import Images from '../../theme/images';
import { Colors } from '../../theme';
import { MARK_CERTIFIED } from './certification-mutation';
import { Loader } from '../../components';
import NavigationRouteNames from '../../routes/screenNames';

const TutorWelcomeScreen = () => {
  const navigation = useNavigation();
  const [markCertified, { loading: markTutorCertifiedLoading }] = useMutation(MARK_CERTIFIED, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        navigation.navigate(NavigationRouteNames.TUTOR.CERTIFICATION_COMPLETED_VIEW);
      }
    },
  });

  const handleClick = () => {
    markCertified();
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', paddingTop: RfH(140), backgroundColor: Colors.white }}>
      <Loader isLoading={markTutorCertifiedLoading} />
      <Image source={Images.tutorWelcome} height={RfH(259)} weight={RfW(302)} />
      <View style={{ marginTop: RfH(52), alignItems: 'center' }}>
        <Text style={commonStyles.headingPrimaryText}> Welcome to GuruQ!</Text>
        <Text style={[commonStyles.regularPrimaryText, { marginTop: RfH(14), textAlign: 'center' }]}>
          Please proceed to provide the required data for certification process.
        </Text>
      </View>
      <Button
        onPress={handleClick}
        style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginTop: RfH(70), width: RfW(230) }]}>
        <Text style={commonStyles.textButtonPrimary}>Click here for Certification</Text>
      </Button>
    </View>
  );
};

export default TutorWelcomeScreen;
