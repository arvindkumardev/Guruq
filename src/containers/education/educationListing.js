import { FlatList, Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'native-base';
import { startCase } from 'lodash';
import { IconButtonWrapper, Loader, ScreenHeader } from '../../components';
import { userType } from '../../apollo/cache';
import commonStyles from '../../theme/styles';
import { Colors, Images } from '../../theme';
import { alertBox, printDate, printYear, RfH, RfW } from '../../utils/helpers';
import NavigationRouteNames from '../../routes/screenNames';
import { UserTypeEnum } from '../../common/userType.enum';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { DELETE_TUTOR_EDUCATION_DETAILS } from './education.mutation';
import { GET_STUDENT_EDUCATION_DETAILS, GET_TUTOR_EDUCATION_DETAILS } from './education.query';

function EducationListing() {
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const userTypeVal = useReactiveVar(userType);
  const isStudent = userTypeVal === UserTypeEnum.STUDENT.label;
  const [educationDetails, setEducationDetails] = useState([]);
  const [isListEmpty, setIsListEmpty] = useState(false);

  const [getStudentDetails, { loading: studentDetailLoading }] = useLazyQuery(GET_STUDENT_EDUCATION_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        setEducationDetails(data?.getStudentDetails?.educationDetails);
        setIsListEmpty(data?.getStudentDetails?.educationDetails.length === 0);
      }
    },
  });

  const [getTutorDetails, { loading: tutorDetailLoading }] = useLazyQuery(GET_TUTOR_EDUCATION_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        setEducationDetails(data?.getTutorDetails?.educationDetails);
        setIsListEmpty(data?.getTutorDetails?.educationDetails.length === 0);
      }
    },
  });

  const [deleteEducationDetail, { loading: educationDeleteLoading }] = useMutation(DELETE_TUTOR_EDUCATION_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        if (isStudent) {
          getStudentDetails();
        } else {
          getTutorDetails();
        }
      }
    },
  });

  useEffect(() => {
    if (isFocussed) {
      if (isStudent) {
        getStudentDetails();
      } else {
        getTutorDetails();
      }
    }
  }, [isFocussed]);

  const handleDelete = (item) => {
    deleteEducationDetail({ variables: { id: item.id } });
  };

  const handleDeleteConfirmation = (item) => {
    alertBox(`Do you really want to delete the education qualification!`, '', {
      positiveText: 'Yes',
      onPositiveClick: () => handleDelete(item),
      negativeText: 'No',
    });
  };

  const handleAddEditEducation = (item) => {
    navigation.navigate(NavigationRouteNames.ADD_EDIT_EDUCATION, { detail: item });
  };

  const renderEducation = (item) => (
    <View style={{ marginTop: RfH(20) }}>
      <View style={commonStyles.horizontalChildrenStartView}>
        <IconButtonWrapper
          iconImage={Images.school}
          iconWidth={RfW(16)}
          iconHeight={RfH(20)}
          styling={{ marginTop: RfH(2) }}
          imageResizeMode="contain"
        />
        <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
          {item.board && (
            <Text style={commonStyles.regularPrimaryText}>
              {item?.board}, {item?.grade} {item?.fieldOfStudy ? item?.fieldOfStudy : ''}
            </Text>
          )}
          {item.degree && (
            <Text style={commonStyles.regularPrimaryText}>
              {item?.degree?.name},{' '}
              {startCase(item?.degree?.degreeLevel ? item?.degree?.degreeLevel.toLowerCase() : '')}
            </Text>
          )}
          <Text style={commonStyles.mediumMutedText}>{item?.school?.name}</Text>
          <Text style={commonStyles.mediumMutedText}>
            {printYear(item.startDate)} - {!item.isCurrent ? printYear(item.endDate) : 'Present'}
          </Text>
        </View>
      </View>
      <View style={[commonStyles.horizontalChildrenEqualSpaceView, { marginTop: RfH(16), marginBottom: RfH(8) }]}>
        <TouchableWithoutFeedback onPress={() => handleAddEditEducation(item)}>
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
      <Loader isLoading={tutorDetailLoading || studentDetailLoading || educationDeleteLoading} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
        <ScreenHeader
          homeIcon
          label="Education"
          horizontalPadding={RfW(16)}
          showRightIcon
          rightIcon={Images.add}
          onRightIconClick={handleAddEditEducation}
        />
        <View style={{ height: RfH(10) }} />
        {!isListEmpty ? (
          <View style={{ paddingHorizontal: RfW(16) }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={educationDetails}
              renderItem={({ item, index }) => renderEducation(item, index)}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={educationDetails.length > 6}
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
              You haven't provided your education qualification.
            </Text>
            <Button
              onPress={() => handleAddEditEducation()}
              style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginTop: RfH(64), width: RfW(190) }]}>
              <Text style={commonStyles.textButtonPrimary}>Add Education</Text>
            </Button>
          </View>
        )}
      </View>
    </>
  );
}

export default EducationListing;
