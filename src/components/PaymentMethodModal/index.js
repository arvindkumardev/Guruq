/* eslint-disable no-use-before-define */
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import analytics from '@react-native-firebase/analytics';

import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'native-base';
import PropTypes from 'prop-types';
import RNRazorpayCheckout from 'react-native-razorpay';
import { useMutation, useReactiveVar } from '@apollo/client';
import { Colors, Fonts, Images } from '../../theme';
import commonStyles from '../../theme/styles';
import { CustomRadioButton, IconButtonWrapper } from '..';
import { alertBox, getFullName, printCurrency, RfH, RfW } from '../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import routeNames from '../../routes/screenNames';
import { userDetails } from '../../apollo/cache';
import { CREATE_BOOKING, MAKE_PAYMENT } from '../../containers/student/booking.mutation';
import Dash from '../Dash';
import { PaymentStatusEnum, OrderStatusEnum, PaymentMethodEnum } from './paymentMethod.enum';

const convenienceCharges = 100;
const PaymentMethod = (props) => {
  const {
    visible,
    onClose,
    bookingData,
    amount,
    discount,
    qPointsRedeemed,
    hidePaymentPopup,
    handlePaytmPayment,
  } = props;

  const navigation = useNavigation();
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethodEnum.ONLINE.value);
  const [bookingDataObj, setBookingDataObj] = useState({});

  const userInfo = useReactiveVar(userDetails);

  const [createNewBooking, { loading: bookingLoading }] = useMutation(CREATE_BOOKING, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        fireLogPaymentEvent('add_payment_info', data);
        setBookingDataObj(data.createBooking);
        switch (paymentMethod) {
          case PaymentMethodEnum.ONLINE.value:
            initiateRazorPayPayment(data.createBooking.id);
            break;
          case PaymentMethodEnum.PAYTM.value:
            handlePaytmPayment(data.createBooking);
            break;
          case PaymentMethodEnum.PAYPAL.value:
            initiatePaypalPayment(data.createBooking.id);
            break;
          case PaymentMethodEnum.CASH.value:
            fireLogPaymentConfirmEvent('booking_confirmed', data.createBooking);
            navigation.navigate(routeNames.STUDENT.BOOKING_CONFIRMED, {
              uuid: data?.createBooking?.uuid,
              paymentMethod,
            });
            break;
          default:
            break;
        }
      }
    },
  });

  const [payment, { loading: paymentLoading }] = useMutation(MAKE_PAYMENT, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        onClose(false);
        if (PaymentStatusEnum.COMPLETE.value) {
          fireLogPaymentConfirmEvent('booking_confirmed', data.makePayment);
          navigation.navigate(routeNames.STUDENT.BOOKING_CONFIRMED, { orderId: bookingDataObj.orderId, paymentMethod });
        }
      }
    },
  });

  const initiateRazorPayPayment = (bookingOrderId) => {
    const options = {
      description: 'Credits towards class booking',
      image:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIgAAABBCAMAAAA9gxwcAAAAAXNSR0IB2cksfwAAAv1QTFRFAAAAKyopLCsq////BIbLB4HDAIzSLi0sJkyIISUlMC8uKiopKyopBH7DKSgnKikoCm2xBXq+Cnu+A4TIHBoZCWmsBIHGBmyxAHzHCAgIAHK56fL3KSgoJCIiApPYAGKxCmSnAILN4uz0AGu3ydzrH0aFIkFUJiUjAY/VIyMiF0GB3OrzAorS0N/sAZXdIVGQ2eXvCzd7+fz9IB8fAG29AVmpAGa0AGOsJiQjHBsbHxwbADWIC1+jKikmB4fLAV6rAUGOIyAf8vf7AT2HAXW8CXS4HlCOJyYlvNDjscrgm73ZKFaTIiIhGFucAXnBKSkpAFSlD3W3GUyMAVSdiKrNAITQKSkoFmGkKikoKSgn3NvaJyYmsc/kCj6DkbDPAEaWxNTk6vD2AHPDpMTdA02WKyopFWqr1ObxvdfpkrfVf7rdDkuQJCAdEzyAXaLPOIvCKysqJSEeJycmP47EXH2rClufjcXkATJ+zOPxDlabcarSGHq6AJztD2erNnauSpLErNXr2t3gIiEgpc/nh7zcV5rJACqBAJTeKCYlMV+YRH6yA3/GLSsqbpjAgKXJKCcmKSgnHIC/Il6cD0OHF3S2SHGkHVeWq8DYZK/aLicjInKxTnaoQGmfeZ3DL4S/nMnkSqnbJyEgW63aKpXOQpzQt8nd3NXLZYaxYZTBd7LXKCcnhcDhN2afA2WlWoCuJxoTAFShFkeJgK7RKm6sAE6ZToe4JyUkJ2aiA0uUA4LIGV6fEDp9VY3BbbTcAXu5dqTJAIPLAY3WH4rHCFygDliWMCEYstvwAITHvuDyAJfgLBsOBGOtCHy95dzXCHCyBEyOMZvRCGaq4NrWxc/hKRsTAYXRAI/WB3W43tnWKhcNOKXbKSgmAYrMzNDR9Obg/fPlBmCeAJXZw8nQaoq0z9XV8ezjAY/VAInQLy8tEmusBmKkzs7O4tfQ2dTRBWu3GJPU493aBWW3AW+zA4XLLBADAEJ94drYAI3c5N3a5t7YMh8PIEeEBU2TACZ3AEqbOGTNtgAAAP90Uk5TAP//////uv/yA//32//k//////8T/////w3//+8w//////////EIVv8m8/////////L/OP////9eGiL//6T///9D//////+Q/////0z+/mn//////7rM/9Os/bn////////////F////////d/L//7Npm////P///////7r+/////6P/////uMD///Ck//9+cv////////////////////+v/////xH///+G//8+/4Uf////Fv/W/zS37vL//yX/hfL/n+v+/z//1NV06V3uX//XGf+Rk837yaP/8F+AmYa25Hr/Q/+jVDTvzSpusOD/8KVY9q/O3Xvht/Cwav+3F/F//QAADR5JREFUeJzFmQVYW8kWx2/uDZsmEKVbQoI8khSLkAaSQNOSQIJLsVegxd2KS4EHVJC6u7t7t1vZ+rq7y9t96y7P9XtnblKItux+dPf/EZs5Z+Y3Z+See8GwX10PfX5z5OmPPnr6jdffO/Pr9z6q66/fUigUfuSfIvizJ38rjptAYCWF4rOHfguM628o/IL9/IJlASAZ+ubnd8sxKFG+4b5Rd75/8bN6oHsHjsPqSZlfcLAfUPi9s2fPO98DC/rt955NS5EzPdgUCoXtsSgVfsa4MxbR4dO3eUWUY4PT85unw4f3CnNlUGsly8dn9sxIgIlsTqA7OgSRpZcUwSB+wL4nYgmQ6qlrMr4MShQ/jVm2eOA4TiGF43mp4TiFzYC+At+l0WY7Dt+DgrOg4bk0nAVdk67wwmks7xAaTmtwcPCFurcxukAhC5bx91QToxJu4QcEy4IV1y2Gk5eYKUZR4A1axbAQnI27O4zQGwzxyRjmw6bgCa2ktXkYjJYY+Gh2AInE2Yy/YCMKanAAv5MkmL9ggYQMy+IAIPF7zmwXxaKRFD55s/N8LIFhe6Dgh1DMY7cD8aFR3AHEwwINL5YHCz5oMRBKykzHmaHgj3tfV8hk1DLEIazbH8DnB3y/RQo/nuAHyKiKZ8lIsxjQmHtCDIQACww/5kMGBK0UbPo9QRALa40vHaOHrMlfjUVSnIPAzDwto8rKtkDXC6LL+GjXBJSR4ekso1Kpt9BaX8FgUxhzx9bk5JkMnMJ4mD5OEEar1YZZ4wLk8ahABZXKj1YBRxmfahE/og5IXgKSYNg54RBZxiIbxwYaTGrCOKfGZm3OcgWC/V1GpUbsJghp+igHInkC1kuZJ1V2GcMq0fDtPBcxYMl4jweEsdemygUIvhd7Q+ZJBuSdCKrnqKhlqGh/mafnn1H0KbRwO0+6O2yXNeMAwdne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',
      currency: 'INR',
      key: 'rzp_test_0kNEbt0JJ60aiz',
      amount: `${amount * 100}`,
      name: getFullName(userInfo),
      prefill: {
        email: userInfo?.email,
        contact: `${userInfo?.phoneNumber?.countryCode}${userInfo?.phoneNumber?.number}`,
        name: getFullName(userInfo),
      },
      theme: { color: '#1E5AA0' },
    };
    RNRazorpayCheckout.open(options)
      .then((data) => {
        completedPayment(bookingOrderId, PaymentStatusEnum.COMPLETE.label, data.razorpay_payment_id);
      })
      .catch((error) => {
        alertBox('Payment Failed', 'Please try again', {
          positiveText: 'Try Again',
          onPositiveClick: () => {
            initiateRazorPayPayment(bookingOrderId);
          },
          negativeText: 'Cancel',
        });
      });
  };

  const initiatePaypalPayment = (bookingOrderId) => {
    // const clientId = 'ATyFhrGwKtQXOl6CctMYjxObRRQeys2xmBUG1uKZvgkCRtzxNdMq75Xu1p9jQiM8ez4dfkOpI9jSrAVJ';
    // const clientSecret = 'EMwjugQJWArgzPjQSMCFFqbGp2md_xmb69tCiGcP_hmdF_K1T8uJcyIUCUN2Mzf43cXAvZwBXiSnJsFy';
    // TODO: use Linking and inappbrowser for PayPal - https://blog.codecentric.de/en/2020/05/paypal-integration-with-react-native/
  };

  const fireLogPaymentEvent = async (eventName, data) => {
    const { id, payableAmount, orderItems, orderPayment } = data.createBooking;
    const payload = {
      orderId: id,
      itemsCount: orderItems,
      paymentMode: orderPayment.paymentMethod,
      payableAmount,
    };
    await analytics().logEvent(eventName, payload);
  };
  const fireLogPaymentConfirmEvent = async (eventName, data) => {
    const { id, payableAmount, orderPayment } = data;
    const payload = {
      orderId: id,
      paymentMode: orderPayment.paymentMethod,
      payableAmount,
    };
    await analytics().logEvent(eventName, payload);
  };
  const renderOrderSummary = () => {
    return (
      <View style={{}}>
        <View style={commonStyles.blankViewSmall} />
        <View
          style={{
            height: RfH(44),
            justifyContent: 'center',
          }}>
          <Text
            style={{
              paddingHorizontal: RfW(16),
              fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
              color: Colors.secondaryText,
            }}>
            PAYMENT SUMMARY
          </Text>
        </View>
        <View style={{ paddingHorizontal: RfW(16), backgroundColor: Colors.white }}>
          <View>
            <View style={[commonStyles.horizontalChildrenSpaceView, { height: 44, alignItems: 'center' }]}>
              <Text
                style={{
                  fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
                  color: Colors.darkGrey,
                }}>
                Sub Total
              </Text>
              <Text
                style={{
                  fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
                  color: Colors.darkGrey,
                  fontFamily: Fonts.semiBold,
                }}>
                ₹{printCurrency(amount)}
              </Text>
            </View>
            {paymentMethod === PaymentMethodEnum.CASH.value && (
              <View style={[commonStyles.horizontalChildrenSpaceView, { height: 44, alignItems: 'center' }]}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={{ fontSize: RFValue(15, STANDARD_SCREEN_SIZE), color: Colors.brandBlue2 }}>
                    Convenience Charges
                  </Text>
                  <Dash dashColor={Colors.brandBlue2} />
                </View>

                <Text
                  style={{
                    fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
                    color: Colors.darkGrey,
                    fontFamily: Fonts.semiBold,
                  }}>
                  ₹{printCurrency(convenienceCharges)}
                </Text>
              </View>
            )}
            {discount !== 0 && (
              <>
                <View style={commonStyles.lineSeparator} />
                <View style={[commonStyles.horizontalChildrenSpaceView, { height: 44, alignItems: 'center' }]}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text
                      style={{
                        fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
                        color: Colors.brandBlue2,
                      }}>
                      Total Discount
                    </Text>
                    <Dash dashColor={Colors.brandBlue2} />
                  </View>

                  <Text
                    style={{
                      fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
                      color: Colors.brandBlue2,
                      fontFamily: Fonts.semiBold,
                    }}>
                    -₹{printCurrency(discount)}
                  </Text>
                </View>
              </>
            )}

            {qPointsRedeemed !== 0 && (
              <>
                <View style={commonStyles.lineSeparator} />
                <View style={[commonStyles.horizontalChildrenSpaceView, { height: 44, alignItems: 'center' }]}>
                  <Text style={{ fontSize: RFValue(15, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
                    Paid by Q points
                  </Text>
                  <Text
                    style={{
                      fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
                      color: Colors.brandBlue2,
                      fontFamily: Fonts.semiBold,
                    }}>
                    -₹{printCurrency(qPointsRedeemed)}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </View>
    );
  };

  const makePayment = () => {
    // bookingData.serviceAddress = { id: 258747 };
    // bookingData.billingAddress = {
    //   type: 6,
    //   fullAddress: 'Dwarka Sector 21',
    //   country: 'India',
    //   state: 'Delhi',
    //   city: 'New Delhi',
    //   subArea: 'CP',
    //   postalCode: 110001,
    // };
    bookingData.convenienceCharges = paymentMethod === PaymentMethodEnum.CASH.value ? convenienceCharges : 0;
    bookingData.orderPayment = { paymentMethod: '', amount: 0 };
    switch (paymentMethod) {
      case PaymentMethodEnum.ONLINE.value:
        bookingData.orderPayment.paymentMethod = PaymentMethodEnum.ONLINE.label;
        break;
      case PaymentMethodEnum.PAYTM.value:
        bookingData.orderPayment.paymentMethod = PaymentMethodEnum.PAYTM.label;
        break;
      case PaymentMethodEnum.PAYPAL.value:
        bookingData.orderPayment.paymentMethod = PaymentMethodEnum.PAYPAL.label;
        break;
      case PaymentMethodEnum.CASH.value:
        bookingData.orderPayment.paymentMethod = PaymentMethodEnum.CASH.label;
        break;
      default:
        break;
    }
    bookingData.orderPayment.amount = amount;
    bookingData.itemPrice = amount;
    bookingData.orderStatus = OrderStatusEnum.PENDING.label;
    bookingData.promotionId = 0;
    hidePaymentPopup();
    createNewBooking({
      variables: { orderCreateDto: bookingData },
    });
  };

  const completedPayment = (orderId, status, transactionData) => {
    const details = {};
    details.orderId = orderId;
    details.paymentStatus = status;
    details.transactionDetails = transactionData;
    switch (paymentMethod) {
      case PaymentMethodEnum.ONLINE.value:
        details.paymentMethod = PaymentMethodEnum.ONLINE.label;
        break;
      case PaymentMethodEnum.PAYTM.value:
        details.paymentMethod = PaymentMethodEnum.PAYTM.label;
        break;
      case PaymentMethodEnum.PAYPAL.value:
        details.paymentMethod = PaymentMethodEnum.PAYPAL.label;
        break;
      default:
        break;
    }

    payment({
      variables: {
        paymentDetails: details,
      },
    });
  };

  return (
    <Modal
      animationType="fade"
      transparent
      backdropOpacity={1}
      visible={visible}
      onRequestClose={() => {
        onClose(false);
      }}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'column' }} />
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
        }}>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={[commonStyles.headingPrimaryText, { marginLeft: RfW(16) }]}>Payment Details</Text>
          <IconButtonWrapper
            iconHeight={RfH(20)}
            iconWidth={RfW(20)}
            styling={{
              alignSelf: 'flex-end',
              marginRight: RfW(16),
              marginTop: RfH(16),
              marginBottom: RfH(16),
            }}
            imageResizeMode="contain"
            iconImage={Images.cross}
            submitFunction={() => onClose(false)}
          />
        </View>

        <View style={{ paddingHorizontal: 0, backgroundColor: Colors.lightGrey }}>
          <View style={commonStyles.blankViewSmall} />
          <View>
            <View style={{ height: RfH(44), justifyContent: 'center' }}>
              <Text
                style={{
                  paddingHorizontal: RfW(16),
                  fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
                  color: Colors.secondaryText,
                }}>
                PAYMENT OPTIONS
              </Text>
            </View>
            <View
              style={{
                paddingVertical: RfH(8),
                paddingHorizontal: RfW(16),
                backgroundColor: Colors.white,
              }}>
              <TouchableOpacity onPress={() => setPaymentMethod(PaymentMethodEnum.ONLINE.value)} activeOpacity={0.8}>
                <View
                  style={[
                    commonStyles.horizontalChildrenView,
                    commonStyles.lineSeparator,
                    { alignItems: 'center', height: RfH(44) },
                  ]}>
                  <CustomRadioButton
                    enabled={paymentMethod === PaymentMethodEnum.ONLINE.value}
                    submitFunction={() => setPaymentMethod(PaymentMethodEnum.ONLINE.value)}
                  />
                  <Text style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE), marginLeft: RfW(8) }}>
                    Online Payment
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setPaymentMethod(PaymentMethodEnum.PAYTM.value)} activeOpacity={0.8}>
                <View
                  style={[
                    commonStyles.horizontalChildrenView,
                    commonStyles.lineSeparator,
                    { alignItems: 'center', height: RfH(44) },
                  ]}>
                  <CustomRadioButton
                    enabled={paymentMethod === PaymentMethodEnum.PAYTM.value}
                    submitFunction={() => setPaymentMethod(PaymentMethodEnum.PAYTM.value)}
                  />
                  <Text style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE), marginLeft: RfW(8) }}>Paytm</Text>
                  <View style={commonStyles.horizontalChildrenView} />
                </View>
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={() => setPaymentMethod(PaymentMethodEnum.PAYPAL.value)}> */}
              {/*  <View */}
              {/*    style={[ */}
              {/*      commonStyles.horizontalChildrenView, */}
              {/*      commonStyles.lineSeparator, */}
              {/*      { alignItems: 'center', height: RfH(44) }, */}
              {/*    ]}> */}
              {/*    <CustomRadioButton */}
              {/*      enabled={paymentMethod === PaymentMethodEnum.PAYPAL.value} */}
              {/*      submitFunction={() => setPaymentMethod(PaymentMethodEnum.PAYPAL.value)} */}
              {/*    /> */}
              {/*    <Text style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE), marginLeft: RfW(8) }}>PayPal</Text> */}
              {/*    <View style={commonStyles.horizontalChildrenView} /> */}
              {/*  </View> */}
              {/* </TouchableOpacity> */}
              <TouchableOpacity onPress={() => setPaymentMethod(PaymentMethodEnum.CASH.value)} activeOpacity={0.8}>
                <View
                  style={[
                    commonStyles.horizontalChildrenView,
                    {
                      alignItems: 'center',
                      height: RfH(44),
                    },
                  ]}>
                  <CustomRadioButton
                    enabled={paymentMethod === PaymentMethodEnum.CASH.value}
                    submitFunction={() => setPaymentMethod(PaymentMethodEnum.CASH.value)}
                  />
                  <Text style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE), marginLeft: RfW(8) }}>Cash</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {renderOrderSummary()}

          <View
            style={[
              commonStyles.horizontalChildrenSpaceView,
              {
                alignItems: 'center',
                backgroundColor: Colors.white,
                paddingTop: RfH(8),
                paddingHorizontal: RfW(16),
                borderTopWidth: RfH(1),
                borderTopColor: Colors.lightGrey,
              },
            ]}>
            <View>
              <Text style={commonStyles.headingPrimaryText}>
                ₹
                {printCurrency(
                  amount +
                    (paymentMethod === PaymentMethodEnum.CASH.value ? convenienceCharges : 0) -
                    discount -
                    qPointsRedeemed
                )}
              </Text>
            </View>
            <View>
              <Button
                onPress={makePayment}
                style={[
                  commonStyles.buttonPrimary,
                  {
                    width: RfW(144),
                    alignSelf: 'flex-end',
                    marginHorizontal: 0,
                  },
                ]}>
                <Text style={commonStyles.textButtonPrimary}>Make Payment</Text>
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

PaymentMethod.defaultProps = {
  visible: false,
  onClose: null,
  bookingData: {},
  amount: 0,
  discount: 0,
  qPointsRedeemed: 0,
  handlePaytmPayment: null,
};

PaymentMethod.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  bookingData: PropTypes.object,
  amount: PropTypes.number,
  discount: PropTypes.number,
  qPointsRedeemed: PropTypes.number,
  hidePaymentPopup: PropTypes.func,
  handlePaytmPayment: PropTypes.func,
};

export default PaymentMethod;
