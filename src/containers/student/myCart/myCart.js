/* eslint-disable react/no-array-index-key */
/* eslint-disable radix */
/* eslint-disable operator-assignment */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Text, TextInput, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Button } from 'native-base';
import analytics from '@react-native-firebase/analytics';

import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import { isEmpty, sum } from 'lodash';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  IconButtonWrapper,
  Loader,
  PaymentMethodModal,
  ScreenHeader,
  SelectSubjectModal,
  TutorImageComponent,
} from '../../../components';
import { Colors, Fonts, Images } from '../../../theme';
import commonStyles from '../../../theme/styles';
import styles from '../tutorListing/styles';
import { alertBox, getFullName, getToken, printCurrency, RfH, RfW } from '../../../utils/helpers';
import { LOCAL_STORAGE_DATA_KEY, STANDARD_SCREEN_SIZE, urlConfig } from '../../../utils/constants';
import { GET_CART_ITEMS } from '../booking.query';
import {
  ADD_TO_CART,
  CANCEL_PENDING_BOOKINGS,
  CHECK_COUPON,
  CREATE_BOOKING,
  REMOVE_CART_ITEM,
  REMOVE_COUPON,
} from '../booking.mutation';
import { GET_MY_QPOINTS_BALANCE, GET_STUDENT_DETAILS } from '../../common/graphql-query';
import CustomModalWebView from '../../../components/CustomModalWebView';
import { OrderStatusEnum, PaymentMethodEnum } from '../../../components/PaymentMethodModal/paymentMethod.enum';
import { activeCoupon, offeringsMasterData, pytnBooking, studentDetails, userDetails } from '../../../apollo/cache';
import NavigationRouteNames from '../../../routes/screenNames';
import { DUPLICATE_FOUND } from '../../../common/errorCodes';
import CouponModal from '../tutorListing/components/couponModal';
import CouponApplied from '../../../components/CouponApplied';

