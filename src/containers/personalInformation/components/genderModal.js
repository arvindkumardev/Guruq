import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, View, Text, TouchableWithoutFeedback } from 'react-native';
import { Item, Input } from 'native-base';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors, Fonts, Images } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import commonStyles from '../../../theme/styles';
import { IconButtonWrapper, CustomRadioButton } from '../../../components';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { GenderEnum } from '../../common/enums';

const GenderModal = (props) => {
  const [selectedItem, setSelectedItem] = useState(1);
  const { visible, onClose, onGenderSelect } = props;

  const onSelect = (val) => {
    setSelectedItem(val);
    if (val === 1) {
      onGenderSelect(GenderEnum.MALE.label);
    } else if (val === 2) {
      onGenderSelect(GenderEnum.FEMALE.label);
    } else if (val === 3) {
      onGenderSelect(GenderEnum.OTHER.label);
    }
    onClose(false);
  };
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={() => {
        onClose(false);
      }}>
      <View
        style={{
          flex: 1,
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          position: 'absolute',
          backgroundColor: Colors.black,
          opacity: 0.8,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
      <View style={{ flex: 0.35 }} />
      <View
        style={{
          flex: 0.3,
          marginHorizontal: RfW(16),
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          backgroundColor: Colors.white,
        }}>
        <View
          style={[
            commonStyles.horizontalChildrenSpaceView,
            {
              backgroundColor: Colors.lightBlue,
              paddingHorizontal: RfW(16),
            },
          ]}>
          <Text style={commonStyles.regularPrimaryText}>Gender</Text>
          <IconButtonWrapper
            iconHeight={RfH(20)}
            iconWidth={RfW(20)}
            styling={{ alignSelf: 'flex-end', marginVertical: RfH(16) }}
            iconImage={Images.cross}
            submitFunction={() => onClose(false)}
          />
        </View>
        <View style={{ paddingHorizontal: RfW(16) }}>
          <View style={{ height: RfH(24) }} />
          <TouchableWithoutFeedback onPress={() => onSelect(1)}>
            <View style={commonStyles.horizontalChildrenView}>
              <CustomRadioButton enabled={selectedItem === 1} />
              <Text style={{ marginLeft: RfW(8) }}>Male</Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
          <TouchableWithoutFeedback onPress={() => onSelect(2)}>
            <View style={commonStyles.horizontalChildrenView}>
              <CustomRadioButton enabled={selectedItem === 2} />
              <Text style={{ marginLeft: RfW(8) }}>Female</Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
          <TouchableWithoutFeedback onPress={() => onSelect(3)}>
            <View style={commonStyles.horizontalChildrenView}>
              <CustomRadioButton enabled={selectedItem === 3} />
              <Text style={{ marginLeft: RfW(8) }}>Other</Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
        </View>
      </View>
      <View style={{ flex: 0.35 }} />
    </Modal>
  );
};

GenderModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onGenderSelect: PropTypes.func,
};

GenderModal.defaultProps = {
  visible: false,
  onClose: null,
  onGenderSelect: null,
};

export default GenderModal;
