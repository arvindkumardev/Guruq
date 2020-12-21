/* eslint-disable react/no-array-index-key */
/* eslint-disable radix */
/* eslint-disable operator-assignment */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Text, TextInput, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Button, Picker } from 'native-base';
import { useMutation, useQuery } from '@apollo/client';
import { range } from 'lodash';
import { IconButtonWrapper, PaymentMethodModal, ScreenHeader } from '../../../../components';
import { Colors, Fonts, Images } from '../../../../theme';
import commonStyles from '../../../../theme/styles';
import styles from '../styles';
import { alertBox, getUserImageUrl, RfH, RfW } from '../../../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../../../utils/constants';
import QPointPayModal from '../components/qPointPayModal';
import CouponModal from '../components/couponModal';
import Loader from '../../../../components/Loader';
import { GET_CART_ITEMS } from '../../booking.query';
import { CHECK_COUPON, REMOVE_CART_ITEM } from '../../booking.mutation';
import { ME_QUERY } from '../../../common/graphql-query';

const myCart = () => {
  const [showQPointPayModal, setShowQPointPayModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [amount, setAmount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [qPoints, setQPoints] = useState(100);
  const [qPointsRedeem, setQPointsRedeem] = useState(0);

  const [applyQPoints, setApplyQPoints] = useState(false);
  const [applyCoupons, setApplyCoupons] = useState(false);
  const [appliedCouponCode, setAppliedCouponCode] = useState('');
  const [appliedCouponValue, setAppliedCouponValue] = useState('');

  const [couponCode, setCouponCode] = useState('');

  const [bookingData, setBookingData] = useState({
    itemPrice: amount,
    orderStatus: 1,
    redeemQPoints: qPoints,
    orderPayment: { amount, paymentMethod: 1 },
  });

  const { loading: cartLoading, error: cartError, data: cartItemData } = useQuery(GET_CART_ITEMS, {
    fetchPolicy: 'no-cache',
  });

  const { loading: meLoading, error: meError, data: userData } = useQuery(ME_QUERY, {
    fetchPolicy: 'no-cache',
  });

  const [checkCouponCode, { loading: couponLoading }] = useMutation(CHECK_COUPON, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        if (!data.checkCoupon.isPercentage) {
          if (data.checkCoupon.maxDiscount >= data.checkCoupon.discount) {
            setAppliedCouponValue(data.checkCoupon.discount);
          } else {
            setAppliedCouponValue(data.checkCoupon.maxDiscount);
          }
        } else {
          let discountedAmount = 0;
          discountedAmount = (amount * data.checkCoupon.discount) / 100;
          if (data.checkCoupon.maxDiscount >= discountedAmount) {
            setAppliedCouponValue(discountedAmount);
          } else {
            setAppliedCouponValue(data.checkCoupon.maxDiscount);
          }
        }
        setAppliedCouponCode(data.checkCoupon.code);
        setApplyCoupons(true);
      }
    },
  });

  const checkCoupon = () => {
    if (couponCode !== '') {
      checkCouponCode({
        variables: { code: couponCode },
      });
    } else {
      alertBox('Error', 'Please provide the coupon code');
    }
  };

  useEffect(() => {
    if (cartItemData) {
      if (cartItemData?.getCartItems.length > 0) {
        setCartItems(cartItemData.getCartItems);
        let amt = 0;
        for (const obj of cartItemData.getCartItems) {
          amt += obj.price;
        }
        setAmount(amt);
        setIsEmpty(false);
      } else {
        setIsEmpty(true);
      }
    }
  }, [cartItemData?.getCartItems]);

  useEffect(() => {
    if (userData) {
      setQPoints(userData.me.qPoints);
    }
  }, []);

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
    return getUserImageUrl(tutor?.profileImage?.filename, tutor?.contactDetail?.gender, tutor.id);
  };

  const removeCartItem = (item) => {
    removeItem({
      variables: { cartItemId: item.id },
    });
  };

  const renderCartItems = (item, index) => (
    <View style={[commonStyles.horizontalChildrenStartView, { marginBottom: RfH(16) }]}>
      <IconButtonWrapper
        iconHeight={RfH(90)}
        iconWidth={RfW(80)}
        imageResizeMode="cover"
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
            <View style={styles.bookingSelectorParent}>
              <TouchableWithoutFeedback onPress={() => removeClass(item, index)}>
                <View style={{ paddingHorizontal: RfW(8), paddingVertical: RfH(8) }}>
                  <IconButtonWrapper iconWidth={RfW(12)} iconHeight={RfH(12)} iconImage={Images.minus_blue} />
                </View>
              </TouchableWithoutFeedback>

              <Text>{item?.count}</Text>

              <TouchableWithoutFeedback onPress={() => addClass(index)}>
                <View style={{ paddingHorizontal: RfW(8), paddingVertical: RfH(8) }}>
                  <IconButtonWrapper iconWidth={RfW(12)} iconHeight={RfH(12)} iconImage={Images.plus_blue} />
                </View>
              </TouchableWithoutFeedback>
            </View>
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

  const enableApplyQPoints = () => {
    setApplyQPoints(!applyQPoints);
    setQPointsRedeem(0);
  };

  const selectQPoints = (value) => {
    setQPointsRedeem(value);
  };

  const renderQPointView = () => (
    <View>
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
          <Text
            style={[
              commonStyles.mediumPrimaryText,
              {
                fontFamily: Fonts.semiBold,
              },
            ]}>
            Apply Q Points
          </Text>
        </View>

        <IconButtonWrapper
          iconWidth={RfW(20)}
          iconHeight={RfH(20)}
          iconImage={applyQPoints ? Images.checkbox_selected : Images.checkbox}
          submitFunction={enableApplyQPoints}
        />
      </View>

      {applyQPoints && (
        <View
          style={{
            backgroundColor: Colors.white,
            height: RfH(44),
            paddingHorizontal: RfW(16),
          }}>
          <View style={commonStyles.lineSeparator} />

          <View style={[commonStyles.horizontalChildrenSpaceView, { height: RfH(44), alignItems: 'center' }]}>
            <Text style={commonStyles.secondaryText}>{qPoints} Available Points</Text>
            <View
              style={[
                commonStyles.horizontalChildrenView,
                { borderWidth: 1, borderColor: Colors.borderColor, paddingLeft: RfW(8), borderRadius: 8 },
              ]}>
              <View style={{ borderRightColor: Colors.lightGrey, borderRightWidth: 1 }}>
                <Text style={commonStyles.regularPrimaryText}>₹ </Text>
              </View>
              <Picker
                iosHeader="QPoints"
                Header="QPoints"
                style={{ height: RfH(36), width: RfW(80), alignItems: 'center' }}
                mode="dialog"
                textStyle={{ fontSize: RFValue(17, STANDARD_SCREEN_SIZE) }}
                placeholder={qPointsRedeem}
                selectedValue={qPointsRedeem}
                onValueChange={(value) => selectQPoints(value)}>
                {range(0, qPoints + 1, 5).map((obj, i) => {
                  return <Picker.Item label={obj} value={obj} key={i} />;
                })}
              </Picker>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  const removeCoupon = () => {
    setAppliedCouponCode('');
    setAppliedCouponValue('');
    setCouponCode('');
    setApplyCoupons(false);
  };

  const renderCouponView = () => {
    return (
      <TouchableWithoutFeedback>
        <View
          style={{
            height: 44,
            justifyContent: 'center',
          }}>
          <Text
            style={[
              commonStyles.mediumMutedText,
              {
                paddingHorizontal: RfW(16),
              },
            ]}>
            COUPONS
          </Text>
        </View>
        {!applyCoupons && (
          <View
            style={[
              commonStyles.horizontalChildrenSpaceView,
              {
                backgroundColor: Colors.white,
                alignItems: 'center',
                paddingHorizontal: RfW(16),
              },
            ]}>
            <View
              style={[
                commonStyles.horizontalChildrenStartView,
                {
                  justifyContent: 'space-between',
                  alignItems: 'center',
                },
              ]}>
              <TextInput
                style={{
                  flex: 1,
                  height: RfH(40),
                  borderColor: Colors.borderColor,
                  borderWidth: 0.5,
                  borderRadius: RfH(10),
                  fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
                  marginVertical: RfH(4),
                  paddingLeft: 8,
                }}
                placeholder="Enter coupon code"
                value={couponCode}
                onChangeText={(text) => setCouponCode(text)}
              />
              <TouchableWithoutFeedback
                onPress={() => checkCoupon()}
                style={{
                  color: Colors.brandBlue2,
                  height: RfH(48),
                  marginLeft: RfW(16),
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={[
                    commonStyles.textButtonPrimary,
                    { color: Colors.brandBlue2, fontSize: RFValue(17, STANDARD_SCREEN_SIZE) },
                  ]}>
                  APPLY
                </Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        )}

        {applyCoupons && (
          <View
            style={{
              backgroundColor: Colors.white,
              paddingHorizontal: RfW(16),
            }}>
            <View style={[commonStyles.horizontalChildrenSpaceView, { alignItems: 'center', marginVertical: RfH(16) }]}>
              <View>
                <Text style={commonStyles.secondaryText}>{appliedCouponCode}</Text>
                <Text style={commonStyles.smallMutedText}>Offer applied on the bill</Text>
              </View>
              <TouchableWithoutFeedback onPress={() => removeCoupon()}>
                <View
                  style={{
                    height: RfH(24),
                    width: RfH(24),
                    borderRadius: RfH(12),
                    backgroundColor: Colors.lightGrey,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <IconButtonWrapper iconWidth={RfW(12)} iconHeight={RfH(12)} iconImage={Images.cross} />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        )}
      </TouchableWithoutFeedback>
    );
  };

  const renderCartDetails = () => (
    <View style={{ backgroundColor: Colors.white, paddingHorizontal: RfW(16) }}>
      <View style={[commonStyles.horizontalChildrenSpaceView, { height: RfH(44), alignItems: 'center' }]}>
        <Text style={commonStyles.mediumPrimaryText}>Amount</Text>
        <Text style={commonStyles.mediumPrimaryText}>₹{amount}</Text>
      </View>
      {applyCoupons && (
        <View>
          <View style={commonStyles.lineSeparator} />

          <View style={[commonStyles.horizontalChildrenSpaceView, { height: RfH(44), alignItems: 'center' }]}>
            <Text style={commonStyles.mediumPrimaryText}>{appliedCouponCode}</Text>
            <Text style={[commonStyles.mediumPrimaryText, { color: Colors.brandBlue2 }]}>-₹{appliedCouponValue}</Text>
          </View>
        </View>
      )}
      <View style={commonStyles.lineSeparator} />
      <View style={[commonStyles.horizontalChildrenSpaceView, { height: RfH(44), alignItems: 'center' }]}>
        <Text style={commonStyles.regularPrimaryText}>Total Amount</Text>
        <Text style={commonStyles.regularPrimaryText}>₹{amount - (appliedCouponValue + qPointsRedeem)}</Text>
      </View>
    </View>
  );

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
      <Loader isLoading={cartLoading || removeLoading || couponLoading} />
      <ScreenHeader label="My Cart" labelStyle={{ justifyContent: 'center' }} homeIcon horizontalPadding={16} />
      {cartLoading ? (
        <View style={{ backgroundColor: Colors.lightGrey }} />
      ) : (
        <>
          {!isEmpty ? (
            <View style={{ flex: 1 }}>
              <ScrollView showsVerticalScrollIndicator={false}>
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
                    alignItems: 'center',
                    backgroundColor: Colors.white,
                    paddingTop: RfH(8),
                    paddingHorizontal: RfW(16),
                    paddingBottom: RfH(34),
                    justifyContent: 'space-between',
                  },
                ]}>
                <View>
                  <Text style={commonStyles.headingPrimaryText}>₹{amount - (appliedCouponValue + qPointsRedeem)}</Text>
                </View>
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
          ) : (
            <View>
              <Image
                source={Images.empty_cart}
                style={{
                  margin: RfH(56),
                  alignSelf: 'center',
                  height: RfH(264),
                  width: RfW(248),
                  marginBottom: RfH(32),
                }}
              />
              <Text
                style={[
                  commonStyles.pageTitleThirdRow,
                  { fontSize: RFValue(20, STANDARD_SCREEN_SIZE), textAlign: 'center' },
                ]}>
                Your cart is empty
              </Text>
              <Text
                style={[
                  commonStyles.regularMutedText,
                  { marginHorizontal: RfW(80), textAlign: 'center', marginTop: RfH(16) },
                ]}>
                Looks like you haven't made your choice yet.....
              </Text>
            </View>
          )}
        </>
      )}

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
      <CouponModal
        visible={showCouponModal}
        onClose={() => setShowCouponModal(false)}
        checkCoupon={(couponCode) => checkCoupon(couponCode)}
      />
      <PaymentMethodModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        bookingData={bookingData}
        amount={amount}
        deductedAgaintQPoint={qPointsRedeem}
        discount={appliedCouponValue + qPointsRedeem}
        hidePaymentPopup={() => setShowPaymentModal(false)}
      />
    </View>
  );
};

export default myCart;
