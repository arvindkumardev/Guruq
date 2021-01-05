import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button, Textarea } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import {
  CustomRadioButton,
  IconButtonWrapper,
  Loader,
  ScreenHeader,
  TutorImageComponent,
} from '../../../../components';
import commonStyles from '../../../../theme/styles';
import { Colors, Fonts, Images } from '../../../../theme';
import { alertBox, getFullName, getToken, RfH, RfW } from '../../../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../../../utils/constants';
import { tutorDetails } from '../../../../apollo/cache';
import routeNames from '../../../../routes/screenNames';
import { CANCEL_BOOKINGS } from '../../booking.mutation';
import ActionSheet from '../../../../components/ActionSheet';

function BookingDetails(props) {
  const { route } = props;
  const bookingData = route?.params?.bookingData;
  const navigation = useNavigation();
  const [openMenu, setOpenMenu] = useState(false);
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
  const [token, setToken] = useState('');

  useEffect(() => {
    getToken().then((tk) => {
      setToken(tk);
    });
  }, []);
  const renderClassItem = (item) => {
    return (
      <View style={{ marginTop: RfH(30), paddingHorizontal: RfW(16) }}>
        <Text style={commonStyles.headingPrimaryText}>{item.offering.name} Class</Text>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
            {item.offering?.parentOffering?.parentOffering?.name}
            {' | '}
            {item.offering?.parentOffering?.name}
          </Text>
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
  };

  const openCancelReasonModal = () => {
    setOpenMenu(false);
    setShowCancelReason(true);
  };

  const openCancelConfirm = () => {
    Alert.alert(
      'Do you want to cancel your class?',
      '',
      [
        {
          text: 'NO',
          style: 'cancel',
          onPress: () => setOpenMenu(false),
        },
        {
          text: 'YES',
          onPress: () => openCancelReasonModal(),
        },
      ],
      { cancelable: false }
    );
  };

  const goToCustomerCare = () => {
    setOpenMenu(false);
    navigation.navigate(routeNames.CUSTOMER_CARE);
  };

  const [cancelBooking, { loading: cancelLoading }] = useMutation(CANCEL_BOOKINGS, {
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
            navigation.navigate(routeNames.STUDENT.BOOKING_DETAILS);
          },
        });
      }
    },
  });

  const onReasonChange = (index) => {
    if (!reasons[index].selected) {
      setReasons((reasons) =>
        reasons.map((reasonItem, reasonIndex) => ({ ...reasonItem, selected: reasonIndex === index }))
      );
      setCancelReason(reasons[index].selected ? '' : reasons[index].reason);
    }
  };

  const onCancelBooking = () => {
    // if (isEmpty(cancelReason)) {
    //   alertBox('Please provide the cancellation reason');
    // } else {
    cancelBooking({
      variables: {
        orderId: bookingData?.id,
      },
    });
    // }
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

  const goToRefund = () => {
    navigation.navigate(routeNames.STUDENT.REFUND, { bookingData });
  };

  const goToInvoice = () => {
    setOpenMenu(false);
    navigation.navigate(routeNames.WEB_VIEW, {
      url: `http://dashboardv2.guruq.in/invoice/${bookingData?.id}?token=${token}`,
      label: 'Invoice',
    });
  };

  const [menuItem, setMenuItem] = useState([
    { label: 'Cancel order', handler: openCancelConfirm, isEnabled: true },
    { label: 'Generate Invoice', handler: goToInvoice, isEnabled: true },
    { label: 'Help', handler: goToCustomerCare, isEnabled: true },
  ]);

  return (
    <View style={(commonStyles.mainContainer, { flex: 1, backgroundColor: Colors.white })}>
      <Loader isLoading={cancelLoading} />
      <ScreenHeader
        label="View booking details"
        homeIcon
        horizontalPadding={RfW(16)}
        showRightIcon
        rightIcon={Images.vertical_dots_b}
        onRightIconClick={() => setOpenMenu(true)}
      />
      <ScrollView>
        <View style={{ height: RfH(20) }} />
        <View
          style={{
            marginHorizontal: RfW(16),
            borderWidth: 1,
            borderRadius: 8,
            borderColor: Colors.darkGrey,
            paddingVertical: RfH(16),
            paddingHorizontal: RfW(16),
          }}>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={[commonStyles.regularPrimaryText, { flex: 0.5, fontFamily: Fonts.semiBold }]}>Booking Id</Text>
            <Text style={[commonStyles.regularPrimaryText, { flex: 0.5, fontFamily: Fonts.semiBold }]}>
              {bookingData.id}
            </Text>
          </View>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={[commonStyles.regularPrimaryText, { flex: 0.5, fontFamily: Fonts.semiBold }]}>
              Booking date
            </Text>
            <Text style={[commonStyles.regularPrimaryText, { flex: 0.5, fontFamily: Fonts.semiBold }]}>
              {new Date(bookingData.createdDate).toDateString()}
            </Text>
          </View>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={[commonStyles.regularPrimaryText, { flex: 0.5, fontFamily: Fonts.semiBold }]}>Amount</Text>
            <Text style={[commonStyles.regularPrimaryText, { flex: 0.5, fontFamily: Fonts.semiBold }]}>
              ₹ {parseFloat(bookingData.payableAmount).toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={{ height: RfH(10) }} />
        {/* <TouchableWithoutFeedback onPress={() => goToRefund()}> */}
        {/*  <View */}
        {/*    style={{ */}
        {/*      marginHorizontal: RfW(16), */}
        {/*      borderWidth: 1, */}
        {/*      borderRadius: 8, */}
        {/*      borderColor: Colors.lightGrey, */}
        {/*      paddingVertical: RfH(16), */}
        {/*      paddingHorizontal: RfW(16), */}
        {/*    }}> */}
        {/*    <Text style={{ color: Colors.brandBlue2 }}>View Refund Details</Text> */}
        {/*  </View> */}
        {/* </TouchableWithoutFeedback> */}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={bookingData?.orderItems}
          renderItem={({ item, index }) => renderClassItem(item, index)}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={[commonStyles.lineSeparator, { flex: 0 }]} />
        <View style={{ height: RfH(32) }} />
        <View
          style={{
            marginHorizontal: RfW(16),
            borderWidth: 1,
            borderRadius: 8,
            borderColor: Colors.lightGrey,
          }}>
          <Text style={{ paddingHorizontal: RfW(8), paddingVertical: RfH(12) }}>Payment details</Text>
          <View style={[commonStyles.lineSeparator, { flex: 0 }]} />
          <View style={{ height: RfH(16) }} />
          <View style={{ paddingHorizontal: RfW(8) }}>
            <View style={commonStyles.horizontalChildrenSpaceView}>
              <Text style={commonStyles.mediumMutedText}>Amount</Text>
              <Text style={[commonStyles.mediumMutedText, { fontFamily: Fonts.semiBold }]}>
                {' '}
                ₹{parseFloat(bookingData.subTotal).toFixed(2)}
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
            {bookingData?.promotion?.code && (
              <View style={commonStyles.horizontalChildrenSpaceView}>
                <Text style={commonStyles.mediumMutedText}>{bookingData?.promotion?.code} Applied</Text>
                <Text style={[commonStyles.mediumMutedText, { fontFamily: Fonts.semiBold }]}>₹200</Text>
              </View>
            )}
            <View style={{ height: RfH(16) }} />
          </View>
          <View style={[commonStyles.lineSeparator, { flex: 0 }]} />
          <View style={{ height: RfH(16) }} />
          <View style={[commonStyles.horizontalChildrenSpaceView, { paddingHorizontal: RfW(8), marginBottom: RfH(8) }]}>
            <Text style={[commonStyles.mediumPrimaryText, { fontFamily: Fonts.bold }]}>Total amount paid</Text>
            <Text style={[commonStyles.mediumPrimaryText, { fontFamily: Fonts.bold }]}>
              ₹{bookingData?.payableAmount ? parseFloat(bookingData?.payableAmount).toFixed(2) : '0.00'}
            </Text>
          </View>
        </View>
      </ScrollView>
      <ActionSheet
        actions={menuItem}
        cancelText="Dismiss"
        handleCancel={() => setOpenMenu(false)}
        isVisible={openMenu}
        topLabel="Action"
      />
      <Modal animationType="fade" transparent visible={false} onRequestClose={() => setOpenMenu(false)}>
        <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'column' }}>
          <TouchableWithoutFeedback onPress={() => setOpenMenu(false)}>
            <View
              style={{
                top: 34,
                right: 0,
                width: RfW(150),
                height: RfH(170),
                position: 'absolute',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                backgroundColor: Colors.white,
                borderColor: Colors.darkGrey,
                borderWidth: 1,
              }}>
              <TouchableWithoutFeedback onPress={() => openCancelConfirm()}>
                <Text style={{ padding: RfH(16) }}>Cancel order</Text>
              </TouchableWithoutFeedback>
              <View style={[commonStyles.lineSeparator, { flex: 0 }]} />
              <TouchableWithoutFeedback onPress={() => goToInvoice()}>
                <Text style={{ padding: RfH(16) }}>Generate Invoice</Text>
              </TouchableWithoutFeedback>
              <View style={[commonStyles.lineSeparator, { flex: 0 }]} />
              <TouchableWithoutFeedback onPress={() => goToCustomerCare()}>
                <Text style={{ padding: RfH(16) }}>Help</Text>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
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
          <Button onPress={() => onCancelBooking()} style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
            <Text style={commonStyles.textButtonPrimary}>Submit</Text>
          </Button>
        </View>
      </Modal>
    </View>
  );
}

export default BookingDetails;
