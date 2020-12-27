import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Button } from 'native-base';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SelectSubjectModal, TutorImageComponent } from '../../components';
import Loader from '../../components/Loader';
import { Colors, Fonts, Images } from '../../theme';
import commonStyles from '../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { RfH, RfW } from '../../utils/helpers';
import { SEARCH_ORDER_ITEMS } from '../student/booking.query';
import { OrderStatus } from '../student/enums';
import styles from './styles';
import { GET_TUTOR_OFFERINGS } from '../student/tutor-query';
import ClassModeSelectModal from '../student/tutorDetails/components/classModeSelectModal';
import NavigationRouteNames from '../../routes/screenNames';
import { userType } from '../../apollo/cache';
import { UserTypeEnum } from '../../common/userType.enum';

function MyClasses() {
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const userTypeVal = useReactiveVar(userType);
  const isStudent = userTypeVal === UserTypeEnum.STUDENT.label;

  const [isHistorySelected, setIsHistorySelected] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [renewClassObj, setRenewClassObj] = useState({});
  const [selectedSubject, setSelectedSubject] = useState({});
  const [openClassModal, setOpenClassModal] = useState(false);
  const [showAllSubjects, setShowAllSubjects] = useState(false);

  const [searchOrderItems, { loading: loadingBookings }] = useLazyQuery(SEARCH_ORDER_ITEMS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      setIsEmpty(true);
    },
    onCompleted: (data) => {
      if (data && data?.searchOrderItems && data?.searchOrderItems.edges.length > 0) {
        setIsEmpty(false);
        setOrderItems(data?.searchOrderItems.edges);
        setRefreshData(true);
      } else {
        setIsEmpty(true);
        setOrderItems([]);
        setRefreshData(true);
      }
    },
  });

  const [getTutorOffering, { loading: loadingTutorsOffering }] = useLazyQuery(GET_TUTOR_OFFERINGS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        // const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        const selectedOffering = data?.getTutorOfferings.find((sub) => sub.offering.id === renewClassObj.offering.id);
        if (selectedOffering) {
          setSelectedSubject({
            id: selectedOffering.offering.id,
            displayName: selectedOffering.offering.displayName,
            offeringId: selectedOffering.id,
            demoClass: selectedOffering.demoClass,
            freeDemo: selectedOffering.freeDemo,
            groupClass: selectedOffering.groupClass === 0 || selectedOffering.groupClass === 1,
            onlineClass: selectedOffering.onlineClass === 0 || selectedOffering.onlineClass === 1,
            individualClass: selectedOffering.groupClass === 0 || selectedOffering.groupClass === 2,
            homeTution: selectedOffering.onlineClass === 0 || selectedOffering.onlineClass === 2,
            budgetDetails: selectedOffering.budgets,
          });
          setOpenClassModal(true);
        }
      }
    },
  });

  useEffect(() => {
    if (isFocussed) {
      searchOrderItems({
        variables: {
          bookingSearchDto: {
            orderStatus: OrderStatus.COMPLETE.label,
            showHistory: isHistorySelected,
            showWithAvailableClasses: !isHistorySelected,
          },
        },
      });
    }
  }, [isFocussed]);

  const goToScheduleClasses = (item) => {
    navigation.navigate(NavigationRouteNames.STUDENT.SCHEDULE_CLASS, { classData: item });
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    setShowHeader(scrollPosition > 30);
  };

  const gotoTutors = (subject) => {
    setShowAllSubjects(false);
    navigation.navigate(NavigationRouteNames.STUDENT.TUTOR, { offering: subject });
  };

  const onClicked = (isHistory) => {
    searchOrderItems({
      variables: {
        bookingSearchDto: {
          orderStatus: OrderStatus.COMPLETE.label,
          showHistory: isHistory,
          showWithAvailableClasses: !isHistory,
        },
      },
    });
    setIsHistorySelected(isHistory);
  };
  const renewClass = (item) => {
    setRenewClassObj(item);
    getTutorOffering({
      variables: { tutorId: item.tutor.id },
    });
  };

  const tutorDetail = (item) => {
    navigation.navigate(NavigationRouteNames.STUDENT.TUTOR_DETAILS, {
      tutorId: item.tutor.id,
      parentOffering: item.offering?.parentOffering?.id,
      parentParentOffering: item.offering?.parentOffering?.parentOffering?.id,
      parentOfferingName: item.offering?.parentOffering?.displayName,
      parentParentOfferingName: item.offering?.parentOffering?.parentOffering?.displayName,
    });
  };

  const handleRightButton = (item) => {
    if (!isStudent) {
      goToScheduleClasses(item);
    } else if (isHistorySelected) {
      renewClass(item);
    } else {
      goToScheduleClasses(item);
    }
  };

  const rightButtonText = () => {
    if (!isStudent) {
      return 'View Details';
    }
    if (isHistorySelected) {
      return 'Renew Class';
    }
    return 'Schedule Class';
  };

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
          {!isHistorySelected && isStudent && (
            <TouchableOpacity activeOpacity={0.6} onPress={() => renewClass(item)}>
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.brandBlue2 }}>Renew Class</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={{ borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5, marginTop: RfH(8) }} />
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(8) }]}>
          <TouchableOpacity
            style={commonStyles.horizontalChildrenStartView}
            onPress={() => tutorDetail(item)}
            activeOpacity={0.8}
            disabled={!isStudent}>
            <View style={commonStyles.verticallyStretchedItemsView}>
              <TutorImageComponent
                tutor={isStudent ? item?.tutor : { contactDetail: item?.createdBy }}
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
                {isStudent
                  ? `${item.tutor.contactDetail.firstName} ${item.tutor.contactDetail.lastName}`
                  : `${item?.createdBy.firstName} ${item?.createdBy.lastName}`}
              </Text>
              {isStudent && (
                <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
                  T{item.tutor.id}
                </Text>
              )}
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
                {item.onlineClass ? 'Online' : 'Offline'} - Individual Class
              </Text>
            </View>
          </TouchableOpacity>
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
            justifyContent: isHistorySelected ? (isStudent ? 'space-between' : 'flex-end') : 'flex-end',
            alignItems: 'center',
          }}>
          {isHistorySelected && isStudent && (
            <TouchableOpacity activeOpacity={0.6} onPress={() => goToScheduleClasses(item)}>
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.brandBlue2 }}>
                View Details
              </Text>
            </TouchableOpacity>
          )}
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
          <Button
            onPress={() => handleRightButton(item)}
            style={[
              commonStyles.buttonPrimary,
              {
                alignSelf: 'flex-end',
                marginRight: RfH(0),
                marginLeft: RfW(16),
              },
            ]}>
            <Text style={commonStyles.textButtonPrimary}>{rightButtonText()}</Text>
          </Button>
        </View>
        <View style={{ borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5 }} />
      </View>
    );
  };

  return (
    <>
      <Loader isLoading={loadingTutorsOffering || loadingBookings} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white }]}>
        <View style={{ height: RfH(44), alignItems: 'center', justifyContent: 'center' }}>
          {showHeader && <Text style={[commonStyles.headingPrimaryText, { alignSelf: 'center' }]}>My Classes</Text>}
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={(event) => handleScroll(event)}
          stickyHeaderIndices={[1]}
          scrollEventThrottle={16}
          scrollEnabled={!isEmpty && orderItems.length > 2}>
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

          <View>
            {!isEmpty ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={orderItems}
                renderItem={({ item }) => renderClassItem(item)}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: RfH(170) }}
                extraData={refreshData}
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
                  {isStudent
                    ? "Looks like you haven't booked any class."
                    : "Looks like you don't have any booked classes."}
                </Text>
                <View style={{ height: RfH(40) }} />
                {isStudent && (
                  <Button
                    block
                    style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}
                    onPress={() => setShowAllSubjects(true)}>
                    <Text style={commonStyles.textButtonPrimary}>Book Now</Text>
                  </Button>
                )}
              </View>
            )}
          </View>
        </ScrollView>
        {openClassModal && (
          <ClassModeSelectModal
            visible={openClassModal}
            onClose={() => setOpenClassModal(false)}
            selectedSubject={selectedSubject}
            isDemoClass={false}
            isRenewal
          />
        )}

        <SelectSubjectModal
          onClose={() => setShowAllSubjects(false)}
          onSelectSubject={gotoTutors}
          visible={showAllSubjects}
        />
      </View>
    </>
  );
}

export default MyClasses;
