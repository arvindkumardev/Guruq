import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Switch } from 'native-base';
import { IconButtonWrapper, Loader, ScreenHeader } from '../../../components';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { getSubjectIcons, RfH, RfW } from '../../../utils/helpers';
import { tutorDetails } from '../../../apollo/cache';
import NavigationRouteNames from '../../../routes/screenNames';
import { SEARCH_TUTOR_OFFERINGS } from './subject.query';
import { TutorOfferingStageEnum } from '../enums';

function SubjectList() {
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const [subjects, setSubjects] = useState([]);
  const tutorInfo = useReactiveVar(tutorDetails);

  const [getTutorOffering, { loading: loadingTutorsOffering }] = useLazyQuery(SEARCH_TUTOR_OFFERINGS, {
    fetchPolicy: 'no-cache',
    variables: { tutorId: tutorInfo?.id },
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        const subjectList = [];
        data?.searchTutorOfferings?.map((item) => {
          if (item.offering && subjectList.findIndex((obj) => obj.offering.id === item.offering.id) === -1) {
            subjectList.push(item);
          }
          setSubjects(subjectList);
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
              {item?.offering?.displayName}
            </Text>
            <Text
              style={[
                commonStyles.mediumPrimaryText,
                { marginTop: RfH(5) },
              ]}>{`${item?.offering?.parentOffering?.parentOffering?.displayName} | ${item?.offering?.parentOffering?.displayName}`}</Text>
          </View>
        </TouchableOpacity>

        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <Switch value={item.active} />
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

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <Loader isLoading={loadingTutorsOffering} />
      <ScreenHeader
        label="My Subjects"
        homeIcon
        showRightIcon
        rightIcon={Images.moreInformation}
        horizontalPadding={RfW(16)}
        onRightIconClick={() => navigation.navigate(NavigationRouteNames.TUTOR.SUBJECT_SELECTION)}
      />
      <View style={commonStyles.verticallyStretchedItemsView}>
        <FlatList
          data={subjects}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => renderSubjects(item, index)}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: RfH(100), paddingTop: RfH(20) }}
        />
      </View>
    </View>
  );
}

export default SubjectList;
