import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useLazyQuery } from '@apollo/client';
import moment from 'moment';
import { Button } from 'native-base';
import { isEmpty } from 'lodash';
import { ActionSheet, Loader, ScreenHeader, TutorImageComponent } from '../../../components';
import { Colors, Fonts, Images } from '../../../theme';
import commonStyles from '../../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { getFullName, RfH, RfW } from '../../../utils/helpers';
import { GET_CANCELLATION_SUMMARY, GET_SCHEDULED_CLASSES } from '../booking.query';
import NavigationRouteNames from '../../../routes/screenNames';
import { OrderStatusEnum } from '../../../components/PaymentMethodModal/paymentMethod.enum';

function OrderDetails(props) {
  const { route } = props;
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const orderData = route?.params?.orderData;
  const [openMenu, setOpenMenu] = useState(false);
  const [tutorClasses, setTutorClasses] = useState([]);
  const [cancelSummary, setCancelSummary] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [menuItem, setMenuItem] = useState([]);

  const [getCancellationSummary, { loading: cancellationSummaryLoading }] = useLazyQuery(GET_CANCELLATION_SUMMARY, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        setCancelSummary(data.cancelOrderItemSummary);
      }
    },
  });

  const [getScheduledClasses, { loading: loadingScheduledClasses }] = useLazyQuery(GET_SCHEDULED_CLASSES, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data && data.getScheduledClasses) {
        const scheduledClasses = data.getScheduledClasses.map((item) => ({
          startDate: item.startDate,
          classId: item.id,
          uuid: item.uuid,
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

  const openCancelConfirm = () => {
    setOpenMenu(false);
    navigation.navigate(NavigationRouteNames.STUDENT.REFUND, {
      orderData,
      cancelSummary,
    });
  };

  const goToCustomerCare = () => {
    setOpenMenu(false);
    navigation.navigate(NavigationRouteNames.CUSTOMER_CARE);
  };

  useEffect(() => {
    if (!isEmpty(cancelSummary)) {
      setMenuItem([
        {
          label: 'Cancel Booking',
          handler: openCancelConfirm,
          isEnabled: true,
        },
        { label: 'Help', handler: goToCustomerCare, isEnabled: true },
      ]);
    }
  }, [cancelSummary]);

  useEffect(() => {
    if (orderData && isFocussed) {
      const classes = [];
      for (let i = 0; i < orderData.count; i++) {
        classes.push({ startDate: '', isScheduled: false, classId: '' });
      }
      setTutorClasses(classes);
      getScheduledClasses({
        variables: {
          classesSearchDto: {
            orderItemId: orderData.id,
          },
        },
      });
      getCancellationSummary({ variables: { orderItemId: orderData.id } });
    }
  }, [orderData, isFocussed]);

  const tutorDetail = (item) => {
    navigation.navigate(NavigationRouteNames.STUDENT.TUTOR_DETAILS, {
      tutorId: item.tutor.id,
      currentOffering: item?.offering,
      parentOffering: item.offering?.parentOffering?.id,
      parentParentOffering: item.offering?.parentOffering?.parentOffering?.id,
      parentOfferingName: item.offering?.parentOffering?.displayName,
      parentParentOfferingName: item.offering?.parentOffering?.parentOffering?.displayName,
    });
  };

  const renderTutorDetails = () => (
    <View>
      <View style={{ height: RfH(30) }} />
      <Text style={commonStyles.headingPrimaryText}>{orderData?.offering?.displayName} Class</Text>
      <View style={commonStyles.horizontalChildrenSpaceView}>
        <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
          {orderData?.offering?.parentOffering?.parentOffering?.displayName} |{' '}
          {orderData?.offering?.parentOffering?.displayName}
        </Text>
      </View>
      <View style={{ borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5, marginTop: RfH(8) }} />
      <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(20) }]}>
        <TouchableOpacity style={commonStyles.horizontalChildrenStartView} onPress={() => tutorDetail(orderData)}>
          <View style={commonStyles.verticallyStretchedItemsView}>
            <TutorImageComponent
              tutor={orderData?.tutor}
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
              {getFullName(orderData?.tutor?.contactDetail)}
            </Text>
            <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
              T-{orderData?.tutor.id}
            </Text>
            <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
              {orderData?.onlineClass ? 'Online Classes' : 'Home Tuition'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderClassView = (item, index) => (
    <View style={{ flex: 0.5, marginTop: RfH(16) }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          item.isScheduled ? navigation.navigate(NavigationRouteNames.SCHEDULED_CLASS_DETAILS, { uuid: item.uuid }) : {}
        }
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
        {/* {!item.isScheduled && ( */}
        {/*  <IconButtonWrapper iconHeight={RfH(20)} iconWidth={RfH(24)} iconImage={Images.calendar} /> */}
        {/* )} */}
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
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <Loader isLoading={loadingScheduledClasses || cancellationSummaryLoading} />
      <ScreenHeader
        label="Booking Details"
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
          <View style={[commonStyles.horizontalChildrenSpaceView, { marginBottom: RfH(4) }]}>
            <Text style={commonStyles.mediumMutedText}>No. of Classes</Text>
            <Text style={[commonStyles.mediumMutedText, { fontFamily: Fonts.semiBold }]}>{cancelSummary.total}</Text>
          </View>
          <View style={[commonStyles.horizontalChildrenSpaceView, { marginBottom: RfH(4) }]}>
            <Text style={commonStyles.mediumMutedText}>Classes Taken</Text>
            <Text style={[commonStyles.mediumMutedText, { fontFamily: Fonts.semiBold }]}>{cancelSummary.taken}</Text>
          </View>
          <View style={[commonStyles.horizontalChildrenSpaceView, { marginBottom: RfH(4) }]}>
            <Text style={commonStyles.mediumMutedText}>Classes Scheduled</Text>
            <Text style={[commonStyles.mediumMutedText, { fontFamily: Fonts.semiBold }]}>
              {cancelSummary.scheduled}
            </Text>
          </View>
          <View style={[commonStyles.horizontalChildrenSpaceView, { marginBottom: RfH(4) }]}>
            <Text style={commonStyles.mediumMutedText}>Classes UnScheduled</Text>
            <Text style={[commonStyles.mediumMutedText, { fontFamily: Fonts.semiBold }]}>
              {cancelSummary.unscheduled}
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

      {cancelSummary.unscheduled > 0 && orderData.orderStatus === OrderStatusEnum.COMPLETE.label && (
        <Button
          onPress={() => navigation.navigate(NavigationRouteNames.SCHEDULE_CLASS, { classData: orderData })}
          style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginVertical: RfH(30) }]}>
          <Text style={commonStyles.textButtonPrimary}>Schedule Class</Text>
        </Button>
      )}
      <ActionSheet
        actions={menuItem}
        cancelText="Dismiss"
        handleCancel={() => setOpenMenu(false)}
        isVisible={openMenu}
        topLabel=""
      />
    </View>
  );
}

export default OrderDetails;
