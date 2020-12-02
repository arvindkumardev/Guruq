/* eslint-disable no-restricted-syntax */
import { FlatList, Image, ScrollView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import { Colors, Fonts, Images } from '../../../theme';
import routeNames from '../../../routes/screenNames';
import { getUserImageUrl, RfH, RfW } from '../../../utils/helpers';
import commonStyles from '../../../theme/styles';
import styles from './styles';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { IconButtonWrapper } from '../../../components';
import { SEARCH_BOOKINGS } from '../booking.query';
import { OrderStatus } from '../enums';
import Loader from '../../../components/Loader';

function bookingConfirmed() {
  const navigation = useNavigation();
  const [isHistorySelected, setIsHistorySelected] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const { loading: loadingBookings, error: bookingError, data: bookingData } = useQuery(SEARCH_BOOKINGS, {
    variables: {
      bookingSearchDto: {
        orderStatus: OrderStatus.COMPLETE.label,
      },
    },
  });

  const goToScheduleClasses = (item) => {
    const classes = [];
    for (let i = 1; i <= item.orderItem?.count; i++) {
      classes.push({ class: `${i}`, date: '', startTime: '' });
    }
    navigation.navigate(routeNames.STUDENT.SCHEDULE_CLASS, { classData: item, classes });
  };

  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    if (bookingData) {
      if (bookingData?.searchBookings.length > 0) {
        const orderList = [];
        for (const booking of bookingData.searchBookings) {
          for (const orderItem of booking.orderItems) {
            orderList.push({ booking, orderItem });
          }
        }
        setOrderItems(orderList);
        setIsEmpty(false);
      } else {
        setIsEmpty(true);
      }
    } else {
      setIsEmpty(true);
    }
  }, [bookingData]);

  const getTutorImage = (tutor) => {
    return getUserImageUrl(tutor?.profileImage?.filename, tutor?.contactDetail?.gender, tutor.id);
  };

  const renderClassItem = (item) => {
    return (
      <View>
        <View style={{ height: RfH(40) }} />
        <Text style={commonStyles.headingPrimaryText}>{item.orderItem?.offering.name}</Text>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
            {item.orderItem?.offering?.parentOffering?.parentOffering?.name}
            {' | '}
            {item.orderItem?.offering.parentOffering.name}
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
                iconImage={getTutorImage(item.orderItem?.tutor)}
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
                {item.orderItem?.tutor.contactDetail.firstName} {item.orderItem?.tutor.contactDetail.lastName}
              </Text>
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
                GURUS{item.orderItem?.tutor.id}
              </Text>
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
                {item.orderItem?.onlineClass ? 'Online' : 'Offline'} Individual Class
              </Text>
            </View>
          </View>
          <View style={commonStyles.verticallyCenterItemsView}>
            <Text
              style={[
                commonStyles.headingPrimaryText,
                { backgroundColor: Colors.lightBlue, padding: RfH(8), borderRadius: 8 },
              ]}>
              {item.orderItem?.count}
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
              {item.orderItem?.availableClasses} Unscheduled Classses
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
              onPress={() => setIsHistorySelected(false)}
              small
              block
              bordered
              style={isHistorySelected ? styles.inactiveLeftButton : styles.activeLeftButton}>
              <Text style={isHistorySelected ? styles.inactiveButtonText : styles.activeButtonText}>
                Unscheduled Classes
              </Text>
            </Button>
            <Button
              onPress={() => setIsHistorySelected(true)}
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
                <View style={{ height: RfH(40) }} />
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

export default bookingConfirmed;
