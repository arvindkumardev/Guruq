import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Text, TextInput, View } from 'react-native';
import { Button } from 'native-base';
import commonStyles from '../../../theme/styles';
import { RfH, RfW } from '../../../utils/helpers';
import Colors from '../../../theme/colors';
import { IconButtonWrapper } from '../../../components';
import { Images } from '../../../theme';

const PriceInputModal = (props) => {
  const { onPriceChange, price, onSubmit, visible, onClose, selectedPytn } = props;

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: Colors.black, opacity: 0.5, flex: 1 }} />
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            backgroundColor: Colors.white,
          }}>
          <View
            style={[
              commonStyles.horizontalChildrenSpaceView,
              { backgroundColor: Colors.lightBlue, paddingHorizontal: RfW(16) },
            ]}>
            <Text style={commonStyles.headingPrimaryText}>Enter per class price</Text>
            <IconButtonWrapper
              iconHeight={RfH(24)}
              iconWidth={RfW(24)}
              styling={{ alignSelf: 'flex-end', marginVertical: RfH(16) }}
              iconImage={Images.cross}
              submitFunction={onClose}
              imageResizeMode="contain"
            />
          </View>

          <View style={{ alignItems: 'center' }}>
            <View
              style={[
                commonStyles.horizontalChildrenView,
                {
                  borderWidth: 1,
                  borderColor: Colors.borderColor,
                  paddingLeft: RfW(8),
                  borderRadius: 8,
                  marginTop: RfH(30),
                },
              ]}>
              <View style={{ borderRightColor: Colors.lightGrey, borderRightWidth: 1, marginRight: RfW(4) }}>
                <Text style={commonStyles.regularPrimaryText}>₹ </Text>
              </View>
              <TextInput
                onChangeText={(text) => onPriceChange(text)}
                style={[{ width: RfW(80), paddingVertical: RfH(12) }, commonStyles.regularPrimaryText]}
                value={price.toString()}
                keyboardType="numeric"
                returnKeyType="done"
              />
            </View>
          </View>

          <View
            style={{
              borderRightColor: Colors.lightGrey,
              borderRightWidth: 1,
              marginRight: RfW(4),
              alignItems: 'center',
              marginVertical: RfH(10),
            }}>
            <Text style={commonStyles.regularPrimaryText}>
              Amount should be in range ₹{selectedPytn.minPrice}-{selectedPytn.maxPrice}{' '}
            </Text>
          </View>

          <Button
            onPress={onSubmit}
            block
            style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginBottom: RfH(34), marginTop: RfH(8) }]}>
            <Text style={commonStyles.textButtonPrimary}>Submit</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

PriceInputModal.defaultProps = {
  price: 0,
  onSubmit: null,
  visible: false,
  onClose: null,
  onPriceChange: null,
  selectedPytn: {},
};

PriceInputModal.propTypes = {
  price: PropTypes.number,
  onSubmit: PropTypes.func,
  onPriceChange: PropTypes.func,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  selectedPytn: PropTypes.object,
};

export default PriceInputModal;
