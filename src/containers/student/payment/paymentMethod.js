import { Alert, NativeEventEmitter, NativeModules, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { Button, Card } from 'native-base';
import RazorpayCheckout from 'react-native-razorpay';
import { useReactiveVar } from '@apollo/client';
import { Colors, Fonts } from '../../../theme';
import commonStyles from '../../../theme/styles';
import { ScreenHeader } from '../../../components';
import { RfH, RfW } from '../../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import routeNames from '../../../routes/screenNames';
import { userDetails } from '../../../apollo/cache';

function PaymentMethod() {
  const navigation = useNavigation();

  const userInfo = useReactiveVar(userDetails);

  console.log(userInfo);

  const initiateRazorPayPayment = () => {
    const options = {
      description: 'Credits towards class booking',
      image:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIgAAABBCAMAAAA9gxwcAAAAAXNSR0IB2cksfwAAAv1QTFRFAAAAKyopLCsq////BIbLB4HDAIzSLi0sJkyIISUlMC8uKiopKyopBH7DKSgnKikoCm2xBXq+Cnu+A4TIHBoZCWmsBIHGBmyxAHzHCAgIAHK56fL3KSgoJCIiApPYAGKxCmSnAILN4uz0AGu3ydzrH0aFIkFUJiUjAY/VIyMiF0GB3OrzAorS0N/sAZXdIVGQ2eXvCzd7+fz9IB8fAG29AVmpAGa0AGOsJiQjHBsbHxwbADWIC1+jKikmB4fLAV6rAUGOIyAf8vf7AT2HAXW8CXS4HlCOJyYlvNDjscrgm73ZKFaTIiIhGFucAXnBKSkpAFSlD3W3GUyMAVSdiKrNAITQKSkoFmGkKikoKSgn3NvaJyYmsc/kCj6DkbDPAEaWxNTk6vD2AHPDpMTdA02WKyopFWqr1ObxvdfpkrfVf7rdDkuQJCAdEzyAXaLPOIvCKysqJSEeJycmP47EXH2rClufjcXkATJ+zOPxDlabcarSGHq6AJztD2erNnauSpLErNXr2t3gIiEgpc/nh7zcV5rJACqBAJTeKCYlMV+YRH6yA3/GLSsqbpjAgKXJKCcmKSgnHIC/Il6cD0OHF3S2SHGkHVeWq8DYZK/aLicjInKxTnaoQGmfeZ3DL4S/nMnkSqnbJyEgW63aKpXOQpzQt8nd3NXLZYaxYZTBd7LXKCcnhcDhN2afA2WlWoCuJxoTAFShFkeJgK7RKm6sAE6ZToe4JyUkJ2aiA0uUA4LIGV6fEDp9VY3BbbTcAXu5dqTJAIPLAY3WH4rHCFygDliWMCEYstvwAITHvuDyAJfgLBsOBGOtCHy95dzXCHCyBEyOMZvRCGaq4NrWxc/hKRsTAYXRAI/WB3W43tnWKhcNOKXbKSgmAYrMzNDR9Obg/fPlBmCeAJXZw8nQaoq0z9XV8ezjAY/VAInQLy8tEmusBmKkzs7O4tfQ2dTRBWu3GJPU493aBWW3AW+zA4XLLBADAEJ94drYAI3c5N3a5t7YMh8PIEeEBU2TACZ3AEqbOGTNtgAAAP90Uk5TAP//////uv/yA//32//k//////8T/////w3//+8w//////////EIVv8m8/////////L/OP////9eGiL//6T///9D//////+Q/////0z+/mn//////7rM/9Os/bn////////////F////////d/L//7Npm////P///////7r+/////6P/////uMD///Ck//9+cv////////////////////+v/////xH///+G//8+/4Uf////Fv/W/zS37vL//yX/hfL/n+v+/z//1NV06V3uX//XGf+Rk837yaP/8F+AmYa25Hr/Q/+jVDTvzSpusOD/8KVY9q/O3Xvht/Cwav+3F/F//QAADR5JREFUeJzFmQVYW8kWx2/uDZsmEKVbQoI8khSLkAaSQNOSQIJLsVegxd2KS4EHVJC6u7t7t1vZ+rq7y9t96y7P9XtnblKItux+dPf/EZs5Z+Y3Z+See8GwX10PfX5z5OmPPnr6jdffO/Pr9z6q66/fUigUfuSfIvizJ38rjptAYCWF4rOHfguM628o/IL9/IJlASAZ+ubnd8sxKFG+4b5Rd75/8bN6oHsHjsPqSZlfcLAfUPi9s2fPO98DC/rt955NS5EzPdgUCoXtsSgVfsa4MxbR4dO3eUWUY4PT85unw4f3CnNlUGsly8dn9sxIgIlsTqA7OgSRpZcUwSB+wL4nYgmQ6qlrMr4MShQ/jVm2eOA4TiGF43mp4TiFzYC+At+l0WY7Dt+DgrOg4bk0nAVdk67wwmks7xAaTmtwcPCFurcxukAhC5bx91QToxJu4QcEy4IV1y2Gk5eYKUZR4A1axbAQnI27O4zQGwzxyRjmw6bgCa2ktXkYjJYY+Gh2AInE2Yy/YCMKanAAv5MkmL9ggYQMy+IAIPF7zmwXxaKRFD55s/N8LIFhe6Dgh1DMY7cD8aFR3AHEwwINL5YHCz5oMRBKykzHmaHgj3tfV8hk1DLEIazbH8DnB3y/RQo/nuAHyKiKZ8lIsxjQmHtCDIQACww/5kMGBK0UbPo9QRALa40vHaOHrMlfjUVSnIPAzDwto8rKtkDXC6LL+GjXBJSR4ekso1Kpt9BaX8FgUxhzx9bk5JkMnMJ4mD5OEEar1YZZ4wLk8ahABZXKj1YBRxmfahE/og5IXgKSYNg54RBZxiIbxwYaTGrCOKfGZm3OcgWC/V1GpUbsJghp+igHInkC1kuZJ1V2GcMq0fDtPBcxYMl4jweEsdemygUIvhd7Q+ZJBuSdCKrnqKhlqGh/mafnn1H0KbRwO0+6O2yXNeMAwdne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',
      currency: 'INR',
      key: 'rzp_test_0kNEbt0JJ60aiz',
      amount: '500',
      name: `${userInfo?.firstName} ${userInfo?.lastName}`,
      prefill: {
        email: userInfo?.email,
        contact: `${userInfo?.phoneNumber?.countryCode}${userInfo?.phoneNumber?.number}`,
        name: `${userInfo?.firstName} ${userInfo?.lastName}`,
      },
      theme: { color: '#1E5AA0' },
    };
    RazorpayCheckout.open(options)
      .then((data) => {
        // handle success
        Alert.alert(`Success: ${data.razorpay_payment_id}`);
        console.log(data);

        // create booking - with payment completed
      })
      .catch((error) => {
        // handle failure
        console.log(`Error: ${error.code} | ${error.description}`);
        console.log(error);

        // create booking - with cancelled payment
      });
  };

  const initiatePaytmPayment = async () => {
    const response = await fetch('http://localhost:5000/payment/initiatePaytmTransaction', {
      method: 'GET',
    });

    const data = await response.json();
    //
    // .then((response) => response.json())
    // .then((data) => {
    // const { checksum } = response;

    console.log(data);

    const AllInOneSDKPlugin = NativeModules.AllInOneSDKSwiftWrapper;

    const { mid } = data.paytmParams.body;
    const { orderId } = data.paytmParams.body;
    const { txnToken } = data.body;
    const amount = data.paytmParams.body.txnAmount.value;
    const callback = `https://securegw.paytm.in/theia/paytmCallback?ORDER_ID=${orderId}`;
    const isStaging = true;

    console.log('-------------------------open Native--------', NativeModules);
    const result = AllInOneSDKPlugin.openPaytm(mid, orderId, txnToken, amount, callback, isStaging);

    console.log(result);

    // instantiate the event emitter
    const CounterEvents = new NativeEventEmitter(NativeModules.AllInOneSDKSwiftWrapper);

    // subscribe to event
    CounterEvents.addListener(
      'responseIfNotInstalled',
      // cf(res)
      (res) => console.log('response received from paytm event', JSON.stringify(res))
      // console.log("response received from paytm event", res)
    );
    CounterEvents.addListener('responseIfPaytmInstalled', (res) => console.log(JSON.stringify(res)));
  };

  const initiatePaypalPayment = () => {
    const clientId = 'ATyFhrGwKtQXOl6CctMYjxObRRQeys2xmBUG1uKZvgkCRtzxNdMq75Xu1p9jQiM8ez4dfkOpI9jSrAVJ';
    const clientSecret = 'EMwjugQJWArgzPjQSMCFFqbGp2md_xmb69tCiGcP_hmdF_K1T8uJcyIUCUN2Mzf43cXAvZwBXiSnJsFy';

    // TODO: use Linking and inappbrowser for PayPal - https://blog.codecentric.de/en/2020/05/paypal-integration-with-react-native/
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white }]}>
      <ScreenHeader homeIcon label="Payment" />
      <View style={{ height: RfH(44) }} />
      <Card style={{ borderRadius: 8, paddingHorizontal: RfW(8), paddingVertical: RfH(16) }}>
        <Text style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE), fontFamily: Fonts.semiBold }}>Payment Summary</Text>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(8) }]}>
          <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>Amount</Text>
          <Text
            style={{
              fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
              color: Colors.darkGrey,
              fontFamily: Fonts.semiBold,
            }}>
            ₹900
          </Text>
        </View>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>Taxes</Text>
          <Text
            style={{
              fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
              color: Colors.darkGrey,
              fontFamily: Fonts.semiBold,
            }}>
            ₹99
          </Text>
        </View>
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: Colors.darkGrey, marginTop: RfH(8) }} />
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(8) }]}>
          <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), fontFamily: Fonts.semiBold }}>
            Total Amount Payable
          </Text>
          <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), fontFamily: Fonts.semiBold }}>₹999</Text>
        </View>
      </Card>
      <View style={{ height: RfH(56) }} />
      <View>
        <Text style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE), fontFamily: Fonts.semiBold }}>Payment Options</Text>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(24) }]}>
          <TouchableOpacity onPress={() => initiateRazorPayPayment()}>
            <Text style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE) }}>Online Payment</Text>
            {/* <View style={commonStyles.horizontalChildrenView}> */}
            {/*  <IconButtonWrapper */}
            {/*    iconHeight={RfH(16)} */}
            {/*    iconWidth={RfW(16)} */}
            {/*    iconImage={Images.white_plus_with_blue_back} */}
            {/*  /> */}
            {/*  <Text style={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), color: Colors.brandBlue2 }}> */}
            {/*    Add New Card */}
            {/*  </Text> */}
            {/* </View> */}
          </TouchableOpacity>
        </View>
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: Colors.darkGrey, marginVertical: RfH(16) }} />
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <TouchableOpacity onPress={() => initiatePaytmPayment()}>
            <Text style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE) }}>Paytm</Text>
            <View style={commonStyles.horizontalChildrenView} />
          </TouchableOpacity>
        </View>

        <View style={{ borderBottomWidth: 0.5, borderBottomColor: Colors.darkGrey, marginVertical: RfH(16) }} />
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <TouchableOpacity onPress={() => initiatePaypalPayment()}>
            <Text style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE) }}>PayPal</Text>
            <View style={commonStyles.horizontalChildrenView} />
          </TouchableOpacity>
        </View>

        {/* <View style={{ borderBottomWidth: 0.5, borderBottomColor: Colors.darkGrey, marginVertical: RfH(16) }} /> */}
        {/* <View style={commonStyles.horizontalChildrenSpaceView}> */}
        {/*  <Text style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE) }}>UPI</Text> */}
        {/*  <IconButtonWrapper iconHeight={RfH(24)} iconWidth={RfW(24)} iconImage={Images.expand_gray} /> */}
        {/* </View> */}
        {/* <View style={{ borderBottomWidth: 0.5, borderBottomColor: Colors.darkGrey, marginVertical: RfH(16) }} /> */}
        {/* <View style={commonStyles.horizontalChildrenSpaceView}> */}
        {/*  <Text style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE) }}>Net Banking</Text> */}
        {/*  <IconButtonWrapper iconHeight={RfH(24)} iconWidth={RfW(24)} iconImage={Images.expand_gray} /> */}
        {/* </View> */}
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: Colors.darkGrey, marginVertical: RfH(16) }} />
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE) }}>Cash</Text>
        </View>
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: Colors.darkGrey, marginVertical: RfH(16) }} />
      </View>
      <View>
        <Button onPress={() => navigation.navigate(routeNames.STUDENT.BOOKING_CONFIRMED)}>
          <Text>Confirm</Text>
        </Button>
      </View>
    </View>
  );
}

export default PaymentMethod;
