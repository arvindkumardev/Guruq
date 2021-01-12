import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { useLazyQuery } from '@apollo/client';
import { isEmpty } from 'lodash';
import { Loader, ScreenHeader, TutorImageComponent } from '../../../components';
import commonStyles from '../../../theme/styles';
import { Colors, Fonts, Images } from '../../../theme';
import {enumLabelToText, getFullName, getToken, printCurrency, printDateTime, RfH, RfW} from '../../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { tutorDetails } from '../../../apollo/cache';
import routeNames from '../../../routes/screenNames';
import ActionSheet from '../../../components/ActionSheet';
import { GET_BOOKING_DETAIL } from '../booking.query';

function BookingDetails(props) {
  const { route } = props;
  const bookingId = route?.params?.bookingId;
  const navigation = useNavigation();
  const [openMenu, setOpenMenu] = useState(false);
  const [token, setToken] = useState('');
  const [bookingData, setBookingData] = useState({});

  const [getBooking, { loading: getBookingLoader }] = useLazyQuery(GET_BOOKING_DETAIL, {
    fetchPolicy: 'no-cache',
    variables: { id: bookingId },
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setBookingData(data?.getBookingDetails);
      }
    },
  });

  useEffect(() => {
    getToken().then((tk) => {
      setToken(tk);
    });
    getBooking();
  }, []);

  const renderClassItem = (item) => (
    <View style={{ marginTop: RfH(30), paddingHorizontal: RfW(16) }}>
      <Text style={commonStyles.headingPrimaryText}>{item.offering.name} Class</Text>
      <View style={commonStyles.horizontalChildrenSpaceView}>
        <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
          {item.offering?.parentOffering?.parentOffering?.name}
          {' | '}
          {item.offering?.parentOffering?.name}
        </Text>
        {isEmpty(item.refund) && (
          <TouchableOpacity
            onPress={() => navigation.navigate(routeNames.STUDENT.ORDER_DETAILS, { orderData: item })}
            activeOpacity={0.8}>
            <Text style={[commonStyles.smallPrimaryText, { color: Colors.brandBlue2, fontFamily: Fonts.semiBold }]}>
              View Details
            </Text>
          </TouchableOpacity>
        )}
        {!isEmpty(item.refund) && (
          <View>
            <Text style={[commonStyles.smallPrimaryText, { color: Colors.orangeRed, fontFamily: Fonts.semiBold }]}>
              Refund Detail
            </Text>
          </View>
        )}
      </View>
      <View style={{ borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5, marginTop: RfH(8) }} />
      <View style={[commonStyles.horizontalChildrenSpaceView, { marginVertical: RfH(8) }]}>
        <TouchableOpacity
          style={commonStyles.horizontalChildrenStartView}
          onPress={() => tutorDetails(item)}
          activeOpacity={0.8}>
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
              {getFullName(item?.tutor?.contactDetail)}
            </Text>
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
    </View>
  );

  const goToCustomerCare = () => {
    setOpenMenu(false);
    navigation.navigate(routeNames.CUSTOMER_CARE);
  };

  // const goToRefund = () => {
  //   navigation.navigate(routeNames.STUDENT.REFUND, { bookingData });
  // };

  const goToInvoice = () => {
    setOpenMenu(false);
    navigation.navigate(routeNames.WEB_VIEW, {
      url: `http://dashboardv2.guruq.in/invoice/${bookingData?.id}?token=${token}`,
      label: 'Invoice',
    });
  };

  const [menuItem, setMenuItem] = useState([
    // { label: 'Generate Invoice', handler: goToInvoice, isEnabled: true },
    { label: 'Help', handler: goToCustomerCare, isEnabled: true },
  ]);

  return (
    <>
      <Loader isLoading={getBookingLoader} />
      <View style={(commonStyles.mainContainer, { flex: 1, backgroundColor: Colors.white })}>
        <ScreenHeader
          label="Booking details"
          homeIcon
          horizontalPadding={RfW(16)}
          showRightIcon
          rightIcon={Images.vertical_dots_b}
          onRightIconClick={() => setOpenMenu(true)}
        />
        {!isEmpty(bookingData) && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ height: RfH(20) }} />
            <View
              style={{
                marginHorizontal: RfW(16),
                borderWidth: RfW(2),
                borderRadius: RfH(8),
                borderColor: Colors.lightGrey,
                paddingVertical: RfH(16),
                paddingHorizontal: RfW(16),
              }}>
              <View style={commonStyles.horizontalChildrenSpaceView}>
                <Text style={[commonStyles.regularPrimaryText, { flex: 0.5, fontFamily: Fonts.semiBold }]}>
                  Booking ID
                </Text>
                <Text style={[commonStyles.regularPrimaryText, { flex: 0.5, fontFamily: Fonts.semiBold }]}>
                  {bookingData.orderId}
                </Text>
              </View>
              <View style={commonStyles.horizontalChildrenSpaceView}>
                <Text style={[commonStyles.regularPrimaryText, { flex: 0.5, fontFamily: Fonts.semiBold }]}>
                  Booking Date
                </Text>
                <Text style={[commonStyles.regularPrimaryText, { flex: 0.5, fontFamily: Fonts.semiBold }]}>
                  {printDateTime(bookingData.createdDate)}
                </Text>
              </View>
              <View style={commonStyles.horizontalChildrenSpaceView}>
                <Text style={[commonStyles.regularPrimaryText, { flex: 0.5, fontFamily: Fonts.semiBold }]}>
                  Payment Mode
                </Text>
                <Text style={[commonStyles.regularPrimaryText, { flex: 0.5, fontFamily: Fonts.semiBold }]}>
                  {enumLabelToText(bookingData.orderPayment.paymentMethod)}
                </Text>
              </View>
              <View style={commonStyles.horizontalChildrenSpaceView}>
                <Text style={[commonStyles.regularPrimaryText, { flex: 0.5, fontFamily: Fonts.semiBold }]}>Amount</Text>
                <Text style={[commonStyles.regularPrimaryText, { flex: 0.5, fontFamily: Fonts.semiBold }]}>
                  ₹ {printCurrency(bookingData.payableAmount)}
                </Text>
              </View>
            </View>
            <View style={{ height: RfH(10) }} />
            <FlatList
              showsVerticalScrollIndicator={false}
              data={bookingData?.orderItems}
              renderItem={({ item, index }) => renderClassItem(item, index)}
              keyExtractor={(item, index) => index.toString()}
            />
            <View style={[commonStyles.lineSeparator, { flex: 0 }]} />
            <View style={{ height: RfH(24) }} />
            <View
              style={{
                marginHorizontal: RfW(16),
                borderWidth: 1,
                borderRadius: 8,
                borderColor: Colors.lightGrey,
                marginBottom: RfH(40),
              }}>
              <Text style={{ paddingHorizontal: RfW(8), paddingVertical: RfH(12) }}>Payment details</Text>
              <View style={[commonStyles.lineSeparator, { flex: 0 }]} />
              <View style={{ height: RfH(16) }} />
              <View style={{ paddingHorizontal: RfW(8) }}>
                <View style={commonStyles.horizontalChildrenSpaceView}>
                  <Text style={commonStyles.mediumMutedText}>Amount</Text>
                  <Text style={[commonStyles.mediumMutedText, { fontFamily: Fonts.semiBold }]}>
                    ₹{printCurrency(bookingData.subTotal)}
                  </Text>
                </View>
                <View style={commonStyles.horizontalChildrenSpaceView}>
                  <Text style={commonStyles.mediumMutedText}>Convenience charges</Text>
                  <Text style={[commonStyles.mediumMutedText, { fontFamily: Fonts.semiBold }]}>
                    ₹{bookingData.convenienceCharges ? parseFloat(bookingData.convenienceCharges).toFixed(2) : '0.00'}
                  </Text>
                </View>
              </View>
              <View style={{ height: RfH(16) }} />
              <View style={[commonStyles.lineSeparator, { flex: 0 }]} />
              <View style={{ paddingHorizontal: RfW(8) }}>
                <View style={{ height: RfH(16) }} />
                <View style={commonStyles.horizontalChildrenSpaceView}>
                  <Text style={commonStyles.mediumMutedText}>Paid by Q points</Text>
                  <Text style={[commonStyles.mediumMutedText, { fontFamily: Fonts.semiBold }]}>
                    ₹{bookingData.pointsRedeemed ? parseFloat(bookingData.pointsRedeemed).toFixed(2) : '0.00'}
                  </Text>
                </View>
                {/* {bookingData?.promotion?.code && ( */}
                {/*  <View style={commonStyles.horizontalChildrenSpaceView}> */}
                {/*    <Text style={commonStyles.mediumMutedText}>{bookingData?.promotion?.code} Applied</Text> */}
                {/*    <Text style={[commonStyles.mediumMutedText, { fontFamily: Fonts.semiBold }]}>₹200</Text> */}
                {/*  </View> */}
                {/* )} */}
                <View style={{ height: RfH(16) }} />
              </View>
              <View style={[commonStyles.lineSeparator, { flex: 0 }]} />
              <View style={{ height: RfH(16) }} />
              <View
                style={[commonStyles.horizontalChildrenSpaceView, { paddingHorizontal: RfW(8), marginBottom: RfH(8) }]}>
                <Text style={[commonStyles.mediumPrimaryText, { fontFamily: Fonts.bold }]}>Total amount paid</Text>
                <Text style={[commonStyles.mediumPrimaryText, { fontFamily: Fonts.bold }]}>
                  ₹{bookingData?.payableAmount ? parseFloat(bookingData?.payableAmount).toFixed(2) : '0.00'}
                </Text>
              </View>
            </View>
          </ScrollView>
        )}
        <ActionSheet
          actions={menuItem}
          cancelText="Dismiss"
          handleCancel={() => setOpenMenu(false)}
          isVisible={openMenu}
          topLabel=""
        />
      </View>
    </>
  );
}

export default BookingDetails;
