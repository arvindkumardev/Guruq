import { Text, View, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import React, { useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { CustomRadioButton, IconButtonWrapper, ScreenHeader, TutorImageComponent } from '../../../../components';
import commonStyles from '../../../../theme/styles';
import { Colors, Fonts, Images } from '../../../../theme';
import {getFullName, RfH, RfW} from '../../../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../../../utils/constants';
import { tutorDetails } from '../../../../apollo/cache';
import routeNames from '../../../../routes/screenNames';

function ViewBookingDetails() {
  const navigation = useNavigation();
  const [openMenu, setOpenMenu] = useState(false);
  const [cancelReason, setCancelReason] = useState(false);
  const [cancelReasons, setCancelReasons] = useState([
    { reason: 'I am unavailable to take classes at this moment.', selected: true },
    { reason: 'I want to replace the tutor with other.', selected: false },
    { reason: 'I did not find tutor reliable.', selected: false },
    { reason: 'I am unsatisfied with the quality of tutor.', selected: false },
    { reason: 'Others', selected: false },
  ]);
  const [bookingData, setBookingData] = useState([
    {
      subject: 'Chemistry Class',
      board: 'CBSE',
      class: 'Class 9',
      name: 'Booking Id 73829',
      id: '25 Sept 2020',
      onlineClass: 4,
      count: '800.00',
    },
    { title: 'Booking Id 73829', date: '25 Sept 2020', count: 4, amount: '800.00' },
    { title: 'Booking Id 73829', date: '25 Sept 2020', count: 4, amount: '800.00' },
    { title: 'Booking Id 73829', date: '25 Sept 2020', count: 4, amount: '800.00' },
  ]);

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
        </View>
        <View style={{ borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5, marginTop: RfH(8) }} />
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(8) }]}>
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
    setCancelReason(true);
  };

  const openCancelConfirm = () => {
    Alert.alert(
      'Do you want to cancel your class?',
      '',
      [
        {
          text: 'NO',
          style: 'cancel',
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

  const renderReasons = (item) => {
    return (
      <View style={{ padding: RfH(16) }}>
        <View style={commonStyles.horizontalChildrenView}>
          <CustomRadioButton enabled={item.selected} />
          <Text style={{ marginLeft: RfW(8) }}>{item.reason}</Text>
        </View>
      </View>
    );
  };

  const goToRefund = () => {
    setCancelReason(false);
    navigation.navigate(routeNames.STUDENT.REFUND);
  };

  return (
    <View style={(commonStyles.mainContainer, { flex: 1, backgroundColor: Colors.white })}>
      <ScreenHeader
        label="View booking details"
        homeIcon
        horizontalPadding={RfW(16)}
        showRightIcon
        rightIcon={Images.vertical_dots_b}
        onRightIconClick={() => setOpenMenu(true)}
      />
      <View style={{ height: RfH(20) }} />
      <View
        style={{
          marginHorizontal: RfW(16),
          borderWidth: 1,
          borderRadius: 8,
          borderColor: Colors.lightGrey,
          paddingVertical: RfH(16),
          paddingHorizontal: RfW(16),
        }}>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={[commonStyles.regularPrimaryText, { flex: 0.5, fontFamily: Fonts.semiBold }]}>Booking Id</Text>
          <Text style={[commonStyles.regularPrimaryText, { flex: 0.5, fontFamily: Fonts.semiBold }]}>73839</Text>
        </View>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={[commonStyles.regularPrimaryText, { flex: 0.5, fontFamily: Fonts.semiBold }]}>Booking date</Text>
          <Text style={[commonStyles.regularPrimaryText, { flex: 0.5, fontFamily: Fonts.semiBold }]}>25 Sept 2020</Text>
        </View>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={[commonStyles.regularPrimaryText, { flex: 0.5, fontFamily: Fonts.semiBold }]}>Amount</Text>
          <Text style={[commonStyles.regularPrimaryText, { flex: 0.5, fontFamily: Fonts.semiBold }]}>₹ 800.00</Text>
        </View>
      </View>
      <View style={{ height: RfH(20) }} />
      {/* <FlatList
        showsVerticalScrollIndicator={false}
        data={bookingData}
        renderItem={({ item, index }) => renderClassItem(item, index)}
        keyExtractor={(item, index) => index.toString()}
      /> */}
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
            <Text style={[commonStyles.mediumMutedText, { fontFamily: Fonts.semiBold }]}>₹1200</Text>
          </View>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={commonStyles.mediumMutedText}>Convenience charges</Text>
            <Text style={[commonStyles.mediumMutedText, { fontFamily: Fonts.semiBold }]}>₹100</Text>
          </View>
        </View>
        <View style={{ height: RfH(16) }} />
        <View style={[commonStyles.lineSeparator, { flex: 0 }]} />
        <View style={{ paddingHorizontal: RfW(8) }}>
          <View style={{ height: RfH(16) }} />
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={commonStyles.mediumMutedText}>Paid by Q points</Text>
            <Text style={[commonStyles.mediumMutedText, { fontFamily: Fonts.semiBold }]}>₹300</Text>
          </View>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={commonStyles.mediumMutedText}>GURUQ1ST Applied</Text>
            <Text style={[commonStyles.mediumMutedText, { fontFamily: Fonts.semiBold }]}>₹200</Text>
          </View>
          <View style={{ height: RfH(16) }} />
        </View>
        <View style={[commonStyles.lineSeparator, { flex: 0 }]} />
        <View style={{ height: RfH(16) }} />
        <View style={[commonStyles.horizontalChildrenSpaceView, { paddingHorizontal: RfW(8), marginBottom: RfH(8) }]}>
          <Text style={[commonStyles.mediumPrimaryText, { fontFamily: Fonts.bold }]}>Total amount paid</Text>
          <Text style={[commonStyles.mediumPrimaryText, { fontFamily: Fonts.bold }]}>₹800</Text>
        </View>
      </View>
      <Modal animationType="fade" transparent visible={openMenu} onRequestClose={() => setOpenMenu(false)}>
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
              <TouchableWithoutFeedback>
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
        visible={cancelReason}
        onRequestClose={() => {
          setCancelReason(false);
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
            iconHeight={RfH(24)}
            iconWidth={RfW(24)}
            iconImage={Images.cross}
            submitFunction={() => setCancelReason(false)}
            imageResizeMode="contain"
          />
          <FlatList
            showsVerticalScrollIndicator={false}
            data={cancelReasons}
            renderItem={({ item, index }) => renderReasons(item, index)}
            keyExtractor={(item, index) => index.toString()}
          />
          <Button onPress={() => goToRefund()} style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
            <Text style={commonStyles.textButtonPrimary}>Submit</Text>
          </Button>
        </View>
      </Modal>
    </View>
  );
}

export default ViewBookingDetails;