const MyCart = () => {
  // const [showQPointPayModal, setShowQPointPayModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cartEmpty, setCartEmpty] = useState(false);
  const [amount, setAmount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [qPoints, setQPoints] = useState(0);
  const [qPointsRedeemed, setQPointsRedeemed] = useState(0);
  const [applyQPoints, setApplyQPoints] = useState(false);
  const [token, setToken] = useState();
  const [selectedCartItem, setSelectedCartItem] = useState(null);
  const [paymentModal, setPaymentModal] = useState(false);
  const studentInfo = useReactiveVar(studentDetails);
  const [bookingData, setBookingData] = useState({});
  const userInfo = useReactiveVar(userDetails);
  const [paymentStatus, setPaymentStatus] = useState('success');
  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const [addresses, setAddresses] = useState([]);

  const activeCouponVar = useReactiveVar(activeCoupon);
  const isPytnBooking = useReactiveVar(pytnBooking);

  const [getStudentDetails, { loading: studentDetailLoading }] = useLazyQuery(GET_STUDENT_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        setAddresses(data?.getStudentDetails?.addresses);
      }
    },
  });

  const [couponApplied, setCouponApplied] = useState(!isEmpty(activeCouponVar));
  const [appliedCoupon, setAppliedCoupon] = useState(activeCouponVar);
  const [showCouponAppliedModal, setShowCouponAppliedModal] = useState(false);
  const [appliedCouponValue, setAppliedCouponValue] = useState(0);

  useEffect(() => {
    if (!cartEmpty && !isEmpty(activeCouponVar) && amount > 0) {
      console.log('useEffect: ', amount, activeCouponVar);
      applyCoupon(activeCouponVar, false);
      pytnBooking(cartItems.filter((ci) => !isEmpty(ci.pytnEntity)).length > 0);
    }
  }, [cartItems, amount]);

  const [getCartItems, { loading: cartLoading }] = useLazyQuery(GET_CART_ITEMS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        console.log('data?.getCartItems: ', data?.getCartItems);
        if (data?.getCartItems.length > 0) {
          setCartItems(data.getCartItems);
          setAmount(sum(data.getCartItems.map((item) => item.price)));
          setCartEmpty(false);
        } else {
          setCartEmpty(true);
        }
      }
    },
  });

  const [cancelPendingBooking, { loading: cancelPendingBookingLoading }] = useMutation(CANCEL_PENDING_BOOKINGS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      console.log(data);
    },
  });

  const [createNewBooking, { loading: bookingLoading }] = useMutation(CREATE_BOOKING, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
        if (error.errorCode === DUPLICATE_FOUND) {
          alertBox(error.message);
        }
      }
    },
    onCompleted: (data) => {
      if (data) {
        fireLogPaymentEvent('add_payment_info', data.createBooking);
        navigation.navigate(NavigationRouteNames.STUDENT.BOOKING_CONFIRMED, {
          orderId: data?.createBooking?.orderId,
        });
      }
    },
  });

  const createBookingHandle = () => {
    const bookingData = { itemPrice: amount, redeemQPoints: parseFloat(qPointsRedeemed) };
    bookingData.convenienceCharges = 0;
    bookingData.orderPayment = { paymentMethod: PaymentMethodEnum.ONLINE.label, amount: 0 };
    bookingData.orderPayment.amount = amount;
    bookingData.itemPrice = amount;
    bookingData.orderStatus = OrderStatusEnum.PENDING.label;
    bookingData.promotionId = couponApplied ? appliedCoupon.id : 0;
    createNewBooking({
      variables: { orderCreateDto: bookingData },
    });
  };

  const [getMyQpointBalance, { loading: loadingPointsBalance }] = useLazyQuery(GET_MY_QPOINTS_BALANCE, {
    fetchPolicy: 'no-cache',
    variables: { searchDto: { userId: userInfo?.id } },
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        setQPoints(data.getMyBalance.balance);
      }
    },
  });
  // const { loading: meLoading, error: meError, data: userData } = useQuery(ME_QUERY, {
  //   fetchPolicy: 'no-cache',
  // });

  const [addToCart, { loading: addTocartLoading }] = useMutation(ADD_TO_CART, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        if (data.addToCart) {
          fireLogCartEvent('add_to_cart', data.addToCart);
        }
        getCartItems();
      }
    },
  });

  useEffect(() => {
    getCartItems();
    getMyQpointBalance();
  }, []);

  useEffect(() => {
    if (isFocussed) {
      getStudentDetails();
    }
  }, [isFocussed]);

  useEffect(() => {
    getToken().then((tk) => {
      setToken(tk);
    });
  }, []);

  const checkIfPromotionApplies = (promotion) => {
    if (promotion) {
      if (
        promotion.minCartAmount === 0 ||
        promotion.minCartAmount >= promotion.maxCartAmount ||
        (amount >= promotion.minCartAmount && amount <= promotion.maxCartAmount)
      ) {
        if (
          promotion.minCartItemCount === 0 ||
          promotion.minCartItemCount >= promotion.maxCartItemCount ||
          (cartItems.length >= promotion.minCartItemCount && cartItems.length <= promotion.maxCartItemCount)
        ) {
          const totalClassCount = cartItems?.reduce(function (tot, arr) {
            // return the sum with previous value
            return tot + arr.count;
            // set initial value as 0
          }, 0);

          if (promotion.minClassCount === 0 || totalClassCount >= promotion.minClassCount) {
            return true;
          }
          alertBox('Error', `Minimum ${promotion.minClassCount} class count required to apply this coupon!`);
        } else {
          alertBox('Error', `Minimum ${promotion.minCartItemCount} cart items required to apply this coupon!`);
        }
      } else {
        alertBox('Error', `Minimum ₹${promotion.minCartAmount} cart value required to apply this coupon`);
      }
    }
    setAppliedCoupon({});
    setCouponApplied(false);
    return false;
  };

  const applyCoupon = (promotion, showAppliedModal = true) => {
    if (promotion) {
      const isPromotionApplicable = checkIfPromotionApplies(promotion);

      if (isPromotionApplicable) {
        let discountAmount = 0;
        if (!promotion.isPercentage) {
          discountAmount = Math.min(promotion.discount, amount);
        } else {
          discountAmount = Math.round((amount * promotion.discount) / 100);
        }

        // final check on max discount that can be applied
        setAppliedCouponValue(Math.min(promotion.maxDiscount, discountAmount));

        setAppliedCoupon(promotion);
        setCouponApplied(true);

        setShowCouponModal(false);
        setShowCouponAppliedModal(showAppliedModal);

        // set qpoints to 0
        setQPointsRedeemed(0);

        // set the coupon as well
        activeCoupon(promotion);
        AsyncStorage.setItem(LOCAL_STORAGE_DATA_KEY.ACTIVE_COUPON, JSON.stringify(promotion));
      }
    }
  };

  const [removeCouponCode, { loading: removeCouponLoading }] = useMutation(REMOVE_COUPON, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        setAppliedCoupon({});
        setAppliedCouponValue(0);

        setCouponApplied(false);
        setShowCouponModal(false);

        activeCoupon({});

        // set the coupon as well
        AsyncStorage.removeItem(LOCAL_STORAGE_DATA_KEY.ACTIVE_COUPON);
      }
    },
  });

  const removeCoupon = () => {
    removeCouponCode({ variables: { code: appliedCoupon.code } });
  };

  const gotoTutors = (subject) => {
    setShowAllSubjects(false);
    navigation.navigate(NavigationRouteNames.STUDENT.TUTOR, { offering: subject });
  };

  const [removeItem, { loading: removeLoading }] = useMutation(REMOVE_CART_ITEM, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        fireLogCartEvent('remove_from_cart', selectedCartItem);
        getCartItems();
      }
    },
  });
  const fireLogPaymentEvent = async (eventName, data) => {
    const { id, payableAmount, orderPayment } = data;
    const payload = {
      orderId: id,
      paymentMode: orderPayment.paymentMethod,
      payableAmount,
    };
    await analytics().logEvent(eventName, payload);
  };

  const fireLogCartEvent = async (eventName, data) => {
    const { tutorOffering, count, onlineClass } = data;
    const payload = {
      tutorOfferingId: tutorOffering.id,
      classCount: count,
      classMode: onlineClass ? 'online' : 'offline',
      studentId: studentInfo.id,
    };
    await analytics().logEvent(eventName, payload);
    setSelectedCartItem(null);
  };

  const enableApplyQPoints = () => {
    setApplyQPoints(!applyQPoints);
    setQPointsRedeemed(0);
  };

  const handlePaytmPayment = (bookingData) => {
    setShowPaymentModal(false);
    setPaymentModal(true);
    setBookingData(bookingData);
  };

  useEffect(() => {
    if (!paymentModal && paymentStatus === 'failure') {
      alertBox('Transaction Failed', 'Please try again', {
        positiveText: 'Try Again',
        onPositiveClick: () => {
          setPaymentModal(true);
          setPaymentStatus('');
        },
        negativeText: 'Cancel',
        onNegativeClick: () => {
          cancelPendingBooking({ variables: { orderId: bookingData.id } });
        },
      });
    }
  }, [paymentModal]);

  const handlePaymentAuthorization = async (event) => {
    if (event.url.indexOf(`${urlConfig.DASHBOARD_URL}/booking/confirmation`) > -1) {
      setPaymentStatus('success');
      setPaymentModal(false);
      navigation.navigate(NavigationRouteNames.STUDENT.BOOKING_CONFIRMED, {
        orderId: bookingData.orderId,
        paymentMethod: PaymentMethodEnum.PAYTM.value,
      });
      setBookingData({});
    } else if (event.url.indexOf(`${urlConfig.DASHBOARD_URL}/booking/failure`) > -1) {
      setPaymentModal(false);
      setPaymentStatus('failure');
    } else {
      console.log('url', event.url);
    }
  };

  const paymentBackButtonHandler = () => {
    alertBox('Do you really want to cancel the transaction', '', {
      positiveText: 'Yes',
      onPositiveClick: () => {
        setPaymentStatus('');
        setBookingData('');
        setPaymentModal(false);

        cancelPendingBooking({ variables: { orderId: bookingData.id } });
      },
      negativeText: 'No',
    });
  };

  const removeCartItem = (item) => {
    Alert.alert(
      'Do you want to remove item from cart?',
      '',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            removeItem({
              variables: { cartItemId: item.id },
            });
            setSelectedCartItem(item);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const addClass = (item) => {
    if (item.demo) {
      alertBox("You can't add more than one demo class");
    } else {
      const cartCreate = {
        tutorOfferingId: item.tutorOffering.id,
        count: 1,
        groupSize: 1,
        demo: item.demo,
        onlineClass: item.onlineClass,
        price: item.mrp / item.count,
      };
      addToCart({
        variables: { cartCreateDto: cartCreate },
      });
    }
  };

  const removeClassItem = (item) => {
    const cartCreate = {
      tutorOfferingId: item.tutorOffering.id,
      count: -1,
      groupSize: 1,
      demo: item.demo,
      onlineClass: item.onlineClass,
      price: item.price / item.count,
    };
    addToCart({
      variables: { cartCreateDto: cartCreate },
    });
  };

  const removeClass = (item) => {
    if (item.count === 1) {
      Alert.alert(
        'Do you want to remove item from cart?',
        '',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => removeCartItem(item),
          },
        ],
        { cancelable: false }
      );
    } else {
      removeClassItem(item);
    }
  };

  const renderCartItems = (item, index) => (
    <>
      <View style={commonStyles.horizontalChildrenStartView}>
        <TutorImageComponent tutor={item?.tutor} width={80} height={80} styling={{ flex: 0.3, borderRadius: 8 }} />
        <View style={([commonStyles.verticallyCenterItemsView], { flex: 1, marginLeft: RfW(16) })}>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <View style={{ flex: 1 }}>
              <Text style={styles.buttonText}>{item?.offering?.displayName}</Text>
              <Text style={styles.buttonText} numberOfLines={2}>
                by {getFullName(item?.tutor?.contactDetail)}
              </Text>
            </View>
            <View style={styles.bookingSelectorParent}>
              {!isPytnBooking && (
                <TouchableWithoutFeedback onPress={() => removeClass(item)}>
                  <View style={{ paddingHorizontal: RfW(16), paddingVertical: RfH(10) }}>
                    <IconButtonWrapper iconWidth={RfW(12)} iconHeight={RfH(12)} iconImage={Images.minus_blue} />
                  </View>
                </TouchableWithoutFeedback>
              )}
              <Text style={commonStyles.headingPrimaryText}>{item?.count}</Text>
              {!isPytnBooking && (
                <TouchableWithoutFeedback onPress={() => addClass(item)}>
                  <View style={{ paddingHorizontal: RfW(16), paddingVertical: RfH(10) }}>
                    <IconButtonWrapper iconWidth={RfW(12)} iconHeight={RfH(12)} iconImage={Images.plus_blue} />
                  </View>
                </TouchableWithoutFeedback>
              )}
            </View>
          </View>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={styles.tutorDetails}>
              {item?.offering?.parentOffering?.parentOffering?.displayName},{' '}
              {item?.offering?.parentOffering?.displayName}
            </Text>
          </View>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={styles.tutorDetails}>
              {item?.onlineClass ? 'Online' : 'Home Tuition'} {item.groupSize === 1 ? 'Individual' : 'Group'}{' '}
              {item.demo ? 'Demo' : ''}Class
            </Text>

            <Text style={[commonStyles.mediumPrimaryText, { fontFamily: Fonts.bold }]}>
              ₹{printCurrency(item?.price)}
            </Text>
          </View>

          <View style={{ marginTop: RfH(8) }}>
            <TouchableWithoutFeedback onPress={() => removeCartItem(item)}>
              <Text style={[commonStyles.mediumPrimaryText, { color: Colors.orangeRed }]}>REMOVE</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
      <View style={commonStyles.blankViewSmall} />
    </>
  );

  const onSetQPoints = (val) => {
    if (val <= qPoints && val <= getPayableAmount()) {
      setQPointsRedeemed(val);
    }
  };

  const renderQPointView = () => (
    <View>
      {amount > 0 && (
        <View
          style={[
            commonStyles.horizontalChildrenSpaceView,
            {
              backgroundColor: Colors.white,
              // height: RfH(44),
              alignItems: 'center',
              paddingVertical: RfW(16),
              paddingHorizontal: RfW(16),
            },
          ]}>
          <View style={commonStyles.horizontalChildrenStartView}>
            <Text
              style={[
                commonStyles.primaryText,
                {
                  fontFamily: Fonts.semiBold,
                },
              ]}>
              Apply Q-Points
            </Text>
          </View>

          <IconButtonWrapper
            iconWidth={RfW(20)}
            iconHeight={RfH(20)}
            iconImage={applyQPoints ? Images.checkbox_selected : Images.checkbox}
            submitFunction={enableApplyQPoints}
            imageResizeMode="contain"
          />
        </View>
      )}

      {applyQPoints && (
        <View
          style={{
            backgroundColor: Colors.white,
            height: RfH(50),
            paddingHorizontal: RfW(16),
          }}>
          <View style={commonStyles.lineSeparator} />

          <View style={[commonStyles.horizontalChildrenSpaceView, { height: RfH(50), alignItems: 'center' }]}>
            <Text style={commonStyles.secondaryText}>{qPoints} Available Points</Text>
            <View
              style={[
                commonStyles.horizontalChildrenView,
                { borderWidth: 1, borderColor: Colors.borderColor, paddingLeft: RfW(8), borderRadius: 8 },
              ]}>
              <View style={{ borderRightColor: Colors.lightGrey, borderRightWidth: 1 }}>
                <Text style={commonStyles.regularPrimaryText}>₹ </Text>
              </View>
              <TextInput
                onChangeText={onSetQPoints}
                style={{ width: RfW(70), paddingVertical: RfH(8), height: RfH(40) }}
                value={qPointsRedeemed}
                keyboardType="numeric"
                editable={qPoints !== 0}
                returnKeyType="done"
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );

  const renderCouponView = () => {
    return (
      <TouchableWithoutFeedback onPress={() => setShowCouponModal(true)}>
        <View
          style={[
            commonStyles.horizontalChildrenSpaceView,
            {
              backgroundColor: Colors.white,
              // height: RfH(44),
              alignItems: 'center',
              paddingVertical: RfW(16),
              paddingHorizontal: RfW(16),
            },
          ]}>
          <View style={[commonStyles.horizontalChildrenStartView]}>
            <IconButtonWrapper iconHeight={RfH(24)} iconWidth={RfW(24)} iconImage={Images.discount} />

            <View style={[commonStyles.horizontalChildrenStartView, { paddingHorizontal: RfW(16) }]}>
              <Text style={commonStyles.regularPrimaryText}>Apply Coupon</Text>
            </View>
          </View>

          <IconButtonWrapper iconHeight={RfH(24)} iconWidth={RfW(24)} iconImage={Images.chevronRight} />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderAppliedCouponView = () => {
    return (
      <View
        style={[
          commonStyles.horizontalChildrenSpaceView,
          {
            backgroundColor: Colors.white,
            // height: RfH(44),
            alignItems: 'center',
            paddingVertical: RfW(16),
            paddingHorizontal: RfW(16),
          },
        ]}>
        <View style={[commonStyles.horizontalChildrenStartView]}>
          <IconButtonWrapper iconHeight={RfH(32)} iconWidth={RfW(32)} iconImage={Images.discount} />

          <View style={[commonStyles.verticallyStretchedItemsView, { paddingHorizontal: RfW(16) }]}>
            <Text
              style={[
                commonStyles.regularPrimaryText,
                {
                  color: Colors.black,
                  fontFamily: Fonts.semiBold,
                },
              ]}>
              {appliedCoupon.code}
            </Text>
            <Text style={[commonStyles.mediumMutedText]}>Offer applied on the booking</Text>
          </View>
        </View>

        {!isPytnBooking && (
          <IconButtonWrapper
            iconHeight={RfH(20)}
            iconWidth={RfW(20)}
            iconImage={Images.blue_cross}
            submitFunction={() => removeCoupon()}
          />
        )}
      </View>
    );
  };

  const getPayableAmount = () => {
    const payable = amount - qPointsRedeemed - appliedCouponValue;
    return payable > 0 ? payable : 0;
  };

  const renderCartDetails = () => (
    <View style={{ backgroundColor: Colors.white, paddingHorizontal: RfW(16) }}>
      <View style={[commonStyles.horizontalChildrenSpaceView, { height: RfH(44), alignItems: 'center' }]}>
        <Text style={commonStyles.mediumPrimaryText}>Sub Total</Text>
        <Text style={commonStyles.mediumPrimaryText}>₹{printCurrency(amount)}</Text>
      </View>
      {couponApplied && (
        <View>
          <View style={commonStyles.lineSeparator} />
          <View style={[commonStyles.horizontalChildrenSpaceView, { height: RfH(44), alignItems: 'center' }]}>
            <Text style={commonStyles.mediumPrimaryText}>Coupon Discount</Text>
            <Text style={[commonStyles.mediumPrimaryText, { color: Colors.brandBlue2 }]}>- ₹{appliedCouponValue}</Text>
          </View>
        </View>
      )}

      {qPointsRedeemed !== 0 && (
        <>
          <View style={commonStyles.lineSeparator} />
          <View style={[commonStyles.horizontalChildrenSpaceView, { height: RfH(44), alignItems: 'center' }]}>
            <Text style={[commonStyles.mediumPrimaryText, { color: Colors.darkGrey }]}>Paid by Q-Points</Text>
            <Text style={[commonStyles.mediumPrimaryText, { color: Colors.brandBlue2, fontWeight: 'bold' }]}>
              - ₹{printCurrency(qPointsRedeemed) * 1}
            </Text>
          </View>
        </>
      )}

      <View style={commonStyles.lineSeparator} />
      <View style={[commonStyles.horizontalChildrenSpaceView, { height: RfH(44), alignItems: 'center' }]}>
        <Text style={commonStyles.regularPrimaryText}>Payable Amount</Text>
        <Text style={commonStyles.regularPrimaryText}>₹{printCurrency(getPayableAmount())}</Text>
      </View>
    </View>
  );

  // const createBooking = () => {
  //   setShowQPointPayModal(false);
  //   setShowPaymentModal(true);
  // };

  return (
    <View style={[commonStyles.mainContainer, { paddingHorizontal: 0, backgroundColor: Colors.lightGrey }]}>
      <Loader
        isLoading={
          cartLoading ||
          removeLoading ||
          addTocartLoading ||
          bookingLoading ||
          cancelPendingBookingLoading ||
          removeCouponLoading
        }
      />
      <ScreenHeader label="My Cart" labelStyle={{ justifyContent: 'center' }} homeIcon horizontalPadding={16} />
      {!cartEmpty ? (
        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                paddingHorizontal: RfW(16),
                paddingVertical: RfH(16),
                backgroundColor: Colors.white,
              }}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                data={cartItems}
                // extraData={refreshList}
                renderItem={({ item, index }) => renderCartItems(item, index)}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>

            <View style={commonStyles.blankViewSmall} />

            {renderQPointView()}

            <View style={commonStyles.blankViewSmall} />

            {!couponApplied && renderCouponView()}
            {couponApplied && renderAppliedCouponView()}

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

          <View style={commonStyles.lineSeparator} />

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
              <Text style={commonStyles.headingPrimaryText}>₹{printCurrency(getPayableAmount())}</Text>
              <Text style={commonStyles.smallMutedText}>Payable Amount</Text>
            </View>
            <Button
              onPress={() => (getPayableAmount() === 0 ? createBookingHandle() : setShowPaymentModal(true))}
              style={[
                commonStyles.buttonPrimary,
                {
                  width: RfW(144),
                  alignSelf: 'flex-end',
                  marginHorizontal: 0,
                },
              ]}>
              <Text style={commonStyles.textButtonPrimary}>
                {getPayableAmount() === 0 ? 'Create Booking' : 'Pay Now'}
              </Text>
            </Button>
          </View>
        </View>
      ) : (
        <View style={{ flex: 1, paddingTop: RfH(100), alignItems: 'center' }}>
          <Image
            source={Images.empty_cart}
            style={{
              height: RfH(264),
              width: RfW(248),
              marginBottom: RfH(32),
            }}
            resizeMode="contain"
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
          <Button
            onPress={() => setShowAllSubjects(true)}
            style={[
              commonStyles.buttonPrimary,
              {
                alignSelf: 'center',
                marginTop: RfH(64),
                width: RfW(190),
              },
            ]}>
            <Text style={commonStyles.textButtonPrimary}>Start Booking</Text>
          </Button>
        </View>
      )}
      {showPaymentModal && (
        <PaymentMethodModal
          visible={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          bookingData={{ itemPrice: amount, redeemQPoints: parseFloat(qPointsRedeemed) }}
          amount={amount}
          qPointsRedeemed={qPointsRedeemed}
          discount={appliedCouponValue}
          appliedCoupon={appliedCoupon}
          handlePaytmPayment={handlePaytmPayment}
          hidePaymentPopup={() => setShowPaymentModal(false)}
          handleCancelPendingBooking={(orderId) => cancelPendingBooking({ variables: { orderId } })}
          addresses={addresses}
        />
      )}
      {paymentModal && !isEmpty(bookingData) && (
        <CustomModalWebView
          url={`${urlConfig.API_URL}/payment/paytm/startTransaction/${bookingData.uuid}?token=${token}`}
          headerText="Payment"
          modalVisible={paymentModal}
          onNavigationStateChange={handlePaymentAuthorization}
          backButtonHandler={paymentBackButtonHandler}
        />
      )}
      <SelectSubjectModal
        onClose={() => setShowAllSubjects(false)}
        onSelectSubject={gotoTutors}
        visible={showAllSubjects}
      />

      <CouponModal visible={showCouponModal} onClose={() => setShowCouponModal(false)} applyCoupon={applyCoupon} />

      {showCouponAppliedModal && (
        <CouponApplied
          coupon={appliedCoupon}
          couponValue={appliedCouponValue}
          handleClose={() => setShowCouponAppliedModal(false)}
        />
      )}
    </View>
  );
};

export default MyCart;
