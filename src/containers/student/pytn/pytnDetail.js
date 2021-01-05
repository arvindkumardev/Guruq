/* eslint-disable no-restricted-syntax */
import { FlatList, Image, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import { Colors, Fonts, Images } from '../../../theme';
import { alertBox, getFullName, getSubjectIcons, RfH, RfW, titleCaseIfExists } from '../../../utils/helpers';
import commonStyles from '../../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { IconButtonWrapper, ScreenHeader, TutorImageComponent } from '../../../components';
import Loader from '../../../components/Loader';
import styles from './styles';
import { offeringsMasterData } from '../../../apollo/cache';
import { GET_ACCEPTED_TUTOR_NEED } from './pytn.query';
import { DELETE_STUDENT_PYTN } from './pytn.mutation';
import NavigationRouteNames from '../../../routes/screenNames';

function PytnDetail(props) {
  const { route } = props;

  const classData = route?.params?.data;
  const studentPytnId = route?.params?.studentPytnId;
  const navigation = useNavigation();
  const offeringMasterData = useReactiveVar(offeringsMasterData);
  const [tutorData, setTutorData] = useState([]);
  const [isListEmpty, setIsListEmpty] = useState(false);

  const [getAcceptedTutorNeeds, { loading: loadingAcceptedTutor }] = useLazyQuery(GET_ACCEPTED_TUTOR_NEED, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setIsListEmpty(data?.getStudentPytnAccepted?.edges.length === 0);
        setTutorData(data?.getStudentPytnAccepted?.edges);
      }
    },
  });

  const [deletePYTN, { loading: pytnDelete }] = useMutation(DELETE_STUDENT_PYTN, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        alertBox('Request removed successfully', '', {
          positiveText: 'Ok',
          onPositiveClick: () => {
            navigation.goBack();
          },
        });
      }
    },
  });

  const getRootOfferingName = (offering) =>
    offeringMasterData.find((item) => item.id === offering?.offering?.id)?.rootOffering?.displayName;

  useEffect(() => {
    if (studentPytnId) {
      getAcceptedTutorNeeds({ variables: { acceptedSearchDto: { studentPytnId } } });
    }
  }, [studentPytnId]);

  const removePytn = (item) => {
    alertBox('Are you sure you want to remove this PYTN request?', '', {
      positiveText: 'Delete PYTN',
      onPositiveClick: () => {
        deletePYTN({ variables: { studentPytnId: item.id } });
      },
      negativeText: 'No',
    });
  };

  const goToTutorDetails = (item) => {
    navigation.navigate(NavigationRouteNames.STUDENT.TUTOR_DETAILS, {
      tutorData: item.tutor,
      parentOffering: classData?.offering?.parentOffering?.id,
      parentParentOffering: classData?.offering?.parentOffering?.parentOffering?.id,
      parentOfferingName: classData?.offering?.parentOffering?.displayName,
      parentParentOfferingName: classData?.offering?.parentOffering?.parentOffering?.displayName,
    });
  };

  const renderClassItem = () => (
    <View>
      <View style={{ height: RfH(20) }} />
      <View style={commonStyles.horizontalChildrenSpaceView}>
        <Text style={commonStyles.headingPrimaryText}>{getRootOfferingName(classData)}</Text>
        <Text style={commonStyles.headingPrimaryText}>₹ {`${classData.minPrice}-${classData.maxPrice}`}</Text>
      </View>
      <View style={commonStyles.horizontalChildrenSpaceView}>
        <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
          {classData?.offering?.parentOffering?.parentOffering?.displayName}
          {' | '}
          {classData?.offering?.parentOffering?.displayName}
        </Text>
      </View>
      <View style={[commonStyles.lineSeparator, { marginTop: RfH(8) }]} />
      <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(16) }]}>
        <View style={commonStyles.horizontalChildrenStartView}>
          <View style={commonStyles.verticallyStretchedItemsView}>
            <IconButtonWrapper
              iconWidth={RfH(64)}
              iconHeight={RfH(64)}
              imageResizeMode="cover"
              iconImage={getSubjectIcons(classData?.offering?.displayName)}
            />
          </View>
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
            <Text
              style={{
                fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
                fontFamily: Fonts.semiBold,
                marginTop: RfH(2),
              }}>
              {classData?.offering?.displayName}
            </Text>
            <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
              {classData.groupSize > 1 ? 'Group' : 'Individual'} Class
            </Text>
            <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
              {classData.onlineClass ? 'Online' : 'Offline'} Class
            </Text>
          </View>
        </View>
        <View style={commonStyles.verticallyCenterItemsView}>
          <Text
            style={[
              commonStyles.headingPrimaryText,
              { backgroundColor: Colors.lightBlue, padding: RfH(8), borderRadius: 8 },
            ]}>
            {classData.count}
          </Text>
          <Text style={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>Total</Text>
          <Text style={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>Classes</Text>
        </View>
      </View>
      <View style={[commonStyles.lineSeparator, { marginTop: RfH(16) }]} />
      <TouchableOpacity style={{ paddingVertical: RfH(16) }} onPress={() => removePytn(classData)}>
        <Text style={[commonStyles.mediumPrimaryText, { textAlign: 'right' }]}>Remove</Text>
      </TouchableOpacity>
      <View style={commonStyles.lineSeparator} />
    </View>
  );

  const renderTutorItem = (item) => (
    <View style={styles.listItemParent}>
      <TouchableWithoutFeedback onPress={() => goToTutorDetails(item)}>
        <View style={[commonStyles.horizontalChildrenStartView]}>
          <View style={styles.userIconParent}>
            <TutorImageComponent tutor={item.tutor} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={[commonStyles.verticallyStretchedItemsView, { flex: 1, marginLeft: RfW(8) }]}>
                <Text style={styles.tutorName}>{getFullName(item?.tutor?.contactDetail)}</Text>
                {item.tutor.educationDetails && item.tutor.educationDetails.length > 0 && (
                  <Text style={styles.tutorDetails} numberOfLines={1}>
                    {titleCaseIfExists(item.tutor.educationDetails[0].degree?.degreeLevel)}
                    {' - '}
                    {titleCaseIfExists(item.tutor.educationDetails[0].fieldOfStudy)}
                  </Text>
                )}
                <Text style={styles.tutorDetails}>{item.tutor.teachingExperience} Years of Experience</Text>
                <View style={[styles.iconsView, { marginTop: RfH(8) }]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                    }}>
                    <IconButtonWrapper
                      iconImage={item.tutor.averageRating > 0 ? Images.filledStar : Images.unFilledStar}
                      iconHeight={RfH(15)}
                      iconWidth={RfW(15)}
                      imageResizeMode="contain"
                      styling={{ marginRight: RfW(4) }}
                    />
                    {item.tutor.averageRating > 0 ? (
                      <Text style={styles.chargeText}>{parseFloat(item.tutor.averageRating).toFixed(1)}</Text>
                    ) : (
                      <Text
                        style={{
                          color: Colors.secondaryText,
                          fontSize: RFValue(13, STANDARD_SCREEN_SIZE),
                        }}>
                        NOT RATED
                      </Text>
                    )}

                    {item.tutor.reviewCount > 0 && (
                      <Text
                        style={{
                          color: Colors.secondaryText,
                          fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
                          marginLeft: RfW(8),
                        }}>
                        {item.tutor.reviewCount} Reviews
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  alignSelf: 'center',
                }}>
                <View>
                  <Text style={styles.chargeText}>₹ {item.price}/Hr</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );

  return (
    <>
      <Loader isLoading={loadingAcceptedTutor || pytnDelete} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
        <ScreenHeader homeIcon label="Post Your Tutor Need Detail" horizontalPadding={RfW(16)} />
        <View style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: RfW(16) }}>{renderClassItem()}</View>
          <View style={{ paddingHorizontal: RfW(16) }}>
            {!isListEmpty ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={tutorData}
                renderItem={({ item }) => renderTutorItem(item)}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={<View style={{ height: RfH(20) }} />}
                ListFooterComponent={<View style={{ height: RfH(520) }} />}
              />
            ) : (
              <View style={{ paddingTop: RfH(20), alignItems: 'center' }}>
                <Image
                  source={Images.nopytn}
                  style={{
                    height: RfH(200),
                    width: RfW(248),
                    marginBottom: RfH(32),
                  }}
                  resizeMode="contain"
                />
                <View>
                  <Text
                    style={[
                      commonStyles.pageTitleThirdRow,
                      { fontSize: RFValue(20, STANDARD_SCREEN_SIZE), textAlign: 'center' },
                    ]}>
                    No tutor found
                  </Text>
                  <Text
                    style={[
                      commonStyles.regularMutedText,
                      { marginHorizontal: RfW(80), textAlign: 'center', marginTop: RfH(16) },
                    ]}>
                    No tutor have accepted your request yet.
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    </>
  );
}

export default PytnDetail;
