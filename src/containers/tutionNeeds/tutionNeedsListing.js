/* eslint-disable no-restricted-syntax */
import { FlatList, Image, ScrollView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { isEmpty } from 'lodash';
import { Button } from 'native-base';
import { Colors, Fonts, Images } from '../../theme';
import routeNames from '../../routes/screenNames';
import { getSubjectIcons, RfH, RfW } from '../../utils/helpers';
import commonStyles from '../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { IconButtonWrapper, ScreenHeader } from '../../components';
import Loader from '../../components/Loader';
import { GET_TUTION_NEED_LISTING } from './pytn.query';
import { offeringsMasterData, studentDetails } from '../../apollo/cache';

function TutionNeedsListing(props) {
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const offeringMasterData = useReactiveVar(offeringsMasterData);
  const studentInfo = useReactiveVar(studentDetails);
  const {selectedOffering} = props.route.params

  const [orderItems, setOrderItems] = useState([]);

  const [getTutionNeeds, { loading: loadingTutionNeeds }] = useLazyQuery(GET_TUTION_NEED_LISTING, {
    onError: (e) => {
      console.log('e', e);
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
    if (isFocussed) {
      getTutionNeeds({ variables: { searchDto: { id: studentInfo.id, offering: { id: selectedOffering.id } } } });
    }
  }, [isFocussed]);

  const renderClassItem = (item) => (
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

  const addRequestHandle = () => {
    navigation.navigate(routeNames.POST_TUTION_NEEDS);
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <Loader isLoading={loadingTutionNeeds} />
      <ScreenHeader
        homeIcon
        label="Post your tuition needs"
        horizontalPadding={RfW(16)}
        rightIcon={Images.moreInformation}
        showRightIcon
        onRightIconClick={addRequestHandle}
      />
      {!isEmpty(orderItems) && (
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

      {isEmpty(orderItems) && (
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
            No data found
          </Text>
          <Text
            style={[
              commonStyles.regularMutedText,
              { marginHorizontal: RfW(80), textAlign: 'center', marginTop: RfH(16) },
            ]}>
            Looks like you haven't Requested for any class.
          </Text>
          <Button
            onPress={addRequestHandle}
            style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginTop: RfH(64), width: RfW(190) }]}>
            <Text style={commonStyles.textButtonPrimary}>Post your tuition needs</Text>
          </Button>
        </View>
      )}
    </View>
  );
}

export default TutionNeedsListing;
