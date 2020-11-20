import React from 'react';
import PropTypes from 'prop-types';
import { Modal, View, Text } from 'react-native';
import { Button, Item, Input } from 'native-base';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors, Fonts, Images } from '../../../../theme';
import { RfH, RfW } from '../../../../utils/helpers';
import commonStyles from '../../../../theme/styles';
import { IconButtonWrapper } from '../../../../components';
import styles from '../styles';
import { STANDARD_SCREEN_SIZE } from '../../../../utils/constants';

const qPointPayModal = (props) => {
  const { visible, onClose, availableCoupons } = props;

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
            backgroundColor: Colors.darkGrey,
            paddingHorizontal: RfW(16),
            opacity: 0.5,
          }}>
          <IconButtonWrapper
            iconHeight={RfH(24)}
            iconWidth={RfW(24)}
            styling={{ alignSelf: 'flex-end', marginVertical: RfH(16) }}
            iconImage={Images.cross}
            submitFunction={() => onClose(false)}
          />
          <Item underline={false}>
            <Input
              placeholder="Enter Coupon Code"
              style={{
                backgroundColor: Colors.white,
                borderRadius: 8,
                height: RfH(40),
                fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
              }}
            />
          </Item>
          <Text style={{ alignSelf: 'flex-end', marginRight: RfW(16), marginTop: RfH(-30), color: Colors.brandBlue2 }}>
            APPLY
          </Text>
          <Text style={{ marginTop: RfH(24), marginBottom: RfH(16), color: Colors.black }}>Available Coupons</Text>
        </View>
        <View style={{ paddingHorizontal: RfW(16), marginTop: RfH(16) }}>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={commonStyles.headingPrimaryText}>GURUQIST</Text>
            <Text style={[commonStyles.headingPrimaryText, { color: Colors.brandBlue2 }]}>APPLY</Text>
          </View>
          <Text style={{ marginTop: RfH(16) }}>Get 20% off</Text>
          <View style={[commonStyles.borderBottom, { marginVertical: RfH(16) }]} />
          <Text style={[commonStyles.mediumMutedText, { marginBottom: RfH(28) }]}>
            Use Code GURUQ1ST & get 20% off on booking your 1st class.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

qPointPayModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  availableCoupons: PropTypes.array,
};

qPointPayModal.defaultProps = {
  visible: false,
  onClose: null,
  availableCoupons: [],
};

export default qPointPayModal;
