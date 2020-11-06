import React from 'react';
import { Platform, TouchableOpacity, Text } from 'react-native';
import Paytm from '@philly25/react-native-paytm';

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
  UNSAFE_componentWillMount() {
    Paytm.addListener(Paytm.Events.PAYTM_RESPONSE, this.onPayTmResponse);
  }

  componentWillUnmount() {
    Paytm.removeListener(Paytm.Events.PAYTM_RESPONSE, this.onPayTmResponse);
  }

  onPayTmResponse = (resp) => {
    console.log('I am here...resp', resp);
    const { STATUS, status, response } = resp;

    if (Platform.OS === 'ios') {
      if (status === 'Success') {
        const jsonResponse = JSON.parse(response);
        const { STATUS } = jsonResponse;

        if (STATUS && STATUS === 'TXN_SUCCESS') {
          // Payment succeed!
        }
      }
    } else if (STATUS && STATUS === 'TXN_SUCCESS') {
      // Payment succeed!
    }
  };

  runTransaction = (amount, customerId, orderId, mobile, email, checkSum, mercUnqRef) => {
    // const callbackUrl = `${paytmConfig.callback_url}${orderId}`;

    console.log('running...runTransaction');

    fetch('http://localhost:5000/payment/initiateTransaction', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        // const { checksum } = response;

        console.log(data);

        const details = {
          // mode: 'Staging',
          mid: data.MID,
          channel: data.CHANNEL_ID,
          industryType: data.INDUSTRY_TYPE_ID,
          website: data.WEBSITE,
          amount: data.TXN_AMOUNT,
          orderId: data.ORDER_ID,
          email: data.EMAIL,
          phone: data.MOBILE_NO,
          custId: data.CUST_ID,
          callback: data.CALLBACK_URL,
          checksumhash: data.checksum,
          // MERC_UNQ_REF: mercUnqRef, // optional
        };
        //
        // console.log(details);
        // console.log('response.body', response.paytmParams);

        // const details = {
        //   ...response.body,
        //   checksumhash: response.checksumhash,
        //   checksum: response.checksumhash,
        //   callback: `${paytmConfig.callback_url}${response.paytmParams.body.orderId}`,
        // mode: 'Staging',
        // };

        console.log('details', details);

        Paytm.startPayment(details);
        // })
        // .catch((error) => {
        //   console.error(error);
      });
  };

  render() {
    return (
      <TouchableOpacity onPress={() => this.runTransaction()}>
        <Text>Pay using Paytm</Text>
      </TouchableOpacity>
    );
  }
}
