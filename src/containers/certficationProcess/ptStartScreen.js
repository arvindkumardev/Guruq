import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { Button } from 'native-base';
import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import { getSubjectIcons, RfH, RfW } from '../../utils/helpers';
import commonStyles from '../../theme/styles';
import Images from '../../theme/images';
import { Colors } from '../../theme';
import { IconButtonWrapper, Loader, ScreenHeader } from '../../components';
import NavigationRouteNames from '../../routes/screenNames';
import { GET_TUTOR_OFFERING_DETAIL } from './certification-query';
import { offeringsMasterData } from '../../apollo/cache';
import { PtStatus } from '../tutor/enums';
import { MARK_CERTIFIED } from './certification-mutation';

const PtStartScreen = (props) => {
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const offeringId = props?.route.params.offeringId;
  const isOnBoarding = props?.route.params.isOnBoarding;
  const offeringMasterData = useReactiveVar(offeringsMasterData);
  const [ptDetail, setPtDetail] = useState({});
  const [offering, setOffering] = useState({});
  const [attemptExhausted, setAttemptExhausted] = useState(false);

  const [getTutorOfferingDetails, { loading: tutorLeadDetailLoading }] = useLazyQuery(GET_TUTOR_OFFERING_DETAIL, {
    fetchPolicy: 'no-cache',
    variables: { tutorOfferingId: offeringId },
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setOffering(
          offeringMasterData.find(
            (item) => item.id === data.getTutorOfferingDetails.offerings.find((item) => item.level === 3).id
          )
        );
        const ptTest = data.getTutorOfferingDetails.tutorProficiencyTests.sort((a, b) => (a.id < b.id ? 1 : -1));
        setPtDetail(ptTest[0]);
        setAttemptExhausted(data.getTutorOfferingDetails.allowedPTAttempts === 0);
      }
    },
  });

  const [markCertified, { loading: markTutorCertifiedLoading }] = useMutation(MARK_CERTIFIED, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        navigation.navigate(NavigationRouteNames.TUTOR.COMPLETE_PROFILE, { isOnBoarding });
      }
    },
  });

  useEffect(() => {
    if (isFocussed) {
      getTutorOfferingDetails();
    }
  }, [isFocussed]);

  const handleClick = () => {
    if (ptDetail?.status === PtStatus.PENDING.label || ptDetail?.status === PtStatus.FAILED.label) {
      navigation.navigate(NavigationRouteNames.TUTOR.PROFICIENCY_TEST, {
        offeringId,
      });
    }

    if (ptDetail?.status === PtStatus.PASSED.label || ptDetail?.status === PtStatus.EXEMPTED.label) {
      if (isOnBoarding) {
        markCertified();
      } else {
        navigation.goBack();
      }
    }
  };

  const getButtonText = () => {
    if (ptDetail?.status === PtStatus.PENDING.label) {
      return 'Start Test';
    }
    if (ptDetail?.status === PtStatus.FAILED.label) {
      return 'Retake Test';
    }
    if (ptDetail?.status === PtStatus.PASSED.label || ptDetail?.status === PtStatus.EXEMPTED.label) {
      return isOnBoarding ? 'Next Step' : 'Go back';
    }
  };

  const renderOffering = () => (
    <View
      style={[commonStyles.horizontalChildrenView, { paddingVertical: RfH(16), width: '70%', marginLeft: RfW(10) }]}>
      {!isEmpty(offering) && (
        <>
          <IconButtonWrapper iconImage={getSubjectIcons(offering?.displayName)} />
          <View style={{ marginLeft: RfW(16) }}>
            <Text style={commonStyles.regularPrimaryText} numberOfLines={2}>
              {`${offering?.rootOffering?.displayName} | ${offering?.parentOffering?.parentOffering?.displayName}`}
            </Text>
            <Text style={[commonStyles.mediumPrimaryText, { marginTop: RfH(5) }]}>
              {`${offering?.parentOffering?.displayName} | ${offering?.displayName}`}
            </Text>
          </View>
        </>
      )}
    </View>
  );

  const renderScore = () => (
    <View style={{ marginTop: RfH(20) }}>
      <Text style={[commonStyles.headingPrimaryText, { textAlign: 'center' }]}>
        Total Score {ptDetail?.score} (out of {ptDetail?.maxMarks})
      </Text>
      <View style={{ marginTop: RfH(30) }}>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: RfH(10) }}>
          <Text style={commonStyles.regularPrimaryText}>Correct</Text>
          <View
            style={{
              paddingVertical: RfH(10),
              paddingHorizontal: RfW(30),
              borderWidth: RfH(0.5),
              borderRadius: RfH(8),
              width: '28%',
              alignItems: 'center',
            }}>
            <Text style={commonStyles.regularPrimaryText}>{ptDetail?.score}</Text>
          </View>
        </View>

        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: RfH(10) }}>
          <Text style={commonStyles.regularPrimaryText}>In Correct</Text>
          <View
            style={{
              paddingVertical: RfH(10),
              paddingHorizontal: RfW(30),
              borderWidth: RfH(0.5),
              borderRadius: RfH(8),
              width: '28%',
              alignItems: 'center',
            }}>
            <Text style={commonStyles.regularPrimaryText}>
              {ptDetail?.maxMarks - ptDetail?.score - ptDetail?.notAttempted}
            </Text>
          </View>
        </View>

        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: RfH(10) }}>
          <Text style={commonStyles.regularPrimaryText}>Not Attempted</Text>
          <View
            style={{
              paddingVertical: RfH(10),
              paddingHorizontal: RfW(30),
              borderWidth: RfH(0.5),
              borderRadius: RfH(8),
              width: '28%',
              alignItems: 'center',
            }}>
            <Text style={commonStyles.regularPrimaryText}>{ptDetail?.notAttempted}</Text>
          </View>
        </View>

        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: RfH(10) }}>
          <Text style={commonStyles.regularPrimaryText}>Total</Text>
          <View
            style={{
              paddingVertical: RfH(10),
              paddingHorizontal: RfW(30),
              borderWidth: RfH(0.5),
              borderRadius: RfH(8),
              width: '28%',
              alignItems: 'center',
            }}>
            <Text style={commonStyles.regularPrimaryText}>{ptDetail?.maxMarks}</Text>
          </View>
        </View>

        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: RfH(10) }}>
          <Text style={commonStyles.regularPrimaryText}>Result</Text>
          <View
            style={{
              paddingVertical: RfH(10),
              paddingHorizontal: RfW(30),
              borderWidth: RfH(0.5),
              borderRadius: RfH(8),
              width: '28%',
              alignItems: 'center',
              backgroundColor: ptDetail?.status === PtStatus.PASSED.label ? Colors.green : Colors.orangeRed,
            }}>
            <Text style={[commonStyles.regularPrimaryText, { color: Colors.white }]}>
              {ptDetail?.status === PtStatus.PASSED.label ? 'PASS' : 'FAIL'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <Loader isLoading={tutorLeadDetailLoading || markTutorCertifiedLoading} />
      <ScreenHeader label="Proficiency Test" homeIcon horizontalPadding={RfW(16)} />
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.white,
          paddingHorizontal: RfH(20),
        }}>
        {ptDetail?.status === PtStatus.PENDING.label && (
          <>
            <View style={{ alignItems: 'center', marginVertical: RfH(50) }}>
              <Text style={[commonStyles.regularPrimaryText, { marginBottom: RfH(60), textAlign: 'center' }]}>
                You will get 30 minutes for 30 questions, Click begin to resume your test. GOOD LUCK{' '}
              </Text>
              <Image source={Images.ptTest} height={RfH(181)} weight={RfW(150)} />
            </View>
            {renderOffering()}
          </>
        )}

        {(ptDetail?.status === PtStatus.FAILED.label || ptDetail?.status === PtStatus.PASSED.label) && (
          <View style={{ marginTop: RfH(15) }}>
            {renderOffering()}
            {renderScore()}
          </View>
        )}

        {ptDetail?.status === PtStatus.EXEMPTED.label && (
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: RfH(20) }}>
            <Text style={commonStyles.headingPrimaryText}> You are exempted from the test</Text>
          </View>
        )}

        {!attemptExhausted && (
          <Button
            onPress={handleClick}
            style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginTop: RfH(40), width: RfW(230) }]}>
            <Text style={commonStyles.textButtonPrimary}>{getButtonText()}</Text>
          </Button>
        )}
        {attemptExhausted && (
          <View style={{ marginTop: RfH(30), justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[commonStyles.headingPrimaryText, { textAlign: 'center' }]}>
              Your all the attempts to take the exam are exhausted please contact the customer care
            </Text>
            <Button
              onPress={() => navigation.navigate(NavigationRouteNames.CUSTOMER_CARE)}
              style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginTop: RfH(40), width: RfW(230) }]}>
              <Text style={commonStyles.textButtonPrimary}>Customer care</Text>
            </Button>
          </View>
        )}
      </View>
    </>
  );
};

export default PtStartScreen;
