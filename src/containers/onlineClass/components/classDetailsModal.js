import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../../theme/colors';
import { RfH, RfW } from '../../../utils/helpers';
import Images from '../../../theme/images';
import IconButtonWrapper from '../../../components/IconWrapper';
import Fonts from '../../../theme/fonts';
import commonStyles from '../../../theme/styles';

const ClassDetailsModal = (props) => {
  const { visible, onClose } = props;

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={() => {
        onClose(false);
      }}>
      <View style={{ flex: 1, paddingBottom: 34, backgroundColor: 'transparent', flexDirection: 'column' }}>
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
            <Text style={{ color: Colors.primaryText, fontSize: 18, fontFamily: Fonts.semiBold }}>Class Details</Text>
            <TouchableOpacity onPress={() => onClose(false)}>
              <IconButtonWrapper iconImage={Images.cross} iconWidth={RfW(24)} iconHeight={RfH(24)} />
            </TouchableOpacity>
          </View>

          <View style={{ height: 8 }} />

          <View>
            <Text style={commonStyles.headingPrimaryText}>CBSE - Class 10 - Mathematics</Text>
          </View>

          <View style={{ height: 34 }} />
        </View>
      </View>
    </Modal>
  );
};

ClassDetailsModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

export default ClassDetailsModal;
