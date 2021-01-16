import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
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
import { offeringsMasterData, tutorDetails } from '../../apollo/cache';
import { PtStatus } from '../tutor/enums';
import { MARK_CERTIFIED } from './certification-mutation';
import ActionModal from './components/helpSection';
import { GET_CURRENT_TUTOR_QUERY } from '../common/graphql-query';
import { GET_OFFERINGS_MASTER_DATA } from '../student/dashboard-query';

const PtStartScreen = (props) => {
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const offeringId = props?.route.params.offeringId;
  const isOnBoarding = props?.route.params.isOnBoarding;
  const offeringMasterData = useReactiveVar(offeringsMasterData);
  const [ptDetail, setPtDetail] = useState({});
  const [offering, setOffering] = useState({});
  const [attemptExhausted, setAttemptExhausted] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const [getOfferingMasterData, { loading: loadingOfferingMasterData }] = useLazyQuery(GET_OFFERINGS_MASTER_DATA, {
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        console.log('e', e);
      }
    },
    onCompleted: (data) => {
      if (data) {
        offeringsMasterData(data.offerings.edges);
      }
    },
  });

  const [getTutorOfferingDetails, { loading: tutorLeadDetailLoading }] = useLazyQuery(GET_TUTOR_OFFERING_DETAIL, {
    fetchPolicy: 'no-cache',
    variables: { tutorOfferingId: offeringId },
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        const offering = offeringMasterData.find((item) => item.id === data?.getTutorOfferingDetails?.offering?.id);
        setOffering(offering);

        const ptTest = data.getTutorOfferingDetails?.tutorProficiencyTests?.sort((a, b) => (a.id < b.id ? 1 : -1));
        setPtDetail(ptTest[0]);
        setAttemptExhausted(data.getTutorOfferingDetails?.allowedPTAttempts === 0);
      }
    },
  });

  const [getCurrentTutor, { loading: getCurrentTutorLoading }] = useLazyQuery(GET_CURRENT_TUTOR_QUERY, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        tutorDetails(data?.getCurrentTutor);
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
        getCurrentTutor();
      }
    },
  });

  useEffect(() => {
    getOfferingMasterData();
  }, []);

  useEffect(() => {
    if (isFocussed && offeringMasterData) {
      getTutorOfferingDetails();
    }
  }, [isFocussed, offeringMasterData]);

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
    let text = '';
    if (ptDetail?.status === PtStatus.PENDING.label) {
      text = 'Start Your Test';
    }
    if (ptDetail?.status === PtStatus.FAILED.label) {
      text = 'Retake Test';
    }
    if (ptDetail?.status === PtStatus.PASSED.label || ptDetail?.status === PtStatus.EXEMPTED.label) {
      text = 'Continue';
    }
    return text;
  };

  const renderOffering = () => (
    <View style={[commonStyles.horizontalChildrenView, { paddingVertical: RfH(16), width: '70%' }]}>
      {!isEmpty(offering) && (
        <>
          <IconButtonWrapper iconImage={getSubjectIcons(offering?.displayName)} iconWidth={64} iconHeight={64} />
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
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: RfH(10),
          }}>
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
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: RfH(10),
          }}>
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
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: RfH(10),
          }}>
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
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: RfH(10),
          }}>
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
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: RfH(10),
          }}>
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
      <Loader isLoading={tutorLeadDetailLoading || markTutorCertifiedLoading || getCurrentTutorLoading} />
      <ScreenHeader label="Proficiency Test" homeIcon horizontalPadding={RfW(16)} />
      <ScrollView
        style={{ backgroundColor: Colors.white, paddingBottom: RfH(40) }}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.white,
            paddingHorizontal: RfH(16),
          }}>
          {(ptDetail?.status === PtStatus.FAILED.label || ptDetail?.status === PtStatus.PASSED.label) && (
            <View style={{ marginTop: RfH(15) }}>
              {renderOffering()}
              {renderScore()}
            </View>
          )}

          {ptDetail?.status === PtStatus.PENDING.label && (
            <>
              <View style={{ marginVertical: RfH(15) }}>
                <View>{renderOffering()}</View>
                <View style={{ alignItems: 'center', marginVertical: RfH(40) }}>
                  <Image source={Images.ptTest} style={{ height: RfH(150), width: RfW(150) }} resizeMode="contain" />
                </View>
                {!isEmpty(ptDetail.proficiencyTest) && (
                  <>
                    <Text
                      style={[
                        commonStyles.headingPrimaryText,
                        { marginTop: RfH(20), marginBottom: RfH(20), textAlign: 'center' },
                      ]}>
                      Test Instructions
                    </Text>
                    <View style={{ marginHorizontal: RfW(16) }}>
                      <View style={[commonStyles.horizontalChildrenStartView, { alignItems: 'center' }]}>
                        <IconButtonWrapper iconImage={Images.active_blue_circle} iconWidth={8} iconHeight={8} />
                        <Text style={{ marginLeft: RfW(16) }}>There will be 30 questions.</Text>
                      </View>
                      <View
                        style={[commonStyles.horizontalChildrenStartView, { alignItems: 'center', marginTop: RfH(8) }]}>
                        <IconButtonWrapper iconImage={Images.active_blue_circle} iconWidth={8} iconHeight={8} />
                        <Text style={{ marginLeft: RfW(16) }}>You will have 30 minutes to complete the test.</Text>
                      </View>
                    </View>
                    <Text style={[commonStyles.regularPrimaryText, { marginTop: RfH(20), textAlign: 'center' }]}>
                      GOOD LUCK!
                    </Text>
                  </>
                )}
              </View>
            </>
          )}

          {!isEmpty(ptDetail) && isEmpty(ptDetail.proficiencyTest) ? (
            <View style={commonStyles.verticallyCenterItemsView}>
              <Text style={[commonStyles.headingPrimaryText, { textAlign: 'center' }]}>
                PT not available for the selected subject, please contact customer support.
              </Text>

              <Button
                onPress={() => navigation.navigate(NavigationRouteNames.CUSTOMER_CARE)}
                style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginTop: RfH(40), width: RfW(230) }]}>
                <Text style={commonStyles.textButtonPrimary}>Customer Support</Text>
              </Button>
            </View>
          ) : (
            !isEmpty(ptDetail) &&
            !attemptExhausted && (
              <Button
                onPress={handleClick}
                style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginTop: RfH(20), width: RfW(230) }]}>
                <Text style={commonStyles.textButtonPrimary}>{getButtonText()}</Text>
              </Button>
            )
          )}

          {!isEmpty(ptDetail) && ptDetail?.status === PtStatus.EXEMPTED.label && (
            <>
              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: RfH(100) }}>
                <Text style={commonStyles.headingPrimaryText}>You are exempted from the test</Text>
              </View>
              <Button
                onPress={handleClick}
                style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginTop: RfH(20), width: RfW(230) }]}>
                <Text style={commonStyles.textButtonPrimary}>{getButtonText()}</Text>
              </Button>
            </>
          )}

          {!isEmpty(ptDetail) &&
            ptDetail?.status !== PtStatus.PASSED.label &&
            ptDetail?.status !== PtStatus.EXEMPTED.label &&
            attemptExhausted && (
              <View style={{ marginTop: RfH(20), justifyContent: 'center', alignItems: 'center' }}>
                <Text style={[commonStyles.headingPrimaryText, { textAlign: 'center' }]}>
                  {'All PT attempts Exhausted.\n Contact the customer support.'}
                </Text>
                <Button
                  onPress={() => navigation.navigate(NavigationRouteNames.CUSTOMER_CARE)}
                  style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginTop: RfH(40), width: RfW(230) }]}>
                  <Text style={commonStyles.textButtonPrimary}>Customer Support</Text>
                </Button>
              </View>
            )}
        </View>
      </ScrollView>
      {openMenu && <ActionModal isVisible={openMenu} closeMenu={() => setOpenMenu(false)} />}
    </>
  );
};

export default PtStartScreen;
