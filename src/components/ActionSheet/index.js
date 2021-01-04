import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React from 'react';

import PropTypes from 'prop-types';
import { map } from 'lodash';
import styles from './styles';

function ActionSheet(props) {
  const { isVisible, handleCancel, cancelText, topLabel, actions, isTopLabelVisible, selectedIndex } = props;
  return (
    <Modal animationType="slide" transparent visible={isVisible} onRequestClose={handleCancel}>
      <TouchableWithoutFeedback onPress={handleCancel}>
        <View style={styles.mainModalContainer}>
          <View style={styles.modalContainer}>
            <View style={styles.modalInnerContainer}>
              {isTopLabelVisible && <Text style={styles.modalTopLabel}>{topLabel}</Text>}
              {actions &&
                map(actions, (action, index) => (
                  <View key={index}>
                    <View style={styles.modalSeparator} />
                    <TouchableOpacity activeOpacity={0.4} onPress={() => action.handler(index)}>
                      <Text style={[styles.modalActionLabel, action.labelColor && { color: action.labelColor }]}>
                        {selectedIndex !== null && selectedIndex === index ? <Text> ✓ </Text> : null}
                        {action.label}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
            <View style={styles.modalDismissContainer}>
              <Text style={styles.modalLabelDismiss} onPress={handleCancel}>
                {cancelText}
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

ActionSheet.propTypes = {
  isVisible: PropTypes.bool,
  handleCancel: PropTypes.func,
  cancelText: PropTypes.string,
  topLabel: PropTypes.string,
  actions: PropTypes.array,
  isTopLabelVisible: PropTypes.bool,
  selectedIndex: PropTypes.number,
};
ActionSheet.defaultProps = {
  isVisible: false,
  handleCancel: null,
  cancelText: 'Cancel',
  topLabel: 'Actions',
  actions: [],
  isTopLabelVisible: true,
};
export default ActionSheet;
