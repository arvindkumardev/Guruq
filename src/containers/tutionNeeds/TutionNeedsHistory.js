/* eslint-disable no-restricted-syntax */
import { FlatList, ScrollView, Text, View, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button, Icon } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { Colors, Fonts, Images } from '../../theme';
import routeNames from '../../routes/screenNames';
import { getSubjectIcons, getUserImageUrl, RfH, RfW, titleCaseIfExists } from '../../utils/helpers';
import commonStyles from '../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { IconButtonWrapper, ScreenHeader } from '../../components';
import Loader from '../../components/Loader';
import { GET_TUTION_NEED_LISTING } from './pytn.query';
import styles from './styles';
import { offeringsMasterData, studentDetails } from '../../apollo/cache';

function TutionNeedsHistory() {
  const navigation = useNavigation();
  const offeringMasterData = useReactiveVar(offeringsMasterData);
  const studentInfo = useReactiveVar(studentDetails);
  const [tutorData, setTutorData] = useState([]);

  const [orderItem, setOrderItem] = useState({
    studyArea: 'School Education',
    minPrice: 200,
    maxPrice: 700,
    board: 'CBSE',
    class: 'Class 10',
    count: 2,
    groupSize: 1,
    onlineClass: false,
    subject: 'Mathematics',
  });

  const renderClassItem = () => {
    return (
      <View>
        <View style={{ height: RfH(40) }} />
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={commonStyles.headingPrimaryText}>{orderItem.studyArea}</Text>
          <Text style={commonStyles.headingPrimaryText}>₹ {`${orderItem.minPrice}-${orderItem.maxPrice}`}</Text>
        </View>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
            {orderItem.board}
            {' | '}
            {orderItem.class}
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
                iconImage={getSubjectIcons(orderItem.subject)}
              />
            </View>
            <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
              <Text
                style={{
                  fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
                  fontFamily: Fonts.semiBold,
                  marginTop: RfH(2),
                }}>
                {orderItem.subject}
              </Text>
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
                {orderItem.groupSize > 1 ? 'Group' : 'Individual'} Class
              </Text>
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
                {orderItem.onlineClass ? 'Online Class' : 'Home Tution'}
              </Text>
            </View>
          </View>
          <View style={commonStyles.verticallyCenterItemsView}>
            <Text
              style={[
                commonStyles.headingPrimaryText,
                { backgroundColor: Colors.lightBlue, padding: RfH(8), borderRadius: 8 },
              ]}>
              {orderItem.count}
            </Text>
            <Text style={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>Total</Text>
            <Text style={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>Classes</Text>
          </View>
        </View>
        <View style={[commonStyles.lineSeparator, { marginTop: RfH(16) }]} />
      </View>
    );
  };

  const getTutorImage = (tutor) => {
    return getUserImageUrl(tutor?.profileImage?.filename, tutor?.contactDetail?.gender, tutor.id);
  };

  const getTutorBudget = (item) => {
    const tutorOffering =
      item.tutorOfferings && item.tutorOfferings.find((s) => s.offerings.find((o) => o.id === offering.id));
    const onlineBudget = tutorOffering?.budgets.find((s) => s.onlineClass === true);
    const offlineBudget = tutorOffering?.budgets.find((s) => s.onlineClass === false);
    if (onlineBudget && offlineBudget) {
      return onlineBudget.price > offlineBudget.price ? offlineBudget.price : onlineBudget.price;
    }
    if (onlineBudget) {
      return onlineBudget.price;
    }
    if (offlineBudget) {
      return offlineBudget.price;
    }
    return 0;
  };

  const getFreeDemoClassView = (item) => {
    const tutorOffering =
      item.tutorOfferings && item.tutorOfferings.find((s) => s.offerings.find((o) => o.id === offering.id));
    return (
      tutorOffering?.freeDemo && (
        <View style={{ marginHorizontal: RfW(8), marginTop: RfH(8) }}>
          <View style={commonStyles.lineSeparator} />
          <Text
            style={{
              fontSize: RFValue(13, STANDARD_SCREEN_SIZE),
              color: Colors.secondaryText,
            }}>
            Free Demo Class
          </Text>
        </View>
      )
    );
  };

  const renderTutorItem = (item) => (
    <View style={styles.listItemParent}>
      <TouchableWithoutFeedback>
        <View style={[commonStyles.horizontalChildrenStartView]}>
          <View style={styles.userIconParent}>
            <IconButtonWrapper
              iconWidth={RfW(24)}
              iconHeight={RfH(24)}
              iconImage={getTutorImage(item)}
              imageResizeMode="cover"
              styling={styles.userIcon}
            />
            {item.id % 7 === 0 && (
              <View
                style={{
                  position: 'absolute',
                  bottom: -5,
                  left: 0,
                  zIndex: 100,
                  borderRadius: RfW(20),
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: RfW(8),
                }}>
                <View
                  style={{
                    backgroundColor: Colors.orange,
                    borderRadius: RfW(2),
                    paddingVertical: RfH(2),
                    paddingHorizontal: RfW(4),
                  }}>
                  <Text
                    style={{
                      fontSize: 10,
                      textTransform: 'uppercase',
                      color: Colors.white,
                      fontFamily: Fonts.bold,
                    }}>
                    Sponsored
                  </Text>
                </View>
              </View>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={[commonStyles.verticallyStretchedItemsView, { flex: 1, marginLeft: RfW(8) }]}>
                <Text style={styles.tutorName}>
                  {item.contactDetail.firstName} {item.contactDetail.lastName}
                </Text>
                {item.educationDetails.length > 0 && (
                  <Text style={styles.tutorDetails} numberOfLines={1}>
                    {titleCaseIfExists(item.educationDetails[0].degree?.degreeLevel)}
                    {' - '}
                    {titleCaseIfExists(item.educationDetails[0].fieldOfStudy)}
                  </Text>
                )}
                <Text style={styles.tutorDetails}>{item.teachingExperience} Years of Experience</Text>
                <View style={[styles.iconsView, { marginTop: RfH(8) }]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                    }}>
                    <Icon
                      type="FontAwesome"
                      name={item.averageRating > 0 ? 'star' : 'star-o'}
                      style={{ fontSize: 15, marginRight: RfW(4), color: Colors.brandBlue2 }}
                    />
                    {item.averageRating > 0 ? (
                      <Text style={styles.chargeText}>{parseFloat(item.averageRating).toFixed(1)}</Text>
                    ) : (
                      <Text
                        style={{
                          color: Colors.secondaryText,
                          fontSize: RFValue(13, STANDARD_SCREEN_SIZE),
                        }}>
                        NOT RATED
                      </Text>
                    )}

                    {item.reviewCount > 0 && (
                      <Text
                        style={{
                          color: Colors.secondaryText,
                          fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
                          marginLeft: RfW(8),
                        }}>
                        {item.reviewCount} Reviews
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
                  alignSelf: 'flex-start',
                }}>
                <View>
                  <Text style={styles.chargeText}>₹ {getTutorBudget(item)}/Hr</Text>
                </View>
              </View>
            </View>
            {getFreeDemoClassView(item)}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader homeIcon label="History" horizontalPadding={RfW(16)} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: RfW(16) }}>{renderClassItem()}</View>
        <View style={{ paddingHorizontal: RfW(16) }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={tutorData}
            renderItem={({ item }) => renderTutorItem(item)}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: RfH(170) }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default TutionNeedsHistory;
