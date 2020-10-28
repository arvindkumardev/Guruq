import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { isEmpty } from 'lodash';
import styles from './style';
import { Colors, Images } from '../../theme';
import { RfW, RfH } from '../../utils/helpers';
import IconButtonWrapper from '../IconWrapper';

function CustomDatePicker(props) {
  const [showDate, setShowDate] = useState(false);
  const {
    label,
    error,
    inputWidth,
    inputLabelStyle,
    textInputStyle,
    placeholder,
    onChangeHandler,
    topLabelText,
    initialValue,
    format,
    value,
    minimumDate,
    maximumDate,
    iconImage,
  } = props;

  const handleConfirm = (value) => {
    setShowDate(false);
    onChangeHandler(moment(value).format('YYYY-MM-DD'));
  };

  return (
    <View>
      <View
        style={[
          styles.textInputContainer,
          error && { borderColor: '#b00820' },
          isEmpty(label) && { marginTop: RfH(5) },
        ]}>
        {!isEmpty(label) && (
          <View>
            <Text style={[inputLabelStyle, error && { color: '#b00820' }]}>{label}</Text>
          </View>
        )}
        <TouchableOpacity onPress={() => setShowDate(true)} style={[styles.textInputInnerContainer, textInputStyle]}>
          <Text style={[styles.inputStyle, inputWidth && { width: inputWidth }, !value && { color: Colors.coolGrey }]}>
            {value ? moment(value).format(format) : placeholder}
          </Text>
          <IconButtonWrapper iconImage={iconImage} iconWidth={RfW(20)} iconHeight={RfW(20)} />
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={showDate}
          mode="date"
          date={value ? moment(value, 'YYYY-MM-DD').toDate() : initialValue}
          onConfirm={handleConfirm}
          onCancel={() => setShowDate(false)}
          headerTextIOS={topLabelText || 'Pick a date'}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          cancelTextStyle={{ color: Colors.backgroundYellow }}
          confirmTextStyle={styles.inputStyle}
        />
      </View>
      {error ? <Text style={styles.errorTextStyle}>{error}</Text> : null}
    </View>
  );
}

CustomDatePicker.propTypes = {
  error: PropTypes.any,
  inputWidth: PropTypes.number,
  label: PropTypes.string,
  format: PropTypes.string,
  value: PropTypes.string,
  inputLabelStyle: PropTypes.object,
  textInputStyle: PropTypes.object,
  placeholder: PropTypes.string,
  topLabelText: PropTypes.string,
  onChangeHandler: PropTypes.func,
  icon: PropTypes.any,
  minimumDate: PropTypes.any,
  maximumDate: PropTypes.any,
  initialValue: PropTypes.object,
  iconImage: PropTypes.any,
};

CustomDatePicker.defaultProps = {
  label: '',
  error: '',
  inputWidth: 0,
  value: '',
  initialValue: new Date(),
  inputLabelStyle: {},
  textInputStyle: {},
  format: 'DD/MM/YYYY',
  minimumDate: new Date(1930, 1, 1),
  maximumDate: new Date(2050, 12, 31),
  iconImage: Images.calendar,
};

export default React.memo(CustomDatePicker);
