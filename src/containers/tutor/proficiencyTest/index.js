import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import ScreenHeader from '../../../components/ScreenHeader';
import { RfW } from '../../../utils/helpers';
import { Images } from '../../../theme';
import ActionModal from '../../certficationProcess/components/helpSection';
import PTTestView from '../../../components/PTTest';
import { CHECK_PT_RESPONSE, START_PROFICIENCY_TEST } from './pt.mutation';
import NavigationRouteNames from '../../../routes/screenNames';
import Loader from '../../../components/Loader';

const ProficiencyTest = (props) => {
  const { route } = props;
  const navigation = useNavigation();
  const offeringId = route?.params?.offeringId;
  const [openMenu, setOpenMenu] = useState(false);
  const [isError] = useState(false);
  const [ptQuestions, setPTQuestions] = useState([]);
  const [ptDetails, setPTDetails] = useState(null);

  const goBack = () => {
    navigation.navigate(NavigationRouteNames.TUTOR.PT_START_SCREEN);
  };
  const [startPTRequest, { loading: startPTLoading }] = useMutation(START_PROFICIENCY_TEST, {
    fetchPolicy: 'no-cache',
    onError(e) {
      console.log(e);
      goBack();
    },
    onCompleted(data) {
      if (data?.startProficiencyTest) {
        const { tutorPT, questions } = data.startProficiencyTest;
        setPTQuestions(questions);
        setPTDetails(tutorPT);
        if (!(questions.length > 0 && tutorPT != null)) {
          goBack();
        }
        // FIXME: take user back to "Start Test" screen if there are no questions
      }
    },
  });

  const [checkPTRequest, { loading: checkPTLoading }] = useMutation(CHECK_PT_RESPONSE, {
    fetchPolicy: 'no-cache',

    onError(e) {
      console.log({ e });
    },
    onCompleted(data) {
      navigation.navigate(NavigationRouteNames.TUTOR.PROFICIENCY_RESULT, {
        data,
      });
    },
  });
  const handleSubmit = (checkPTDto) => {
    checkPTRequest({ variables: { tutorOfferingId: parseInt(offeringId, 10), checkPTDto } });
  };

  useEffect(() => {
    if (offeringId > 0) {
      startPTRequest({
        variables: {
          tutorOfferingId: parseInt(offeringId, 10),
        },
      });
    }
  }, [offeringId]);
  return (
    <>
      <ScreenHeader
        label="Proficiency Test"
        homeIcon
        horizontalPadding={RfW(16)}
        showRightIcon
        rightIcon={Images.vertical_dots_b}
        onRightIconClick={() => setOpenMenu(true)}
      />
      <Loader isLoading={startPTLoading || checkPTLoading} />
      {ptQuestions.length > 0 && ptDetails != null && (
        <>
          <PTTestView
            ptQuestions={ptQuestions}
            ptDetails={ptDetails}
            offeringId={offeringId}
            handleSubmit={handleSubmit}
          />
        </>
      )}
      {isError && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Something went wrong</Text>
        </View>
      )}
      {openMenu && <ActionModal isVisible={openMenu} closeMenu={() => setOpenMenu(false)} navigation={navigation} />}
    </>
  );
};

export default ProficiencyTest;
