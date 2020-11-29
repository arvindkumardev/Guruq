import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../theme/colors';
import { RfW, RfH } from '../../utils/helpers';
import Images from '../../theme/images';
import IconButtonWrapper from '../IconWrapper';
import Fonts from '../../theme/fonts';

const VideoMessagingModal = (props) => {
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
      <View
        style={{ flex: 1, paddingBottom: 34, height: '90%', backgroundColor: 'transparent', flexDirection: 'column' }}>
        <View style={{ backgroundColor: Colors.black, opacity: 0.5, flex: 1 }} />
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
            paddingHorizontal: RfW(16),
            // paddingVertical: RfW(16),
          }}>
          <View
            style={{
              height: 44,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{ color: Colors.primaryText, fontSize: 18, fontFamily: Fonts.semiBold }}>Messages</Text>
            <TouchableOpacity onPress={() => onClose(false)}>
              <IconButtonWrapper iconImage={Images.cross} iconWidth={RfW(24)} iconHeight={RfH(24)} />
            </TouchableOpacity>
          </View>

          <View style={{ height: 8 }} />

          <Text>Messages goes here.....</Text>

          <View style={{ height: 34 }} />
        </View>
      </View>
    </Modal>
  );
};

VideoMessagingModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

export default VideoMessagingModal;
