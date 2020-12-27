import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import { RFValue } from 'react-native-responsive-fontsize';
import { useIsFocused } from '@react-navigation/native';
import { Button } from 'native-base';
import commonStyles from '../../../theme/styles';
import { IconButtonWrapper, ScreenHeader, Loader } from '../../../components';
import { Colors, Fonts } from '../../../theme';
import { alertBox, getSubjectIcons, RfH, RfW } from '../../../utils/helpers';
import { SEARCH_TUTOR_PYTN_REQUESTS } from '../../student/pytn/pytn.query';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { offeringsMasterData } from '../../../apollo/cache';
import { ACCEPT_STUDENT_PYTN } from '../../student/pytn/pytn.mutation';

function PytnRequests() {
  const [requests, setRequests] = useState([]);
  const isFocussed = useIsFocused();
  const offeringMasterData = useReactiveVar(offeringsMasterData);

  const [getPytnRequests, { loading: pytnRequestLoading }] = useLazyQuery(SEARCH_TUTOR_PYTN_REQUESTS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setRequests(data.searchTutorPYTN.edges);
      }
    },
  });

  const [acceptStudentPytn, { loading: acceptStudentPytnLoading }] = useMutation(ACCEPT_STUDENT_PYTN, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        alertBox('Request accepted successfully', '', {
          positiveText: 'ok',
          onPositiveClick: () => {
            getPytnRequests({ variables: { searchDto: { size: 100 } } });
          },
          negativeText: 'No',
        });
      }
    },
  });

  const handleAccept = (request) => {
    acceptStudentPytn({ variables: { studentPYTNAcceptDto: { studentPytnId: request.id, price: 150 } } });
  };

  useEffect(() => {
    if (isFocussed) {
      getPytnRequests({ variables: { searchDto: { size: 100 } } });
    }
  }, [isFocussed]);

  const getRootOfferingName = (offering) =>
    offeringMasterData.find((item) => item.id === offering?.offering?.id)?.rootOffering?.displayName;

  const renderClassItem = (item) => (
    <>
      <View style={{ marginBottom: RfH(10) }}>
        <View style={{ height: RfH(30) }} />
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
      </View>
      <View style={commonStyles.lineSeparator} />
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginVertical: RfH(5) }}>
        <Button block style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]} onPress={() => handleAccept(item)}>
          <Text style={commonStyles.textButtonPrimary}>Accept</Text>
        </Button>
      </View>
      <View style={commonStyles.lineSeparator} />
    </>
  );

  return (
    <>
      <Loader isLoading={acceptStudentPytnLoading || pytnRequestLoading} />
      <ScreenHeader label="Student Requests" homeIcon horizontalPadding={RfW(16)} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: RfW(16) }]}>
        <FlatList
          data={requests}
          renderItem={({ item, index }) => renderClassItem(item, index)}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: RfH(120) }}
        />
      </View>
    </>
  );
}

export default PytnRequests;
