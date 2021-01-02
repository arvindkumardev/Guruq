import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Button, Switch } from 'native-base';
import { RFValue } from 'react-native-responsive-fontsize';
import { IconButtonWrapper, Loader, ScreenHeader } from '../../../components';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { alertBox, getSubjectIcons, RfH, RfW } from '../../../utils/helpers';
import { tutorDetails } from '../../../apollo/cache';
import NavigationRouteNames from '../../../routes/screenNames';
import { SEARCH_TUTOR_OFFERINGS } from './subject.query';
import { TutorOfferingStageEnum } from '../enums';
import { DISABLE_TUTOR_OFFERING, ENABLE_TUTOR_OFFERING } from '../tutor.mutation';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';

function SubjectList() {
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const tutorInfo = useReactiveVar(tutorDetails);
  const [subjects, setSubjects] = useState([]);
  const [isListEmpty, setIsListEmpty] = useState(false);

  const [getTutorOffering, { loading: loadingTutorsOffering }] = useLazyQuery(SEARCH_TUTOR_OFFERINGS, {
    fetchPolicy: 'no-cache',
    variables: { tutorId: tutorInfo.id },
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        const subjectsList = data?.searchTutorOfferings;
        setSubjects(subjectsList);
        setIsListEmpty(subjectsList.length === 0);
      }
    },
  });

  const [enableTutorOffering, { loading: enableTutorOfferingLoading }] = useMutation(ENABLE_TUTOR_OFFERING, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        alertBox(`Enabled Successfully`, '', {
          positiveText: 'Ok',
          onPositiveClick: () => getTutorOffering(),
        });
      }
    },
  });

  const [disableTutorOffering, { loading: disableTutorOfferingLoading }] = useMutation(DISABLE_TUTOR_OFFERING, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        alertBox(`Disabled Successfully`, '', {
          positiveText: 'Ok',
          onPositiveClick: () => getTutorOffering(),
        });
      }
    },
  });

  useEffect(() => {
    if (isFocussed) {
      getTutorOffering();
    }
  }, [isFocussed]);

  const handleSubjectClick = (offering) => {
    if (offering.stage === TutorOfferingStageEnum.PT_PENDING.label) {
    } else {
      navigation.navigate(NavigationRouteNames.TUTOR.PRICE_MATRIX, {
        offering,
        priceMatrix:
          offering.stage === TutorOfferingStageEnum.BUDGET_PENDING.label ||
          offering.stage === TutorOfferingStageEnum.COMPLETED.label,
      });
    }
  };

  const markActiveInactive = (item) => {
    if (item.stage === TutorOfferingStageEnum.COMPLETED.label) {
      alertBox(`Do you really want to ${item.active ? 'disable' : 'enable'} the subject!`, '', {
        positiveText: 'Yes',
        onPositiveClick: () =>
          item.active
            ? disableTutorOffering({ variables: { tutorOfferingId: item.id } })
            : enableTutorOffering({ variables: { tutorOfferingId: item.id } }),
        negativeText: 'No',
      });
    } else {
      alertBox('Making subject active  is not possible at this stage');
    }
  };

  const renderSubjects = (item) => (
    <View style={{ paddingHorizontal: RfW(16) }}>
      <View style={commonStyles.horizontalChildrenSpaceView}>
        <TouchableOpacity
          style={[commonStyles.horizontalChildrenView, { paddingVertical: RfH(16), width: '70%' }]}
          onPress={() => handleSubjectClick(item)}
          activeOpacity={0.8}>
          <IconButtonWrapper iconImage={getSubjectIcons(item.offering.displayName)} />
          <View style={{ marginLeft: RfW(16) }}>
            <Text style={commonStyles.regularPrimaryText} numberOfLines={2}>
              {`${item?.offering?.rootOffering?.displayName} | ${item?.offering?.parentOffering?.parentOffering?.displayName}`}
            </Text>
            <Text style={[commonStyles.mediumPrimaryText, { marginTop: RfH(5) }]}>
              {`${item?.offering?.parentOffering?.displayName} | ${item?.offering?.displayName}`}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          {/* <Switch value={item.active} onValueChange={() => markActiveInactive(item)} /> */}
          <IconButtonWrapper iconHeight={RfH(24)} iconWidth={RfW(24)} iconImage={Images.chevronRight} />
        </View>
      </View>
      {item.stage === TutorOfferingStageEnum.PT_PENDING.label && (
        <Text style={[commonStyles.regularPrimaryText, { color: Colors.orangeRed }]}>Proficiency test pending</Text>
      )}
      {item.stage === TutorOfferingStageEnum.BUDGET_PENDING.label && (
        <Text style={[commonStyles.regularPrimaryText, { color: Colors.orangeRed }]}> Price matrix pending</Text>
      )}
      {item.stage === TutorOfferingStageEnum.OFFERING_DETAILED_PENDING.label && (
        <Text style={[commonStyles.regularPrimaryText, { color: Colors.orangeRed }]}>Short description pending</Text>
      )}
      <View style={commonStyles.lineSeparatorWithMargin} />
    </View>
  );

  const handleSubjectSelection = () => {
    navigation.navigate(NavigationRouteNames.TUTOR.SUBJECT_SELECTION);
  };

  return (
    <>
      <Loader isLoading={loadingTutorsOffering || enableTutorOfferingLoading || disableTutorOfferingLoading} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
        <ScreenHeader
          label="My Subjects"
          homeIcon
          showRightIcon
          rightIcon={Images.add}
          horizontalPadding={RfW(16)}
          onRightIconClick={handleSubjectSelection}
        />
        {!isListEmpty ? (
          <View style={commonStyles.verticallyStretchedItemsView}>
            <FlatList
              data={subjects}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => renderSubjects(item, index)}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ paddingBottom: RfH(100), paddingTop: RfH(20) }}
            />
          </View>
        ) : (
          <View style={{ flex: 1, paddingTop: RfH(70), alignItems: 'center' }}>
            <Image
              source={Images.empty_cart}
              style={{
                height: RfH(264),
                width: RfW(248),
                marginBottom: RfH(32),
              }}
              resizeMode="contain"
            />
            <Text
              style={[
                commonStyles.pageTitleThirdRow,
                { fontSize: RFValue(20, STANDARD_SCREEN_SIZE), textAlign: 'center' },
              ]}>
              No data found
            </Text>
            <Text
              style={[
                commonStyles.regularMutedText,
                { marginHorizontal: RfW(80), textAlign: 'center', marginTop: RfH(16) },
              ]}>
              Looks like you haven't provided your offering details.
            </Text>
            <Button
              onPress={handleSubjectSelection}
              style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginTop: RfH(64), width: RfW(190) }]}>
              <Text style={commonStyles.textButtonPrimary}>Add Subject</Text>
            </Button>
          </View>
        )}
      </View>
    </>
  );
}

export default SubjectList;
