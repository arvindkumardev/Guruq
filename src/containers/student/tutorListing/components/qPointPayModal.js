import React from 'react';
import PropTypes from 'prop-types';
import { Modal, View, Text } from 'react-native';
import { Button } from 'native-base';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors, Fonts, Images } from '../../../../theme';
import { RfH, RfW } from '../../../../utils/helpers';
import commonStyles from '../../../../theme/styles';
import { IconButtonWrapper } from '../../../../components';
import styles from '../styles';
import { STANDARD_SCREEN_SIZE } from '../../../../utils/constants';

const qPointPayModal = (props) => {
  const {
    visible,
    onClose,
    amount,
    deductedAgaintQPoint,
    totalAmount,
    amountToPayAfterQPoint,
    onPayNow,
    qPoint,
  } = props;

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={() => {
        onClose(false);
      }}>
      <View style={{ flex: 1, backgroundColor: Colors.black, opacity: 0.5, flexDirection: 'column' }} />
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
        <IconButtonWrapper
          iconHeight={RfH(20)}
          iconWidth={RfW(20)}
          styling={{ alignSelf: 'flex-end', marginRight: RfW(16), marginTop: RfH(16) }}
          iconImage={Images.cross}
          submitFunction={() => onClose(false)}
        />
        <View
          style={[
            commonStyles.horizontalChildrenSpaceView,
            {
              borderBottomWidth: 0.5,
              borderColor: Colors.darkGrey,
              paddingVertical: RfH(16),
              marginHorizontal: RfW(16),
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
          <View>
            <Text
              style={[
                styles.compareTutorName,
                {
                  fontFamily: 'SegoeUI-Bold',
                  color: Colors.orange,
                  marginTop: 0,
                },
              ]}>
              {qPoint}
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontSize: RFValue(10, STANDARD_SCREEN_SIZE),
            color: Colors.darkGrey,
            alignSelf: 'flex-end',
            marginRight: RfW(16),
            marginTop: RfH(-20),
          }}>
          Redeem
        </Text>
        <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), fontFamily: Fonts.semiBold, margin: RfH(16) }}>
          CART DETAILS (4 Items)
        </Text>
        <View style={{ marginHorizontal: RfW(16) }}>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={styles.tutorDetails}>Amount</Text>
            <Text style={styles.tutorDetails}>₹{amount}</Text>
          </View>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={styles.tutorDetails}>Paid by Q points</Text>
            <Text style={styles.tutorDetails}>₹{deductedAgaintQPoint}</Text>
          </View>
          <View style={[commonStyles.borderBottom, { marginVertical: RfH(16) }]} />
          <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(16) }]}>
            <Text
              style={{
                fontFamily: Fonts.bold,
                fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
              }}>
              To Pay
            </Text>
            <Text
              style={{
                fontFamily: Fonts.bold,
                fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
              }}>
              ₹{totalAmount - deductedAgaintQPoint}
            </Text>
          </View>
        </View>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginHorizontal: RfW(16) }]}>
          <View style={{ marginTop: RfH(30) }}>
            <Text style={styles.buttonText}>₹{amountToPayAfterQPoint}</Text>
            <Text style={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), color: Colors.brandBlue2 }}>View Details</Text>
          </View>
          <View style={{ marginTop: RfH(30) }}>
            <Button
              onPress={() => onPayNow()}
              style={[commonStyles.buttonPrimary, { width: RfW(144), alignSelf: 'flex-end', marginHorizontal: 0 }]}>
              <Text style={commonStyles.textButtonPrimary}>Pay Now</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

qPointPayModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  amount: PropTypes.number,
  deductedAgaintQPoint: PropTypes.number,
  totalAmount: PropTypes.number,
  amountToPayAfterQPoint: PropTypes.number,
  onPayNow: PropTypes.func,
  qPoint: PropTypes.number,
};

qPointPayModal.defaultProps = {
  visible: false,
  onClose: null,
  amount: 0,
  deductedAgaintQPoint: 0,
  totalAmount: 0,
  amountToPayAfterQPoint: 0,
  onPayNow: null,
  qPoint: 0,
};

export default qPointPayModal;
