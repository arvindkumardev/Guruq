import { useMutation } from '@apollo/react-hooks';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import moment from 'moment';
import { Button, Textarea } from 'native-base';
import {
  ActionSheet,
  CustomRadioButton,
  IconButtonWrapper,
  Loader,
  ScreenHeader,
  TutorImageComponent,
} from '../../../components';
import { Colors, Fonts, Images } from '../../../theme';
import commonStyles from '../../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { alertBox, getFullName, RfH, RfW } from '../../../utils/helpers';
import { GET_SCHEDULED_CLASSES } from '../booking.query';
import { userType } from '../../../apollo/cache';
import NavigationRouteNames from '../../../routes/screenNames';
import { UserTypeEnum } from '../../../common/userType.enum';
import { CANCEL_ORDER_ITEMS } from '../booking.mutation';

function OrderDetails(props) {
  const navigation = useNavigation();
  const { route } = props;
  const orderData = route?.params?.orderData;
  const [openMenu, setOpenMenu] = useState(false);
  const [tutorClasses, setTutorClasses] = useState([]);
  const [showCancelReason, setShowCancelReason] = useState(false);
  const [cancelReasons, setCancelReasons] = useState([
    { reason: 'I am unavailable to take classes at this moment.', selected: true },
    { reason: 'I want to replace the tutor with other.', selected: false },
    { reason: 'I did not find tutor reliable.', selected: false },
    { reason: 'I am unsatisfied with the quality of tutor.', selected: false },
    { reason: 'Others', selected: false },
  ]);

  const [cancelReason, setCancelReason] = useState('');
  const [reasons, setReasons] = useState([...cancelReasons]);
  const [comment, setComment] = useState('');
  const [refresh, setRefresh] = useState(false);

  const userTypeVal = useReactiveVar(userType);
  const isStudent = userTypeVal === UserTypeEnum.STUDENT.label;

  const [getScheduledClasses, { loading: loadingScheduledClasses }] = useLazyQuery(GET_SCHEDULED_CLASSES, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data && data.getScheduledClasses) {
        const scheduledClasses = data.getScheduledClasses.map((item) => ({
          startDate: item.startDate,
          classId: item.id,
        }));
        const classes = tutorClasses;
        for (let i = 0; i < scheduledClasses.length; i++) {
          classes[i] = { ...scheduledClasses[i], isScheduled: true };
        }
        setTutorClasses(classes);
        setRefresh(!refresh);
      }
    },
  });

  const getScheduleClassCall = () => {
    getScheduledClasses({
      variables: {
        classesSearchDto: {
          orderItemId: orderData.id,
        },
      },
    });
  };

  const openCancelReasonModal = () => {
    setOpenMenu(false);
    setShowCancelReason(true);
  };

  const openCancelConfirm = () => {
    alertBox('Do you really want to cancel the order?', '', {
      positiveText: 'YES',
      onPositiveClick: () => {
        openCancelReasonModal();
      },
      negativeText: 'No',
      onNegativeClick: () => {
        setOpenMenu(false);
      },
    });
  };

  const goToCustomerCare = () => {
    setOpenMenu(false);
    navigation.navigate(NavigationRouteNames.CUSTOMER_CARE);
  };

  const goToRefund = () => {
    setOpenMenu(false);
    navigation.navigate(NavigationRouteNames.STUDENT.REFUND, { bookingData: orderData });
  };

  const [menuItem, setMenuItem] = useState([
    { label: 'Cancel Order', handler: openCancelConfirm, isEnabled: true },
    { label: 'Refund', handler: goToRefund, isEnabled: true },
    { label: 'Help', handler: goToCustomerCare, isEnabled: true },
  ]);

  useEffect(() => {
    if (orderData) {
      const classes = [];
      for (let i = 0; i < orderData.count; i++) {
        classes.push({ startDate: '', isScheduled: false, classId: '' });
      }
      setTutorClasses(classes);
      getScheduleClassCall();
    }
  }, [orderData]);

  const onReasonChange = (index) => {
    if (!reasons[index].selected) {
      setReasons((reasons) =>
        reasons.map((reasonItem, reasonIndex) => ({ ...reasonItem, selected: reasonIndex === index }))
      );
      setCancelReason(reasons[index].selected ? '' : reasons[index].reason);
    }
  };

  const [cancelOrderItem, { loading: cancelLoading }] = useMutation(CANCEL_ORDER_ITEMS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        // const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        alertBox('Class cancelled successfully', '', {
          positiveText: 'Ok',
          onPositiveClick: () => {
            setShowCancelReason(false);
            navigation.navigate(NavigationRouteNames.STUDENT.BOOKING_DETAILS);
          },
        });
      }
    },
  });

  const onCancelBooking = () => {
    cancelOrderItem({
      variables: {
        orderItemId: orderData?.id,
      },
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

  const renderReasons = (item, index) => {
    return (
      <TouchableWithoutFeedback onPress={() => onReasonChange(index)}>
        <View style={{ padding: RfH(16) }}>
          <View style={commonStyles.horizontalChildrenView}>
            <CustomRadioButton enabled={item.selected} submitFunction={() => onReasonChange(index)} />
            <Text style={{ marginLeft: RfW(8) }}>{item.reason}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderTutorDetails = () => (
    <View>
      <View style={{ height: RfH(30) }} />
      <Text style={commonStyles.headingPrimaryText}>{orderData?.offering?.name} Class</Text>
      <View style={commonStyles.horizontalChildrenSpaceView}>
        <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
          {orderData?.offering?.parentOffering?.parentOffering?.name} | {orderData?.offering?.parentOffering?.name}
        </Text>
      </View>
      <View style={{ borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5, marginTop: RfH(8) }} />
      <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(20) }]}>
        <TouchableOpacity
          style={commonStyles.horizontalChildrenStartView}
          onPress={() => tutorDetail(orderData)}
          disabled={!isStudent}>
          <View style={commonStyles.verticallyStretchedItemsView}>
            <TutorImageComponent
              tutor={isStudent ? orderData?.tutor : { contactDetail: orderData?.createdBy }}
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
              {isStudent ? `${getFullName(orderData?.tutor?.contactDetail)}` : `${getFullName(orderData?.createdBy)}`}
            </Text>
            {isStudent && (
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
                T-{orderData?.tutor.id}
              </Text>
            )}
            <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
              {orderData?.onlineClass ? 'Online' : 'Offline'} Classes
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderClassView = (item, index) => (
    <View style={{ flex: 0.5, marginTop: RfH(16) }}>
      <View
        style={{
          marginRight: RfW(8),
          marginLeft: RfW(8),
          backgroundColor: !item.isScheduled ? Colors.lightBlue : Colors.lightGrey,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: RfH(10),
          borderRadius: 8,
          paddingHorizontal: RfW(8),
          flexDirection: 'row',
        }}>
        <Text style={[commonStyles.headingPrimaryText, { color: Colors.darkGrey }]}>Class {index + 1}</Text>
        {!item.isScheduled && (
          <IconButtonWrapper iconHeight={RfH(20)} iconWidth={RfH(24)} iconImage={Images.calendar} />
        )}
        {item.isScheduled && (
          <View style={{ alignSelf: 'center' }}>
            <Text
              style={{
                fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
                color: Colors.darkGrey,
              }}>
              {moment(item.startDate).format('DD-MMM-YYYY')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <Loader isLoading={loadingScheduledClasses || cancelLoading} />
      <ScreenHeader
        label="Order Details"
        homeIcon
        horizontalPadding={RfW(16)}
        showRightIcon
        rightIcon={Images.vertical_dots_b}
        onRightIconClick={() => setOpenMenu(true)}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: Colors.white, paddingHorizontal: RfW(16) }}>
          {renderTutorDetails()}
          <View style={{ height: RfH(32) }} />
        </View>
        <View style={{ height: RfH(56), backgroundColor: Colors.lightGrey, padding: RfH(16) }}>
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>Summary</Text>
        </View>
        <View style={{ paddingHorizontal: RfH(20), paddingTop: RfH(16), backgroundColor: Colors.white }}>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={commonStyles.mediumMutedText}>No. of Classes</Text>
            <Text style={[commonStyles.mediumMutedText, { fontFamily: Fonts.semiBold }]}>{orderData.count}</Text>
          </View>
          {/* <View style={commonStyles.horizontalChildrenSpaceView}> */}
          {/*  <Text style={commonStyles.mediumMutedText}>Classes Conducted</Text> */}
          {/*  <Text style={[commonStyles.mediumMutedText, { fontFamily: Fonts.semiBold }]}>{orderData.count}</Text> */}
          {/* </View> */}
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={commonStyles.mediumMutedText}>Classes Scheduled</Text>
            <Text style={[commonStyles.mediumMutedText, { fontFamily: Fonts.semiBold }]}>
              {orderData.count - orderData.availableClasses}
            </Text>
          </View>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={commonStyles.mediumMutedText}>Classes Remaining</Text>
            <Text style={[commonStyles.mediumMutedText, { fontFamily: Fonts.semiBold }]}>
              {orderData.availableClasses}
            </Text>
          </View>
        </View>
        <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white }]}>
          <View style={[commonStyles.lineSeparatorWithVerticalMargin, { flex: 0 }]} />
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>Classes</Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={tutorClasses}
            numColumns={2}
            renderItem={({ item, index }) => renderClassView(item, index)}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: RfH(34) }}
            scrollEnabled={tutorClasses.length > 6}
            extraData={refresh}
          />
        </View>
      </ScrollView>

      <Button
        onPress={() => navigation.navigate(NavigationRouteNames.STUDENT.SCHEDULE_CLASS, { classData: orderData })}
        style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginVertical: RfH(30) }]}>
        <Text style={commonStyles.textButtonPrimary}>Schedule Class</Text>
      </Button>
      <ActionSheet
        actions={menuItem}
        cancelText="Dismiss"
        handleCancel={() => setOpenMenu(false)}
        isVisible={openMenu}
        topLabel=""
      />
      <Modal
        animationType="fade"
        transparent
        visible={showCancelReason}
        onRequestClose={() => {
          setShowCancelReason(false);
        }}>
        <View style={{ flex: 1, backgroundColor: Colors.black, opacity: 0.5, flexDirection: 'column' }} />
        <View
          style={{
            bottom: 0,
            left: 0,
            right: 0,
            position: 'absolute',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            backgroundColor: Colors.white,
            opacity: 1,
            paddingBottom: RfH(34),
            paddingTop: RfH(16),
          }}>
          <IconButtonWrapper
            styling={{ alignSelf: 'flex-end' }}
            containerStyling={{ paddingHorizontal: RfW(16) }}
            iconHeight={RfH(20)}
            iconWidth={RfW(20)}
            iconImage={Images.cross}
            submitFunction={() => setShowCancelReason(false)}
            imageResizeMode="contain"
          />
          <FlatList
            showsVerticalScrollIndicator={false}
            data={reasons}
            renderItem={({ item, index }) => renderReasons(item, index)}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
          {cancelReason === 'Others' && (
            <View
              style={{
                marginHorizontal: RfW(16),
                borderRadius: RfH(8),
                borderColor: Colors.darkGrey,
                borderWidth: 1,
              }}>
              <Textarea
                value={comment}
                onChangeText={(text) => setComment(text)}
                placeholder="Please specify reason"
                numberOfLines={6}
                style={{ height: RfH(120) }}
              />
            </View>
          )}
          <View style={{ height: RfH(24) }} />
          <Button onPress={onCancelBooking} style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
            <Text style={commonStyles.textButtonPrimary}>Submit</Text>
          </Button>
        </View>
      </Modal>
    </View>
  );
}

export default OrderDetails;
