/* eslint-disable no-restricted-syntax */
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import { Button } from 'native-base';
import { isEmpty } from 'lodash';
import { Colors, Fonts, Images } from '../../../theme';
import routeNames from '../../../routes/screenNames';
import { alertBox, getSubjectIcons, RfH, RfW } from '../../../utils/helpers';
import commonStyles from '../../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { IconButtonWrapper, ScreenHeader } from '../../../components';
import Loader from '../../../components/Loader';
import { GET_TUTION_NEED_LISTING } from './pytn.query';
import { offeringsMasterData, studentDetails } from '../../../apollo/cache';
import { DELETE_STUDENT_PYTN } from './pytn.mutation';

function PytnListing(props) {
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const offeringMasterData = useReactiveVar(offeringsMasterData);
  const studentInfo = useReactiveVar(studentDetails);

  const [orderItems, setOrderItems] = useState([]);
  const [isListEmpty, setIsListEmpty] = useState(false);

  const [getTutionNeeds, { loading: loadingTutionNeeds }] = useLazyQuery(GET_TUTION_NEED_LISTING, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setIsListEmpty(data?.searchStudentPYTN?.edges.length === 0);
        setOrderItems(data?.searchStudentPYTN?.edges);
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
            getTutionNeeds({ variables: { searchDto: { studentId: studentInfo.id, page: 1, size: 100 } } });
          },
          negativeText: 'No',
        });
      }
    },
  });

  useEffect(() => {
    if (isFocussed) {
      getTutionNeeds({ variables: { searchDto: { studentId: studentInfo.id, page: 1, size: 100 } } });
    }
  }, [isFocussed]);

  const getRootOfferingName = (offering) =>
    offeringMasterData.find((item) => item.id === offering?.offering?.id)?.rootOffering?.displayName;

  const removePytn = (item) => {
    alertBox('Do you really want to remove the request', '', {
      positiveText: 'Yes',
      onPositiveClick: () => {
        deletePYTN({ variables: { studentPytnId: item.id } });
      },
      negativeText: 'No',
    });
  };

  const renderClassItem = (item) => (
    <>
      <TouchableOpacity
        onPress={() => navigation.navigate(routeNames.TUTION_NEEDS_HISTORY, { data: item, studentPytnId: item.id })}
        activeOpacity={1}>
        <View style={{ height: RfH(35) }} />
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <View>
            <Text style={commonStyles.headingPrimaryText}>{getRootOfferingName(item)}</Text>
            <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
              {item?.offering?.parentOffering?.parentOffering?.displayName}
              {' | '}
              {item?.offering?.parentOffering?.displayName}
            </Text>
          </View>
          <Text style={commonStyles.headingPrimaryText}>₹ {`${item.minPrice}-${item.maxPrice}`}</Text>
        </View>
        <View style={[commonStyles.lineSeparator, { marginTop: RfH(8) }]} />
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(16) }]}>
          <View style={commonStyles.horizontalChildrenStartView}>
            <View style={commonStyles.verticallyStretchedItemsView}>
              <IconButtonWrapper
                iconWidth={RfH(64)}
                iconHeight={RfH(64)}
                imageResizeMode="cover"
                iconImage={getSubjectIcons(item?.offering?.displayName)}
              />
            </View>
            <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
              <Text
                style={{
                  fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
                  fontFamily: Fonts.semiBold,
                  marginTop: RfH(2),
                }}>
                {item?.offering?.displayName}
              </Text>
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
                {item.groupSize > 1 ? 'Group' : 'Individual'} Class
              </Text>
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
                {item.onlineClass ? 'Online Class' : 'Home Tution'}
              </Text>
            </View>
          </View>
          <View style={commonStyles.verticallyCenterItemsView}>
            <Text
              style={[
                commonStyles.headingPrimaryText,
                { backgroundColor: Colors.lightBlue, padding: RfH(8), borderRadius: 8 },
              ]}>
              {item.count}
            </Text>
            <Text style={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>Total</Text>
            <Text style={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>Classes</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={[commonStyles.lineSeparator, { marginTop: RfH(10) }]} />
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: RfH(20),
        }}>
        <Text style={commonStyles.mediumPrimaryText}>
          {!isEmpty(item.acceptedPytns)
            ? `Your request has been accepted by ${item.acceptedPytns.length} tutors`
            : 'Not accepted yet'}
        </Text>
        <TouchableOpacity onPress={() => removePytn(item)}>
          <Text style={[commonStyles.mediumPrimaryText, { textAlign: 'right' }]}>Remove</Text>
        </TouchableOpacity>
      </View>
      <View style={commonStyles.lineSeparator} />
    </>
  );

  const addRequestHandle = () => {
    navigation.navigate(routeNames.POST_TUTION_NEEDS);
  };

  return (
    <>
      <Loader isLoading={loadingTutionNeeds || pytnDelete} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
        <ScreenHeader
          homeIcon
          label="Post Your Tuition Needs"
          horizontalPadding={RfW(16)}
          rightIcon={Images.moreInformation}
          showRightIcon
          onRightIconClick={addRequestHandle}
        />
        {!isListEmpty && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ paddingHorizontal: RfW(16) }}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={orderItems}
                renderItem={({ item }) => renderClassItem(item)}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: RfH(170) }}
              />
            </View>
          </ScrollView>
        )}

        {isListEmpty && (
          <View style={{ flex: 1, paddingTop: RfH(100), alignItems: 'center' }}>
            <Image
              source={Images.nopytn}
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
              {/*No data found*/}
              Looks like you haven't posted your tuition need.
            </Text>
            <Text
              style={[
                commonStyles.regularMutedText,
                { marginHorizontal: RfW(80), textAlign: 'center', marginTop: RfH(16) },
              ]}>
              {/*Looks like you haven't posted your tuition need.*/}
              Post your tuition need to broadcast your tuition requirements to all relevant tutors.
            </Text>
            <Button
              onPress={addRequestHandle}
              style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginTop: RfH(64), width: RfW(190) }]}>
              <Text style={commonStyles.textButtonPrimary}>Post Your Tuition Need</Text>
            </Button>
          </View>
        )}
      </View>
    </>
  );
}

export default PytnListing;
