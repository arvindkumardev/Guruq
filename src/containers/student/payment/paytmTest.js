import React from 'react';
import { Platform, TouchableOpacity, Text, NativeModules, NativeEventEmitter } from 'react-native';

// Data received from PayTM
const paytmConfig = {
  mid: 'MAndJE08510053061154',
  key: '1pIkurADO8n02&DG',
  website: 'WEBSTAGING',
  channel_id: 'WAP',
  industry_type: 'Retail',
  callback_url: 'https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=',
};

export default class PaytmTest extends React.Component {
  // UNSAFE_componentWillMount() {
  //   Paytm.addListener(Paytm.Events.PAYTM_RESPONSE, this.onPayTmResponse);
  // }
  //
  // componentWillUnmount() {
  //   Paytm.removeListener(Paytm.Events.PAYTM_RESPONSE, this.onPayTmResponse);
  // }
  //
  // onPayTmResponse = (resp) => {
  //   console.log('I am here...resp', resp);
  //   const { STATUS, status, response } = resp;
  //
  //   if (Platform.OS === 'ios') {
  //     if (status === 'Success') {
  //       const jsonResponse = JSON.parse(response);
  //       const { STATUS } = jsonResponse;
  //
  //       if (STATUS && STATUS === 'TXN_SUCCESS') {
  //         // Payment succeed!
  //       }
  //     }
  //   } else if (STATUS && STATUS === 'TXN_SUCCESS') {
  //     // Payment succeed!
  //   }
  // };

  runTransaction = async () => {

    //
    // const details = {
    //   mode: 'Staging',
    //   MID: data.MID,
    //   CHANNEL_ID: data.CHANNEL_ID,
    //   INDUSTRY_TYPE_ID: data.INDUSTRY_TYPE_ID,
    //   WEBSITE: data.WEBSITE,
    //   TXN_AMOUNT: data.TXN_AMOUNT,
    //   ORDER_ID: data.ORDER_ID,
    //   // EMAIL: data.EMAIL,
    //   // MOBILE_NO: data.MOBILE_NO,
    //   CUST_ID: data.CUST_ID,
    //   CALLBACK_URL: data.CALLBACK_URL,
    //   CHECKSUMHASH: data.checksum,
    // };
    // //
    // // console.log(details);
    // // console.log('response.body', response.paytmParams);
    //
    // // const details = {
    // //   ...response.body,
    // //   checksumhash: response.checksumhash,
    // //   checksum: response.checksumhash,
    // //   callback: `${paytmConfig.callback_url}${response.paytmParams.body.orderId}`,
    // // mode: 'Staging',
    // // };
    //
    // console.log('details', details);
    //
    // Paytm.startPayment(details);
    // // })
    // // .catch((error) => {
    // //   console.error(error);
    // // });
  };

  render() {
    return (
      <TouchableOpacity onPress={() => this.runTransaction()}>
        <Text>Pay using Paytm</Text>
      </TouchableOpacity>
    );
  }
}
