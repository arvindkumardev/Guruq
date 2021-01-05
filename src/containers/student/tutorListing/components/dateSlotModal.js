import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Images } from '../../../../theme';
import { RfH, RfW } from '../../../../utils/helpers';

const dateSlotModal = (props) => {
  const navigation = useNavigation();

  const { visible, onClose } = props;

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={() => {
        onClose(false);
      }}>
      <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'column' }}>
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
            opacity: 0.6,
            // paddingVertical: RfW(16),
          }}
        />
      </View>
    </Modal>
  );
};

dateSlotModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

export default dateSlotModal;
