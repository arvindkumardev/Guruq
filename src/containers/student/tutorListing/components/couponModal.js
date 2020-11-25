import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, View, Text, TouchableWithoutFeedback } from 'react-native';
import { Item, Input } from 'native-base';
import { RFValue } from 'react-native-responsive-fontsize';
import { useMutation } from '@apollo/client';
import { Colors, Fonts, Images } from '../../../../theme';
import { RfH, RfW } from '../../../../utils/helpers';
import commonStyles from '../../../../theme/styles';
import { IconButtonWrapper } from '../../../../components';
import styles from '../styles';
import { CHECK_COUPON } from '../../booking.mutation';
import { STANDARD_SCREEN_SIZE } from '../../../../utils/constants';

const qPointPayModal = (props) => {
  const { visible, onClose, availableCoupons, checkCoupon } = props;
  const [couponCode, setCouponCode] = useState('');

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={() => {
        onClose(false);
      }}>
      <View style={{ flex: 1, backgroundColor: Colors.black, opacity: 0.8, flexDirection: 'column' }} />
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
          paddingBottom: RfH(34),
        }}>
        <View
          style={{
            backgroundColor: Colors.lightBlue,
            opacity: 0.5,
          }}>
          <IconButtonWrapper
            iconHeight={RfH(24)}
            iconWidth={RfW(24)}
            styling={{ alignSelf: 'flex-end', marginVertical: RfH(16), marginRight: RfW(16) }}
            iconImage={Images.cross}
            submitFunction={() => onClose(false)}
          />
          <View style={[commonStyles.horizontalChildrenView, { marginHorizontal: RfW(16), marginBottom: RfH(8) }]}>
            <Item underline={false} style={{ flex: 1 }}>
              <Input
                placeholder="Enter Coupon Code"
                onChangeText={(text) => setCouponCode(text)}
                style={{
                  backgroundColor: Colors.white,
                  borderRadius: 8,
                  height: RfH(40),
                  fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
                }}
              />
            </Item>
            <View>
              <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => checkCoupon(couponCode)}>
                <Text
                  style={{
                    marginLeft: RfW(16),
                    color: Colors.brandBlue2,
                  }}>
                  APPLY
                </Text>
              </TouchableWithoutFeedback>
            </View>
          </View>

          <View
            style={{
              backgroundColor: Colors.darkGrey,
              paddingHorizontal: RfW(16),
              height: RfH(48),
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <Text style={{ color: Colors.black }}>Available Coupons</Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: RfW(16), marginTop: RfH(16) }}>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={commonStyles.headingPrimaryText}>GURUQ</Text>
          </View>
          <Text style={{ marginTop: RfH(16), color: Colors.darkGrey }}>Get 20% off</Text>
          <Text style={{ color: Colors.darkGrey, fontSize: RFValue(12, STANDARD_SCREEN_SIZE) }}>
            Valid till 1 of april.
          </Text>
          <View style={[commonStyles.borderBottom, { marginVertical: RfH(16) }]} />
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text
              style={[
                commonStyles.mediumPrimaryText,
                {
                  backgroundColor: Colors.lightBlue,
                  padding: RfH(8),
                  borderWidth: 1,
                  borderColor: Colors.brandBlue2,
                  borderStyle: 'solid',
                  borderRadius: 1,
                },
              ]}>
              GURUQ
            </Text>
            <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => checkCoupon()}>
              <Text style={[commonStyles.smallPrimaryText, { color: Colors.brandBlue2 }]}>APPLY</Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={[commonStyles.borderBottom, { marginVertical: RfH(16) }]} />
        </View>
      </View>
    </Modal>
  );
};

qPointPayModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  availableCoupons: PropTypes.array,
  checkCoupon: PropTypes.func,
};

qPointPayModal.defaultProps = {
  visible: false,
  onClose: null,
  availableCoupons: [],
  checkCoupon: null,
};

export default qPointPayModal;
