import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, FlatList } from 'react-native';
import { useLazyQuery } from '@apollo/client';
import { useIsFocused } from '@react-navigation/native';
import { Button } from 'native-base';
import { RFValue } from 'react-native-responsive-fontsize';
import Loader from '../../../components/Loader';
import commonStyles from '../../../theme/styles';
import { Colors, Fonts, Images } from '../../../theme';
import { getFullName, RfH, RfW } from '../../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { styles } from './styles';
import { SEARCH_ORDER_ITEMS } from '../../student/booking.query';
import TutorImageComponent from '../../../components/TutorImageComponent';

const StudentClassComponent = ({ student, subject }) => {
  const [isHistorySelected, setIsHistorySelected] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const isFoucsed = useIsFocused();
  const [orderList, setOrderList] = useState([]);
  const [searchOrderItems, { loading: loadingBookings }] = useLazyQuery(SEARCH_ORDER_ITEMS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
      setIsEmpty(true);
    },
    onCompleted: (data) => {
      if (data && data?.searchOrderItems && data?.searchOrderItems.edges.length > 0) {
        setIsEmpty(false);
        setOrderList(data?.searchOrderItems.edges);
      } else {
        setIsEmpty(true);
        setOrderList([]);
      }
    },
  });

  const onClicked = (isHistory) => {
    searchOrderItems({
      variables: {
        bookingSearchDto: {
          ownerId: student.user.id,
          offeringId: subject.id,
          showActive: true,
          showHistory: isHistory,
          showWithAvailableClasses: !isHistory,
          size: 100,
        },
      },
    });
    setIsHistorySelected(isHistory);
  };

  useEffect(() => {
    if (isFoucsed) {
      searchOrderItems({
        variables: {
          bookingSearchDto: {
            ownerId: student.user.id,
            offeringId: subject.id,
            showActive: true,
            showHistory: false,
            showWithAvailableClasses: !false,
            size: 100,
          },
        },
      });
      setIsHistorySelected(false);
    }
  }, [isFoucsed]);

  // use effect to track subject change
  useEffect(() => {
    setIsHistorySelected(false);
    setOrderList([]);
    setIsEmpty([]);
    searchOrderItems({
      variables: {
        bookingSearchDto: {
          ownerId: student.user.id,
          offeringId: subject.id,
          showActive: true,
          showHistory: false,
          showWithAvailableClasses: !false,
          size: 100,
        },
      },
    });
  }, [subject]);

  const renderClassItem = (item) => {
    return (
      <View style={{ marginTop: RfH(30) }}>
        <Text style={commonStyles.headingPrimaryText}>{item.offering.displayName}</Text>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
            {item.offering?.parentOffering?.parentOffering?.displayName}
            {' | '}
            {item.offering?.parentOffering?.displayName}
          </Text>
          {item.demo && <Text style={commonStyles.mediumPrimaryText}>Demo Class</Text>}
        </View>
        <View style={{ borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5, marginTop: RfH(8) }} />
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(8) }]}>
          <View style={commonStyles.horizontalChildrenStartView}>
            <View style={commonStyles.verticallyStretchedItemsView}>
              <TutorImageComponent
                tutor={item?.tutor}
                styling={{ borderRadius: RfH(32), width: RfH(64), height: RfH(64) }}
              />
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
                {item.onlineClass ? 'Online' : 'Home Tuition'} - Individual Class
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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          {!isHistorySelected && (
            <Text
              style={{
                fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
                textAlign: 'right',
                color: Colors.darkGrey,
              }}>
              {item.availableClasses} Unscheduled {item.availableClasses === 1 ? 'Class' : 'Classes'}
            </Text>
          )}
        </View>
        <View style={{ borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5 }} />
      </View>
    );
  };

  return (
    <>
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white }]}>
        <Loader isLoading={loadingBookings} />
        <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[1]} scrollEventThrottle={16}>
          <View>
            <View style={[commonStyles.horizontalChildrenCenterView]}>
              <Button
                onPress={() => onClicked(false)}
                small
                block
                bordered
                style={isHistorySelected ? styles.inactiveLeftButton : styles.activeLeftButton}>
                <Text style={isHistorySelected ? styles.inactiveButtonText : styles.activeButtonText}>
                  Unscheduled Classes
                </Text>
              </Button>
              <Button
                onPress={() => onClicked(true)}
                small
                block
                bordered
                style={isHistorySelected ? styles.activeRightButton : styles.inactiveRightButton}>
                <Text style={isHistorySelected ? styles.activeButtonText : styles.inactiveButtonText}>History</Text>
              </Button>
            </View>
          </View>
          {!isEmpty ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={orderList}
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
                Looks like Student haven't booked any class.
              </Text>
              <View style={{ height: RfH(40) }} />
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default StudentClassComponent;
