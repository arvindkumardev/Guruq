import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView, Modal, Text, TouchableOpacity, View } from 'react-native';
import { Input } from 'native-base';
import { RFValue } from 'react-native-responsive-fontsize';
import { useMutation } from '@apollo/client';
import { Colors, Fonts, Images } from '../../../../theme';
import { alertBox, RfH, RfW } from '../../../../utils/helpers';
import commonStyles from '../../../../theme/styles';
import { IconButtonWrapper, Loader } from '../../../../components';
import { CHECK_COUPON } from '../../booking.mutation';
import { STANDARD_SCREEN_SIZE } from '../../../../utils/constants';

const CouponModal = (props) => {
  const { visible, onClose, applyCoupon } = props;
  const [couponCode, setCouponCode] = useState('');

  const [checkCouponCode, { loading: couponLoading }] = useMutation(CHECK_COUPON, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
        alertBox('Error', error.message);
      } else {
        alertBox('Error', 'Please provide a valid coupon code.');
      }
    },
    onCompleted: (data) => {
      if (data) {
        applyCoupon(data.checkCoupon);
      }
    },
  });

  const checkCoupon = () => {
    console.log(couponCode);
    if (couponCode !== '') {
      checkCouponCode({
        variables: { code: couponCode },
      });
    } else {
      alertBox('Error', 'Please provide the coupon code.');
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={() => {
        onClose(false);
      }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ android: '', ios: 'padding' })} enabled>
        <Loader isLoading={couponLoading} />

        <View style={{ flex: 1, backgroundColor: Colors.black, opacity: 0.8, flexDirection: 'column' }} />
        <View
          style={[
            commonStyles.verticallyStretchedItemsView,
            { backgroundColor: Colors.lightGrey, paddingBottom: RfH(60) },
          ]}>
          <View
            style={{
              backgroundColor: Colors.lightBlue,
              opacity: 0.5,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: RfH(16),
              paddingHorizontal: RfW(16),
            }}>
            <Text style={[commonStyles.headingPrimaryText, { color: Colors.black }]}>APPLY COUPONS</Text>

            <IconButtonWrapper
              iconHeight={RfH(20)}
              iconWidth={RfW(20)}
              iconImage={Images.cross}
              submitFunction={() => onClose(false)}
            />
          </View>

          <View style={{ backgroundColor: Colors.lightGrey }}>
            <View
              style={[
                commonStyles.horizontalChildrenView,
                {
                  borderColor: '#dddddd',
                  borderWidth: 1,
                  backgroundColor: Colors.white,
                  marginHorizontal: RfW(16),
                  marginVertical: RfH(16),
                },
              ]}>
              <Input
                placeholder="Enter Coupon Code"
                onChangeText={(text) => setCouponCode(text)}
                style={{
                  borderRadius: 0,
                  borderColor: '#dddddd',
                  borderWidth: 0,
                  height: RfH(40),
                  paddingLeft: RfW(16),
                  fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
                  fontFamily: Fonts.semiBold,
                }}
              />

              <View>
                <TouchableOpacity
                  style={{ flex: 1, paddingTop: RfH(8), paddingBottom: RfH(8) }}
                  onPress={() => checkCoupon()}>
                  <Text
                    style={{
                      marginLeft: RfW(16),
                      paddingRight: RfW(16),
                      color: Colors.brandBlue2,
                    }}>
                    APPLY
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

CouponModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  applyCoupon: PropTypes.func,
};

CouponModal.defaultProps = {
  visible: false,
  onClose: null,
};

export default CouponModal;
