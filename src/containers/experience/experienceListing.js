import { FlatList, Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'native-base';
import { startCase } from 'lodash';
import { IconButtonWrapper, Loader, ScreenHeader } from '../../components';
import commonStyles from '../../theme/styles';
import { Colors, Images } from '../../theme';
import { alertBox, formatDate, RfH, RfW } from '../../utils/helpers';
import NavigationRouteNames from '../../routes/screenNames';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { GET_EXPERIENCE_LIST } from './experience.query';
import { DELETE_TUTOR_EXPERIENCE } from './experience.mutation';

function ExperienceListing() {
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const [experienceList, setExperienceList] = useState([]);
  const [isListEmpty, setIsListEmpty] = useState(false);

  const [getExperienceList, { loading: experienceListLoading }] = useLazyQuery(GET_EXPERIENCE_LIST, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setExperienceList(data?.getTutorExperienceDetails?.experienceDetails);
        setIsListEmpty(data?.getTutorExperienceDetails?.experienceDetails.length === 0);
      }
    },
  });

  const [deleteExperienceDetail, { loading: experienceDeleteLoading }] = useMutation(DELETE_TUTOR_EXPERIENCE, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        alertBox(`Your experience details has been deleted successfully`, '', {
          positiveText: 'Yes',
          onPositiveClick: () => getExperienceList(),
        });
      }
    },
  });

  useEffect(() => {
    if (isFocussed) {
      getExperienceList();
    }
  }, [isFocussed]);

  const handleDelete = (item) => {
    deleteExperienceDetail({ variables: { id: item.id } });
  };

  const handleDeleteConfirmation = (item) => {
    alertBox(`Do you really want to delete your experience!`, '', {
      positiveText: 'Yes',
      onPositiveClick: () => handleDelete(item),
      negativeText: 'No',
    });
  };

  const handleAddEditExperience = (item) => {
    navigation.navigate(NavigationRouteNames.ADD_EDIT_EXPERIENCE, { detail: item || {} });
  };

  const renderExperiences = (item) => (
    <View style={{ marginTop: RfH(20) }}>
      <View style={commonStyles.horizontalChildrenStartView}>
        <IconButtonWrapper
          iconImage={Images.work_office}
          iconWidth={RfW(16)}
          iconHeight={RfH(16)}
          imageResizeMode="contain"
          styling={{ marginTop: RfH(5) }}
        />
        <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
          <Text style={commonStyles.regularPrimaryText}>{item?.title}</Text>
          <Text style={commonStyles.mediumMutedText}>
            {item?.institution?.name} - {startCase(item.employmentType)}
          </Text>
          <Text style={commonStyles.mediumMutedText}>
            {formatDate(item.startDate, 'YYYY')} - {!item.current ? formatDate(item.endDate, 'YYYY') : 'Present'}
          </Text>
        </View>
      </View>
      <View style={[commonStyles.horizontalChildrenEqualSpaceView, { marginTop: RfH(16), marginBottom: RfH(8) }]}>
        <TouchableWithoutFeedback onPress={() => handleAddEditExperience(item)}>
          <Text style={{ color: Colors.orange }}>Edit</Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => handleDeleteConfirmation(item)}>
          <Text style={{ color: Colors.orange }}>Delete</Text>
        </TouchableWithoutFeedback>
      </View>
      <View style={commonStyles.lineSeparator} />
    </View>
  );
  return (
    <>
      <Loader isLoading={experienceListLoading || experienceDeleteLoading} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
        <ScreenHeader
          homeIcon
          label="Manage Experiences"
          horizontalPadding={RfW(16)}
          showRightIcon
          rightIcon={Images.add}
          onRightIconClick={handleAddEditExperience}
        />
        <View style={{ height: RfH(10) }} />
        {!isListEmpty ? (
          <View style={{ paddingHorizontal: RfW(16) }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={experienceList}
              renderItem={({ item, index }) => renderExperiences(item, index)}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={experienceList.length > 3}
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
              Looks like you haven't provided your experience details.
            </Text>
            <Button
              onPress={() => handleAddEditExperience()}
              style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginTop: RfH(64), width: RfW(190) }]}>
              <Text style={commonStyles.textButtonPrimary}>Add Experience</Text>
            </Button>
          </View>
        )}
      </View>
    </>
  );
}

export default ExperienceListing;
