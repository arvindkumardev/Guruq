import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { Button } from 'native-base';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import { getSubjectIcons, RfH, RfW } from '../../utils/helpers';
import commonStyles from '../../theme/styles';
import Images from '../../theme/images';
import { Colors } from '../../theme';
import { IconButtonWrapper, Loader, ScreenHeader } from '../../components';
import NavigationRouteNames from '../../routes/screenNames';
import { GET_TUTOR_LEAD_DETAIL, GET_TUTOR_OFFERING_DETAIL } from './certification-query';
import { offeringsMasterData } from '../../apollo/cache';
import { PtStatus } from '../tutor/enums';

const PtStartScreen = (props) => {
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const offeringId = props?.route.params.offeringId;
  const isOnBoarding = props?.route.params.isOnBoarding;
  const [leadDetail, setLeadDetail] = useState({});
  const offeringMasterData = useReactiveVar(offeringsMasterData);
  const [offering, setOffering] = useState({});

  const [getTutorOfferingDetails, { loading: tutorLeadDetaixlLoading }] = useLazyQuery(GET_TUTOR_OFFERING_DETAIL, {
    fetchPolicy: 'no-cache',
    variables: { tutorOfferingId: offeringId },
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        console.log('data', data);
      }
    },
  });

  const [getTutorLeadDetails, { loading: tutorLeadDetailLoading }] = useLazyQuery(GET_TUTOR_LEAD_DETAIL, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setLeadDetail(data.getTutorLeadDetails);
        setOffering(offeringMasterData.find((item) => item.id === data.getTutorLeadDetails.tutorOffering?.offering.id));
      }
    },
  });

  useEffect(() => {
    if (isFocussed) {
      getTutorOfferingDetails();
      getTutorLeadDetails();
    }
  }, [isFocussed]);

  const handleClick = () => {
    if (
      leadDetail?.tutorProficiencyTest?.status === PtStatus.PENDING.label ||
      leadDetail?.tutorProficiencyTest?.status === PtStatus.FAILED.label
    ) {
      navigation.navigate(NavigationRouteNames.TUTOR.PROFICIENCY_TEST, {
        offeringId: leadDetail.tutorOffering?.id,
      });
    }

    if (
      leadDetail?.tutorProficiencyTest?.status === PtStatus.PASSED.label ||
      leadDetail?.tutorProficiencyTest?.status === PtStatus.EXEMPTED.label
    ) {
      navigation.navigate(NavigationRouteNames.TUTOR.PROFICIENCY_TEST, {
        offeringId: leadDetail.tutorOffering?.id,
      });
    }
  };

  const getButtonText = () => {
    if (leadDetail?.tutorProficiencyTest?.status === PtStatus.PENDING.label) {
      return 'Start Test';
    }
    if (leadDetail?.tutorProficiencyTest?.status === PtStatus.FAILED.label) {
      return 'Retake Test';
    }
    if (
      leadDetail?.tutorProficiencyTest?.status === PtStatus.PASSED.label ||
      leadDetail?.tutorProficiencyTest?.status === PtStatus.EXEMPTED.label
    ) {
      return 'Next Step';
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
        Total Score {leadDetail?.tutorProficiencyTest?.score} (out of {leadDetail?.tutorProficiencyTest?.maxMarks})
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
            <Text style={commonStyles.regularPrimaryText}>{leadDetail?.tutorProficiencyTest?.score}</Text>
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
            <Text style={commonStyles.regularPrimaryText}>{leadDetail?.tutorProficiencyTest?.score}</Text>
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
            <Text style={commonStyles.regularPrimaryText}>{leadDetail?.tutorProficiencyTest?.notAttempted}</Text>
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
            <Text style={commonStyles.regularPrimaryText}>{leadDetail?.tutorProficiencyTest?.maxMarks}</Text>
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
              backgroundColor:
                leadDetail?.tutorProficiencyTest?.status === PtStatus.PASSED.label ? Colors.green : Colors.orangeRed,
            }}>
            <Text style={[commonStyles.regularPrimaryText, { color: Colors.white }]}>
              {leadDetail?.tutorProficiencyTest?.status === PtStatus.PASSED.label ? 'PASS' : 'FAIL'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <Loader isLoading={tutorLeadDetailLoading} />
      <ScreenHeader label="Proficiency Test" homeIcon horizontalPadding={RfW(16)} />
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.white,
          paddingHorizontal: RfH(20),
        }}>
        {leadDetail?.tutorProficiencyTest?.status === PtStatus.PENDING.label && (
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

        {(leadDetail?.tutorProficiencyTest?.status === PtStatus.FAILED.label ||
          leadDetail?.tutorProficiencyTest?.status === PtStatus.PASSED.label) && (
          <View style={{ marginTop: RfH(15) }}>
            {renderOffering()}
            {renderScore()}
          </View>
        )}

        {leadDetail?.tutorProficiencyTest?.status === PtStatus.EXEMPTED.label && (
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: RfH(20) }}>
            <Text style={commonStyles.headingPrimaryText}> You are exempted from the test</Text>
          </View>
        )}

        <Button
          onPress={handleClick}
          style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginTop: RfH(40), width: RfW(230) }]}>
          <Text style={commonStyles.textButtonPrimary}>{getButtonText()}</Text>
        </Button>
      </View>
    </>
  );
};

export default PtStartScreen;
