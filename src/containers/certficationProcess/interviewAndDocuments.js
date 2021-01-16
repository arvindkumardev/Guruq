import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Button } from 'native-base';
import { isEmpty } from 'lodash';
import { IconButtonWrapper, ScreenHeader } from '../../components';
import { printDate, printTime, RfH, RfW } from '../../utils/helpers';
import Loader from '../../components/Loader';
import { Colors, Images } from '../../theme';
import commonStyles from '../../theme/styles';
import styles from './styles';
import { GET_TUTOR_ALL_DETAILS } from './certification-query';
import NavigationRouteNames from '../../routes/screenNames';
import { MARK_CERTIFIED } from './certification-mutation';
import { InterviewStatus } from '../tutor/enums';
import ActionModal from './components/helpSection';
import { GET_CURRENT_TUTOR_QUERY } from '../common/graphql-query';
import { tutorDetails } from '../../apollo/cache';

const InterviewAndDocument = () => {
  const isFocussed = useIsFocused();
  const navigation = useNavigation();
  const [tutorDetail, setTutorDetail] = useState({});
  const [openMenu, setOpenMenu] = useState(false);

  const [getTutorDetails, { loading: tutorLeadDetailLoading }] = useLazyQuery(GET_TUTOR_ALL_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        setTutorDetail(data.getTutorDetails);
      }
    },
  });

  const [getCurrentTutor, { loading: getCurrentTutorLoading }] = useLazyQuery(GET_CURRENT_TUTOR_QUERY, {
    fetchPolicy: 'no-cache',
    onError: (e) => {},
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
    if (isFocussed) {
      getTutorDetails();
    }
  }, [isFocussed]);

  const isButtonVisible = () => {
    return (
      !isEmpty(tutorDetail?.lead?.interview) &&
      (tutorDetail?.lead?.interview.status === InterviewStatus.CLEARED.label ||
        tutorDetail?.lead?.interview.status === InterviewStatus.EXEMPTED.label) &&
      !isEmpty(tutorDetail?.documents) &&
      tutorDetail?.documents.length === 4
    );
  };

  const handleNext = () => {
    markCertified();
  };
  const isInterviewSchedulingAllowed = () =>
    tutorDetail?.lead?.interview.status === InterviewStatus.NOT_SCHEDULED.label ||
    tutorDetail?.lead?.interview.status === InterviewStatus.RESCHEDULED.label;

  const getInterviewText = () => {
    if (
      tutorDetail?.lead?.interview.status === InterviewStatus.SCHEDULED.label ||
      tutorDetail?.lead?.interview.status === InterviewStatus.RESCHEDULED.label
    ) {
      return `Your interview is scheduled on ${printDate(tutorDetail?.lead?.interview.startDate)} at ${printTime(
        tutorDetail?.lead?.interview.startDate
      )}`;
    }

    if (tutorDetail?.lead?.interview.status === InterviewStatus.NOT_SCHEDULED.label) {
      return 'Schedule your interview';
    }
    return `Your interview status is ${tutorDetail?.lead?.interview.status.replace('_', ' ').toLowerCase()}`;
  };

  return (
    <View style={{ backgroundColor: Colors.white, flex: 1 }}>
      <Loader isLoading={tutorLeadDetailLoading || markTutorCertifiedLoading || getCurrentTutorLoading} />
      <ScreenHeader
        label="Interview & Documents"
        horizontalPadding={RfW(16)}
        showRightIcon
        rightIcon={Images.vertical_dots_b}
        onRightIconClick={() => setOpenMenu(true)}
        homeIcon
        handleBack={() => navigation.navigate(NavigationRouteNames.TUTOR.CERTIFICATE_STEPS)}
      />

      <TouchableOpacity
        style={[styles.interviewCard, { borderLeftColor: Colors.orange }]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate(NavigationRouteNames.TUTOR.SCHEDULE_YOUR_INTERVIEW)}
        disabled={!isInterviewSchedulingAllowed()}>
        <View style={{ flexDirection: 'row' }}>
          <IconButtonWrapper
            iconImage={Images.schedule_interview}
            iconWidth={RfH(24)}
            iconHeight={RfW(24)}
            imageResizeMode="contain"
          />
          <View>
            <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(10) }]}>Schedule Interview</Text>
            {!isInterviewSchedulingAllowed() && (
              <View style={{ paddingHorizontal: RfW(10), marginTop: RfH(5) }}>
                <Text style={[commonStyles.mediumPrimaryText, { color: Colors.orange }]}>{getInterviewText()}</Text>
              </View>
            )}
          </View>
          {isInterviewSchedulingAllowed() && (
            <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
              <IconButtonWrapper
                iconImage={Images.right_arrow_grey}
                iconWidth={RfH(24)}
                iconHeight={RfW(24)}
                imageResizeMode="contain"
              />
            </View>
          )}
        </View>
      </TouchableOpacity>

      {tutorDetail?.lead?.interview?.status === InterviewStatus.SCHEDULED.label &&
        !isEmpty(tutorDetail?.lead?.interview?.conductedBy) && (
          <View style={{ marginVertical: RfH(16) }}>
            <Button
              onPress={() =>
                navigation.navigate(NavigationRouteNames.ONLINE_CLASS, {
                  uuid: tutorDetail?.lead.uuid,
                  isInterview: true,
                })
              }
              style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
              <Text style={commonStyles.textButtonPrimary}>Start Interview</Text>
            </Button>
          </View>
        )}

      <TouchableOpacity
        style={[styles.interviewCard, { borderLeftColor: Colors.green }]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate(NavigationRouteNames.TUTOR.UPLOAD_DOCUMENTS)}
        disabled={!isEmpty(tutorDetail?.documents) && tutorDetail?.documents.length === 4}>
        <View style={{ flexDirection: 'row' }}>
          <IconButtonWrapper
            iconImage={Images.documentUpload}
            iconWidth={RfH(24)}
            iconHeight={RfW(24)}
            imageResizeMode="contain"
          />
          <View>
            <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(10) }]}>Upload Documents</Text>
            <View style={{ paddingHorizontal: RfW(10), marginTop: RfH(5) }}>
              <Text
                style={[
                  commonStyles.mediumPrimaryText,
                  {
                    color:
                      isEmpty(tutorDetail?.documents) || tutorDetail?.documents.length !== 4
                        ? Colors.orangeRed
                        : Colors.green,
                  },
                ]}>
                {isEmpty(tutorDetail?.documents) || tutorDetail?.documents.length !== 4 ? 'Pending' : 'Updated'}
              </Text>
            </View>
          </View>
          {isEmpty(tutorDetail?.documents) ||
            (tutorDetail?.documents.length !== 4 && (
              <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                <IconButtonWrapper
                  iconImage={Images.right_arrow_grey}
                  iconWidth={RfH(24)}
                  iconHeight={RfW(24)}
                  imageResizeMode="contain"
                />
              </View>
            ))}
        </View>
      </TouchableOpacity>
      {!isEmpty(tutorDetail) && isButtonVisible() && (
        <Button
          onPress={handleNext}
          style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginTop: RfH(70), width: RfW(230) }]}>
          <Text style={[commonStyles.textButtonPrimary, { marginRight: RfW(16) }]}>Next Step</Text>
          <IconButtonWrapper iconHeight={RfH(24)} iconWidth={RfW(24)} iconImage={Images.rightArrow_white} />
        </Button>
      )}
      {openMenu && <ActionModal isVisible={openMenu} closeMenu={() => setOpenMenu(false)} />}
    </View>
  );
};

export default InterviewAndDocument;
