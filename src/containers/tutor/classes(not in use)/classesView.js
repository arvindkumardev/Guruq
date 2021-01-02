/* eslint-disable no-restricted-syntax */
import { FlatList, Image, ScrollView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useLazyQuery } from '@apollo/client';
import { Colors, Fonts, Images } from '../../../theme';
import routeNames from '../../../routes/screenNames';
import {getFullName, getUserImageUrl, RfH, RfW} from '../../../utils/helpers';
import commonStyles from '../../../theme/styles';
import styles from '../../myClasses/styles';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { IconButtonWrapper } from '../../../components';
import { SEARCH_ORDER_ITEMS } from '../../student/booking.query';
import { OrderStatus } from '../../student/enums';
import Loader from '../../../components/Loader';

function ClassView() {
  const navigation = useNavigation();
  const [isHistorySelected, setIsHistorySelected] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const [orderItems, setOrderItems] = useState([]);

  const [searchOrderItems, { loading: loadingBookings }] = useLazyQuery(SEARCH_ORDER_ITEMS, {
    onError: (e) => {
      console.log(e);
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
      setIsEmpty(true);
    },
    onCompleted: (data) => {
      if (data && data?.searchOrderItems && data?.searchOrderItems.edges.length > 0) {
        setOrderItems(data?.searchOrderItems.edges);
        setIsEmpty(false);
      } else {
        setIsEmpty(true);
      }
    },
  });

  useEffect(() => {
    searchOrderItems({
      variables: {
        bookingSearchDto: {
          orderStatus: OrderStatus.COMPLETE.label,
          showHistory: false,
          showWithAvailableClasses: true,
        },
      },
    });
  }, []);

  const goToScheduleClasses = (item) => {
    if (!isHistorySelected) {
      const classes = [];
      for (let i = 1; i <= item.count; i++) {
        classes.push({ class: `${i}`, date: '', startTime: '' });
      }
      navigation.navigate(routeNames.STUDENT.SCHEDULE_CLASS, { classData: item, classes });
    }
  };

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
                {getFullName(item.tutor.contactDetail)}
              </Text>
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
                T-{item.tutor.id}
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

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;

    if (scrollPosition > 35) {
      setShowHeader(true);
    } else {
      setShowHeader(false);
    }
  };

  const onUnscheduledClicked = () => {
    searchOrderItems({
      variables: {
        bookingSearchDto: {
          orderStatus: OrderStatus.COMPLETE.label,
          showHistory: false,
          showWithAvailableClasses: true,
        },
      },
    });
    setIsHistorySelected(false);
  };

  const onHistoryClicked = () => {
    searchOrderItems({
      variables: {
        bookingSearchDto: {
          orderStatus: OrderStatus.COMPLETE.label,
          showHistory: true,
          showWithAvailableClasses: false,
        },
      },
    });
    setIsHistorySelected(true);
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white }]}>
      <View style={{ height: RfH(44), alignItems: 'center', justifyContent: 'center' }}>
        {showHeader && (
          <Text
            style={[
              commonStyles.headingPrimaryText,
              {
                alignSelf: 'center',
              },
            ]}>
            My Classes
          </Text>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={(event) => handleScroll(event)}
        stickyHeaderIndices={[1]}
        scrollEventThrottle={16}>
        <View>
          <Text style={commonStyles.pageTitleThirdRow}>My Classes</Text>
        </View>
        <View>
          <View
            style={[
              commonStyles.horizontalChildrenCenterView,
              showHeader
                ? { backgroundColor: Colors.white, paddingBottom: RfH(8) }
                : { paddingTop: RfH(16), backgroundColor: Colors.white },
            ]}>
            <Button
              onPress={() => onUnscheduledClicked()}
              small
              block
              bordered
              style={isHistorySelected ? styles.inactiveLeftButton : styles.activeLeftButton}>
              <Text style={isHistorySelected ? styles.inactiveButtonText : styles.activeButtonText}>
                Unscheduled Classes
              </Text>
            </Button>
            <Button
              onPress={() => onHistoryClicked()}
              small
              block
              bordered
              style={isHistorySelected ? styles.activeRightButton : styles.inactiveRightButton}>
              <Text style={isHistorySelected ? styles.activeButtonText : styles.inactiveButtonText}>History</Text>
            </Button>
          </View>
        </View>
        {loadingBookings ? (
          <View style={{ backgroundColor: Colors.lightGrey }}>
            <Loader isLoading={loadingBookings} />
          </View>
        ) : (
          <View>
            {!isEmpty ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={orderItems}
                renderItem={({ item }) => renderClassItem(item)}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: RfH(170) }}
              />
            ) : (
              <View>
                <Image
                  source={Images.empty_classes}
                  style={{
                    margin: RfH(56),
                    alignSelf: 'center',
                    height: RfH(200),
                    width: RfW(216),
                    marginBottom: RfH(32),
                  }}
                />
                <Text
                  style={[
                    commonStyles.pageTitleThirdRow,
                    { fontSize: RFValue(20, STANDARD_SCREEN_SIZE), textAlign: 'center' },
                  ]}>
                  No class found
                </Text>
                <Text
                  style={[
                    commonStyles.regularMutedText,
                    { marginHorizontal: RfW(60), textAlign: 'center', marginTop: RfH(16) },
                  ]}>
                  Looks like you haven't booked any class.
                </Text>
                <View style={{ height: RfH(32) }} />
                <Button block style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
                  <Text style={commonStyles.textButtonPrimary}>Book Now</Text>
                </Button>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export default ClassView;
