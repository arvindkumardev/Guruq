/* eslint-disable no-restricted-syntax */
import { FlatList, Image, ScrollView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { Colors, Fonts, Images } from '../../theme';
import routeNames from '../../routes/screenNames';
import { getUserImageUrl, RfH, RfW } from '../../utils/helpers';
import commonStyles from '../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { IconButtonWrapper, ScreenHeader } from '../../components';
import Loader from '../../components/Loader';
import { GET_TUTION_NEED_LISTING } from './pytn.query';
import { offeringsMasterData, studentDetails } from '../../apollo/cache';

function TutionNeedsListing() {
  const navigation = useNavigation();
  const offeringMasterData = useReactiveVar(offeringsMasterData);
  const studentInfo = useReactiveVar(studentDetails);

  const [orderItems, setOrderItems] = useState([]);

  const [getTutionNeeds, { loading: loadingTutionNeeds }] = useLazyQuery(GET_TUTION_NEED_LISTING, {
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setOrderItems(data.StudentPYTNConnection.edges);
      }
    },
  });

  useEffect(() => {
    getTutionNeeds({ variables: { searchDto: { id: 105068, offering: { id: 249 } } } });
  }, []);

  const getTutorImage = (tutor) => {
    return getUserImageUrl(tutor?.profileImage?.filename, tutor?.contactDetail?.gender, tutor.id);
  };

  const renderClassItem = (item) => {
    return (
      <View>
        <View style={{ height: RfH(40) }} />
        <Text style={commonStyles.headingPrimaryText}>{item.offering.displayName}</Text>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
            {item.offering?.parentOffering?.parentOffering?.displayName}
            {' | '}
            {item.offering?.parentOffering?.displayName}
          </Text>
          {!isHistorySelected && (
            <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.brandBlue2 }}>Renew Class</Text>
          )}
        </View>
        <View style={{ borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5, marginTop: RfH(8) }} />
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(8) }]}>
          <View style={commonStyles.horizontalChildrenStartView}>
            <View style={commonStyles.verticallyStretchedItemsView}>
              <IconButtonWrapper
                styling={{ borderRadius: RfH(32) }}
                iconWidth={RfH(64)}
                iconHeight={RfH(64)}
                imageResizeMode="cover"
                iconImage={getTutorImage(item.tutor)}
              />
              <Text
                style={{
                  marginTop: RfH(4),
                  fontSize: RFValue(10, STANDARD_SCREEN_SIZE),
                  textAlign: 'center',
                }}>
                Detail
              </Text>
            </View>
            <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
              <Text
                style={{
                  fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
                  fontFamily: Fonts.semiBold,
                  marginTop: RfH(2),
                }}>
                {item.tutor.contactDetail.firstName} {item.tutor.contactDetail.lastName}
              </Text>
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
                GURUS{item.tutor.id}
              </Text>
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
                {item.onlineClass ? 'Online' : 'Offline'} Individual Class
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
        <View style={{ borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5, marginTop: RfH(16) }} />
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
          {!isHistorySelected && (
            <Text
              style={{
                fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
                textAlign: 'right',
                color: Colors.darkGrey,
              }}>
              {item.availableClasses} Unscheduled Classses
            </Text>
          )}
          <Button
            onPress={() => goToScheduleClasses(item)}
            style={[
              commonStyles.buttonPrimary,
              {
                alignSelf: 'flex-end',
                marginRight: RfH(0),
                marginLeft: RfW(16),
              },
            ]}>
            <Text style={commonStyles.textButtonPrimary}>{isHistorySelected ? 'Renew Class' : 'Schedule Class'}</Text>
          </Button>
        </View>
        <View style={{ borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5 }} />
      </View>
    );
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader homeIcon label="Tution Details" horizontalPadding={RfW(16)} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={orderItems}
            renderItem={({ item }) => renderClassItem(item)}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: RfH(170) }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default TutionNeedsListing;
