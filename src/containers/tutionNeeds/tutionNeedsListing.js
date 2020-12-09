/* eslint-disable no-restricted-syntax */
import { FlatList, Image, ScrollView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { introspectionFromSchema } from 'graphql';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Colors, Fonts, Images } from '../../theme';
import routeNames from '../../routes/screenNames';
import { getSubjectIcons, getUserImageUrl, RfH, RfW } from '../../utils/helpers';
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
        setOrderItems(data?.searchStudentPYTN?.edges);
      }
    },
  });

  useEffect(() => {
    getTutionNeeds({ variables: { searchDto: { id: 105068, offering: { id: 249 } } } });
  }, []);

  const renderClassItem = (item) => {
    return (
      <TouchableWithoutFeedback onPress={() => navigation.navigate(routeNames.TUTION_NEEDS_HISTORY, { data: item })}>
        <View>
          <View style={{ height: RfH(40) }} />
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={commonStyles.headingPrimaryText}>{item?.offering?.rootOffering?.displayName}</Text>
            <Text style={commonStyles.headingPrimaryText}>₹ {`${item.minPrice}-${item.maxPrice}`}</Text>
          </View>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
              {item?.offering?.parentOffering?.parentOffering?.displayName}
              {' | '}
              {item?.offering?.parentOffering?.displayName}
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
          <View style={[commonStyles.lineSeparator, { marginTop: RfH(16) }]} />
          <View style={{ marginVertical: RfH(16) }}>
            <Text style={[commonStyles.mediumPrimaryText, { textAlign: 'right' }]}>Remove</Text>
          </View>
          <View style={commonStyles.lineSeparator} />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <Loader isLoading={loadingTutionNeeds} />
      <ScreenHeader
        homeIcon
        label="Tution Details"
        horizontalPadding={RfW(16)}
        rightIcon={Images.moreInformation}
        showRightIcon
        onRightIconClick={() => navigation.navigate(routeNames.POST_TUTION_NEEDS)}
      />
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
    </View>
  );
}

export default TutionNeedsListing;
