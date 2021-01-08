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
import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import { sum, isEmpty } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import { IconButtonWrapper, Loader, PaymentMethodModal, ScreenHeader, TutorImageComponent } from '../../../components';
import { Colors, Fonts, Images } from '../../../theme';
import commonStyles from '../../../theme/styles';
import styles from '../tutorListing/styles';
import { alertBox, getFullName, getToken, printCurrency, RfH, RfW } from '../../../utils/helpers';
import { API_URL, STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { GET_CART_ITEMS } from '../booking.query';
import { ADD_TO_CART, CREATE_BOOKING, REMOVE_CART_ITEM } from '../booking.mutation';
import { GET_MY_QPOINTS_BALANCE } from '../../common/graphql-query';
import CustomModalWebView from '../../../components/CustomModalWebView';
import { OrderStatusEnum, PaymentMethodEnum } from '../../../components/PaymentMethodModal/paymentMethod.enum';
import { userDetails } from '../../../apollo/cache';
import NavigationRouteNames from '../../../routes/screenNames';

const MyCart = () => {
  // const [showQPointPayModal, setShowQPointPayModal] = useState(false);
  // const [showCouponModal, setShowCouponModal] = useState(false);
  const navigation = useNavigation();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cartEmpty, setCartEmpty] = useState(false);
  const [amount, setAmount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [qPoints, setQPoints] = useState(0);
  const [qPointsRedeemed, setQPointsRedeemed] = useState(0);
  const [applyQPoints, setApplyQPoints] = useState(false);
  const [token, setToken] = useState();

  const [paymentModal, setPaymentModal] = useState(false);
  const [bookingData, setBookingData] = useState({});
  const userInfo = useReactiveVar(userDetails);
  const [paymentStatus, setPaymentStatus] = useState('success');

  // const [applyCoupons, setApplyCoupons] = useState(false);
  // const [appliedCouponCode, setAppliedCouponCode] = useState('');
  // const [appliedCouponValue, setAppliedCouponValue] = useState(0);

  // const [couponCode, setCouponCode] = useState('');

  const [getCartItems, { loading: cartLoading }] = useLazyQuery(GET_CART_ITEMS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
        console.log(error);
      }
    },
    onCompleted: (data) => {
      if (data) {
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
  // const { loading: cartLoading, error: cartError, data: cartItemData } = useQuery(GET_CART_ITEMS, {
  //   fetchPolicy: 'no-cache',
  // });

  const [createNewBooking, { loading: bookingLoading }] = useMutation(CREATE_BOOKING, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
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
    bookingData.promotionId = 0;
    createNewBooking({
      variables: { orderCreateDto: bookingData },
    });
  };

  const [getMyQpointBalance, { loading: loadingPointsBalance }] = useLazyQuery(GET_MY_QPOINTS_BALANCE, {
    fetchPolicy: 'no-cache',
    variables: { searchDto: { userId: userInfo?.id } },
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
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
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        getCartItems();
      }
    },
  });

  useEffect(() => {
    getCartItems();
    getMyQpointBalance();
  }, []);

  useEffect(() => {
    getToken().then((tk) => {
      setToken(tk);
    });
  }, []);

  // useEffect(() => {
  //   if (cartItemData) {
  //     if (cartItemData?.getCartItems.length > 0) {
  //       setCartItems(cartItemData.getCartItems);
  //       setAmount(sum(cartItemData.getCartItems.map((item) => item.price)));
  //       setIsEmpty(false);
  //     } else {
  //       setIsEmpty(true);
  //     }
  //   }
  // }, [cartItemData?.getCartItems]);

  // useEffect(() => {
  //   if (userData) {
  //     setQPoints(userData.me.qPoints);
  //   }
  // }, [userData]);

  // const [checkCouponCode, { loading: couponLoading }] = useMutation(CHECK_COUPON, {
  //   fetchPolicy: 'no-cache',
  //   onError: (e) => {
  //     if (e.graphQLErrors && e.graphQLErrors.length > 0) {
  //       const error = e.graphQLErrors[0].extensions.exception.response;
  //     }
  //   },
  //   onCompleted: (data) => {
  //     if (data) {
  //       if (!data.checkCoupon.isPercentage) {
  //         if (data.checkCoupon.maxDiscount >= data.checkCoupon.discount) {
  //           setAppliedCouponValue(data.checkCoupon.discount);
  //         } else {
  //           setAppliedCouponValue(data.checkCoupon.maxDiscount);
  //         }
  //       } else {
  //         let discountedAmount = 0;
  //         discountedAmount = (amount * data.checkCoupon.discount) / 100;
  //         if (data.checkCoupon.maxDiscount >= discountedAmount) {
  //           setAppliedCouponValue(discountedAmount);
  //         } else {
  //           setAppliedCouponValue(data.checkCoupon.maxDiscount);
  //         }
  //       }
  //       setAppliedCouponCode(data.checkCoupon.code);
  //       setApplyCoupons(true);
  //     }
  //   },
  // });
  //
  // const checkCoupon = () => {
  //   if (couponCode !== '') {
  //     checkCouponCode({
  //       variables: { code: couponCode },
  //     });
  //   } else {
  //     alertBox('Error', 'Please provide the coupon code');
  //   }
  // };

  const [removeItem, { loading: removeLoading }] = useMutation(REMOVE_CART_ITEM, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        getCartItems();
      }
    },
  });

  const enableApplyQPoints = () => {
    setApplyQPoints(!applyQPoints);
    setQPointsRedeemed(0);
  };

  const handlePaytmPayment = (bookingData) => {
    setShowPaymentModal(false);
    setPaymentModal(true);
    setBookingData(bookingData);
    // console.log('bookingId', bookingId);
    // setPaymentUrl(`http://apiv2.guruq.in/api/payment/paytm/startTransaction/${bookingId}`);
  };

  console.log('bookingData', bookingData);
  useEffect(() => {
    if (!paymentModal && paymentStatus === 'failure') {
      alertBox('Transaction Failed', 'Please try again', {
        positiveText: 'Try Again',
        onPositiveClick: () => {
          setPaymentModal(true);
          setPaymentStatus('');
        },
        negativeText: 'Cancel',
      });
    }
  }, [paymentModal]);

  const handlePaymentAuthorization = async (event) => {
    if (event.url.indexOf('http://dashboardv2.guruq.in/booking/confirmation') > -1) {
      setPaymentStatus('success');
      setPaymentModal(false);
      navigation.navigate(NavigationRouteNames.STUDENT.BOOKING_CONFIRMED, {
        orderId: bookingData.orderId,
        paymentMethod: PaymentMethodEnum.PAYTM.value,
      });
      setBookingData({});
    } else if (event.url.indexOf('http://dashboardv2.guruq.in/booking/failure') > -1) {
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
          onPress: () =>
            removeItem({
              variables: { cartItemId: item.id },
            }),
        },
      ],
      { cancelable: false }
    );
  };

  const addClass = (item) => {
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
            onPress: () => removeClassItem(item),
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
              <TouchableWithoutFeedback onPress={() => removeClass(item)}>
                <View style={{ paddingHorizontal: RfW(16), paddingVertical: RfH(10) }}>
                  <IconButtonWrapper iconWidth={RfW(12)} iconHeight={RfH(12)} iconImage={Images.minus_blue} />
                </View>
              </TouchableWithoutFeedback>
              <Text style={commonStyles.headingPrimaryText}>{item?.count}</Text>
              <TouchableWithoutFeedback onPress={() => addClass(item)}>
                <View style={{ paddingHorizontal: RfW(16), paddingVertical: RfH(10) }}>
                  <IconButtonWrapper iconWidth={RfW(12)} iconHeight={RfH(12)} iconImage={Images.plus_blue} />
                </View>
              </TouchableWithoutFeedback>
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
              {item?.onlineClass ? 'Online' : 'Offline'} {item.groupSize === 1 ? 'Individual' : 'Group'} Class
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
    if (val <= qPoints) {
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
              height: RfH(44),
              alignItems: 'center',
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
              Apply Q Points
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

  const getPayableAmount = () => {
    return amount - qPointsRedeemed;
  };

  const renderCartDetails = () => (
    <View style={{ backgroundColor: Colors.white, paddingHorizontal: RfW(16) }}>
      <View style={[commonStyles.horizontalChildrenSpaceView, { height: RfH(44), alignItems: 'center' }]}>
        <Text style={commonStyles.mediumPrimaryText}>Sub Total</Text>
        <Text style={commonStyles.mediumPrimaryText}>₹{printCurrency(amount)}</Text>
      </View>
      {/* {applyCoupons && ( */}
      {/*  <View> */}
      {/*    <View style={commonStyles.lineSeparator} /> */}
      {/*    <View style={[commonStyles.horizontalChildrenSpaceView, { height: RfH(44), alignItems: 'center' }]}> */}
      {/*      <Text style={commonStyles.mediumPrimaryText}>{appliedCouponCode}</Text> */}
      {/*      <Text style={[commonStyles.mediumPrimaryText, { color: Colors.brandBlue2 }]}>-₹{appliedCouponValue}</Text> */}
      {/*    </View> */}
      {/*  </View> */}
      {/* )} */}

      {qPointsRedeemed !== 0 && (
        <>
          <View style={commonStyles.lineSeparator} />
          <View style={[commonStyles.horizontalChildrenSpaceView, { height: RfH(44), alignItems: 'center' }]}>
            <Text style={[commonStyles.mediumPrimaryText, { color: Colors.darkGrey }]}>Paid by Q points</Text>
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
      <Loader isLoading={cartLoading || removeLoading || addTocartLoading || bookingLoading} />
      <ScreenHeader label="My Cart" labelStyle={{ justifyContent: 'center' }} homeIcon horizontalPadding={16} />
      {!cartEmpty ? (
        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ paddingHorizontal: RfW(16), paddingVertical: RfH(16), backgroundColor: Colors.white }}>
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

            {/* {renderCouponView()} */}

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
        </View>
      )}

      {/* <QPointPayModal */}
      {/*  visible={showQPointPayModal} */}
      {/*  onClose={() => setShowQPointPayModal(false)} */}
      {/*  amount={amount} */}
      {/*  deductedAgaintQPoint={qPoints} */}
      {/*  totalAmount={amount} */}
      {/*  qPoint={qPoints} */}
      {/*  amountToPayAfterQPoint={amount - qPoints} */}
      {/*  onPayNow={() => createBooking()} */}
      {/* /> */}
      {/* <CouponModal */}
      {/*  visible={showCouponModal} */}
      {/*  onClose={() => setShowCouponModal(false)} */}
      {/*  checkCoupon={(couponCode) => checkCoupon(couponCode)} */}
      {/* /> */}
      <PaymentMethodModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        bookingData={{ itemPrice: amount, redeemQPoints: parseFloat(qPointsRedeemed) }}
        amount={amount}
        qPointsRedeemed={qPointsRedeemed}
        handlePaytmPayment={handlePaytmPayment}
        // discount={appliedCouponValue}
        hidePaymentPopup={() => setShowPaymentModal(false)}
      />
      {paymentModal && !isEmpty(bookingData) && (
        <CustomModalWebView
          url={`${API_URL}/payment/paytm/startTransaction/${bookingData.uuid}?token=${token}`}
          headerText="Payment"
          modalVisible={paymentModal}
          onNavigationStateChange={handlePaymentAuthorization}
          backButtonHandler={paymentBackButtonHandler}
        />
      )}
    </View>
  );
};

export default MyCart;
