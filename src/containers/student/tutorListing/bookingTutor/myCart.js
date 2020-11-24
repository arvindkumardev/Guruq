/* eslint-disable operator-assignment */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import { Alert, View, Text, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Button } from 'native-base';
import { useMutation, useQuery } from '@apollo/client';
import { IconButtonWrapper, PaymentMethodModal, ScreenHeader } from '../../../../components';
import { Colors, Fonts, Images } from '../../../../theme';
import commonStyles from '../../../../theme/styles';
import styles from '../styles';
import { RfH, RfW } from '../../../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../../../utils/constants';
import QPointPayModal from '../components/qPointPayModal';
import CouponModal from '../components/couponModal';
import Loader from '../../../../components/Loader';
import { GET_CART_ITEMS } from '../../booking.query';
import { REMOVE_CART_ITEM } from '../../booking.mutation';

const myCart = () => {
  const [showQPointPayModal, setShowQPointPayModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const [amount, setAmount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [qPoints, setQPoints] = useState(300);

  const [bookingData, setBookingData] = useState({
    itemPrice: amount,
    orderStatus: 1,
    redeemQPoints: qPoints,
    orderPayment: { amount, paymentMethod: 1 },
  });

  const { loading: cartLoading, error: cartError, data: cartItemData } = useQuery(GET_CART_ITEMS, {
    fetchPolicy: 'no-cache',
  });

  // const { loading: cartLoading, error: cartError, data: cartItemData } = useQuery(ME_QUERY, {
  //   fetchPolicy: 'no-cache',
  // });

  useEffect(() => {
    if (cartItemData?.getCartItems) {
      setCartItems(cartItemData.getCartItems);
      let amt = 0;
      for (const obj of cartItemData.getCartItems) {
        amt += obj.price;
      }
      setAmount(amt);
    }
  }, [cartItemData?.getCartItems]);

  const [removeItem, { loading: removeLoading }] = useMutation(REMOVE_CART_ITEM, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        let cart = [];
        let index = 0;
        cart = cartItems;
        index = cart.findIndex((obj) => obj.id === data.removeFromCart.id);
        if (index !== -1) {
          cart.splice(index, 1);
          setCartItems(cart);
          setRefreshList(!refreshList);
        }
      }
    },
  });

  const getTutorImage = (tutor) => {
    return tutor && tutor.profileImage && tutor.profileImage.filename
      ? `https://guruq.in/api/${tutor?.profileImage?.filename}`
      : `https://guruq.in/guruq-new/images/avatars/${tutor?.contactDetail?.gender === 'MALE' ? 'm' : 'f'}${
          tutor.id % 4
        }.png`;
  };

  const removeCartItem = (item) => {
    removeItem({
      variables: { cartItemId: item.id },
    });
  };

  const renderCartItems = (item, index) => {
    return (
      <View style={commonStyles.horizontalChildrenStartView}>
        <IconButtonWrapper
          iconHeight={RfH(90)}
          iconWidth={RfW(80)}
          iconImage={getTutorImage(item?.tutor)}
          styling={{ flex: 0.3, borderRadius: 16 }}
        />
        <View style={([commonStyles.verticallyCenterItemsView], { flex: 1, marginLeft: RfW(16) })}>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <View>
              <Text style={styles.buttonText}>{item?.offering?.displayName}</Text>
              <Text style={styles.buttonText}>
                by {item?.tutor?.contactDetail?.firstName} {item?.tutor?.contactDetail?.lastName}
              </Text>
            </View>
            <View style={styles.bookingSelectorParent}>
              <IconButtonWrapper
                iconWidth={RfW(12)}
                iconHeight={RfH(12)}
                iconImage={Images.minus_blue}
                submitFunction={() => removeClass(item, index)}
              />
              <Text>{item?.count}</Text>
              <IconButtonWrapper
                iconWidth={RfW(12)}
                iconHeight={RfH(12)}
                iconImage={Images.plus_blue}
                submitFunction={() => addClass(index)}
              />
            </View>
          </View>
          <Text style={styles.tutorDetails}>
            {item?.offering?.parentOffering?.parentOffering?.displayName}, {item?.offering?.parentOffering?.displayName}
          </Text>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={styles.tutorDetails}>
              {item.groupSize === 1 ? 'Individual' : 'Group'} {item?.onlineClass ? 'online' : 'offline'} class
            </Text>
            <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), fontFamily: 'SegoeUI-Bold' }}>
              ₹{item?.price}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderQPointView = () => {
    return (
      <TouchableWithoutFeedback onPress={() => setShowQPointPayModal(true)}>
        <View
          style={[
            commonStyles.horizontalChildrenSpaceView,
            {
              backgroundColor: Colors.white,
              height: RfH(44),
              alignItems: 'center',
              paddingHorizontal: RfW(16),
            },
          ]}>
          <View style={commonStyles.horizontalChildrenStartView}>
            <IconButtonWrapper iconHeight={RfH(24)} iconWidth={RfW(16)} iconImage={Images.logo_yellow} />
            <Text
              style={[
                styles.compareTutorName,
                {
                  fontFamily: 'SegoeUI-Bold',
                  color: Colors.orange,
                  marginLeft: RfW(8),
                  marginTop: 0,
                },
              ]}>
              Apply Q Points
            </Text>
          </View>
          <IconButtonWrapper
            iconHeight={RfH(24)}
            iconWidth={RfW(24)}
            iconImage={Images.chevronRight}
            submitFunction={() => setShowQPointPayModal(true)}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderCouponView = () => {
    return (
      <TouchableWithoutFeedback onPress={() => setShowCouponModal(true)}>
        <View
          style={[
            commonStyles.horizontalChildrenSpaceView,
            {
              backgroundColor: Colors.white,
              height: RfH(44),
              alignItems: 'center',
              paddingHorizontal: RfW(16),
            },
          ]}>
          <View style={commonStyles.horizontalChildrenStartView}>
            <IconButtonWrapper iconHeight={RfH(24)} iconWidth={RfW(16)} iconImage={Images.logo_yellow} />
            <Text
              style={[
                styles.compareTutorName,
                {
                  fontFamily: Fonts.semiBold,
                  color: Colors.black,
                  marginLeft: RfW(8),
                  marginTop: 0,
                },
              ]}>
              Apply Coupon
            </Text>
          </View>
          <IconButtonWrapper iconHeight={RfH(24)} iconWidth={RfW(24)} iconImage={Images.chevronRight} />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderCartDetails = () => {
    return (
      <View style={{ backgroundColor: Colors.white, paddingHorizontal: RfW(16) }}>
        <View style={[commonStyles.horizontalChildrenSpaceView, { height: RfH(44), alignItems: 'center' }]}>
          <Text style={styles.tutorDetails}>Amount</Text>
          <Text style={styles.tutorDetails}>₹{amount}</Text>
        </View>

        <View style={commonStyles.lineSeparator} />

        <View style={[commonStyles.horizontalChildrenSpaceView, { height: RfH(44), alignItems: 'center' }]}>
          <Text
            style={[
              styles.tutorDetails,
              {
                fontFamily: 'SegoeUI-Bold',
              },
            ]}>
            Total Amount
          </Text>
          <Text
            style={[
              styles.tutorDetails,
              {
                fontFamily: 'SegoeUI-Bold',
              },
            ]}>
            ₹{amount}
          </Text>
        </View>
      </View>
    );
  };

  const addClass = (index) => {
    const newArray = [];
    cartItems.map((obj) => {
      newArray.push(obj);
    });
    let arrayItem = {};
    arrayItem = { ...newArray[index] };
    const itemPrice = arrayItem.price / arrayItem.count;
    arrayItem.count = arrayItem.count + 1;
    arrayItem.price = arrayItem.count * itemPrice;
    newArray[index] = arrayItem;
    setCartItems(newArray);
    let amt = 0;
    for (const obj of newArray) {
      amt += obj.price;
    }
    setAmount(amt);
    setRefreshList(!refreshList);
  };

  const removeClassItem = (index) => {
    const newArray = [];
    cartItems.map((obj) => {
      newArray.push(obj);
    });
    if (newArray[index].count > 0) {
      let arrayItem = {};
      arrayItem = { ...newArray[index] };
      const itemPrice = arrayItem.price / arrayItem.count;
      arrayItem.count = arrayItem.count - 1;
      arrayItem.price = arrayItem.count * itemPrice;
      newArray[index] = arrayItem;
      setCartItems(newArray);
      let amt = 0;
      for (const obj of newArray) {
        amt += obj.price;
      }
      setAmount(amt);
      setRefreshList(!refreshList);
    }
  };

  const removeAfterConfirm = (item, index) => {
    removeClassItem(index);
    removeCartItem(item);
  };

  const removeClass = (item, index) => {
    if (cartItems[index].count === 1) {
      Alert.alert(
        'Do you want to remove item from cart?',
        '',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => removeAfterConfirm(item, index),
          },
        ],
        { cancelable: false }
      );
    } else {
      removeClassItem(index);
    }
  };

  const createBooking = () => {
    setShowQPointPayModal(false);
    setShowPaymentModal(true);
  };

  return (
    <View style={[commonStyles.mainContainer, { paddingHorizontal: 0, backgroundColor: Colors.lightGrey }]}>
      <Loader isLoading={cartLoading || removeLoading} />
      {/* <View style={{ marginHorizontal: RfW(16) }}> */}
      <ScreenHeader label="My Cart" labelStyle={{ justifyContent: 'center' }} homeIcon horizontalPadding={16} />
      {/* </View> */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <View */}
        {/*  style={[ */}
        {/*    styles.itemView, */}
        {/*    { */}
        {/*      marginTop: RfH(8), */}
        {/*      paddingVertical: RfH(8), */}
        {/*      paddingLeft: RfW(48), */}
        {/*    }, */}
        {/*  ]}> */}
        {/*  <Text style={styles.appliedFilterText}>{cartItems.length} ITEMS</Text> */}
        {/* </View> */}
        <View style={{ paddingHorizontal: RfW(16), paddingVertical: RfH(16), backgroundColor: Colors.white }}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={cartItems}
            extraData={refreshList}
            renderItem={({ item, index }) => renderCartItems(item, index)}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

        <View style={commonStyles.blankViewSmall} />

        {renderQPointView()}

        <View style={commonStyles.blankViewSmall} />

        {renderCouponView()}

        <View style={commonStyles.blankViewSmall} />

        {/* <Text style={[styles.chargeText, { margin: RfH(16), marginLeft: RfW(16) }]}>CART DETAILS (4 Items)</Text> */}

        <View
          style={{
            height: 44,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              paddingHorizontal: RfW(16),
              // marginBottom: RfW(8),
              fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
              color: Colors.secondaryText,
            }}>
            CART DETAILS ({cartItems.length} Items)
          </Text>
        </View>

        {renderCartDetails()}
      </ScrollView>

      <View
        style={[
          commonStyles.horizontalChildrenSpaceView,
          {
            alignItems: 'flex-end',
            backgroundColor: Colors.white,
            paddingTop: RfH(8),
            paddingHorizontal: RfW(16),
            paddingBottom: RfH(34),
          },
        ]}>
        <View>
          <Text style={commonStyles.headingPrimaryText}>₹{amount}</Text>
          <Text style={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), color: Colors.brandBlue2 }}>View Details</Text>
        </View>
        <View>
          <Button
            onPress={() => setShowPaymentModal(true)}
            style={[
              commonStyles.buttonPrimary,
              {
                width: RfW(144),
                alignSelf: 'flex-end',
                marginHorizontal: 0,
              },
            ]}>
            <Text style={commonStyles.textButtonPrimary}>Pay Now</Text>
          </Button>
        </View>
      </View>

      <QPointPayModal
        visible={showQPointPayModal}
        onClose={() => setShowQPointPayModal(false)}
        amount={amount}
        deductedAgaintQPoint={qPoints}
        totalAmount={amount}
        qPoint={qPoints}
        amountToPayAfterQPoint={amount - qPoints}
        onPayNow={() => createBooking()}
      />
      <CouponModal visible={showCouponModal} onClose={() => setShowCouponModal(false)} />
      <PaymentMethodModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        bookingData={bookingData}
        amount={amount}
      />
    </View>
  );
};

export default myCart;
