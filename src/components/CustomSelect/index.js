import React, { useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';
import { Colors } from '../../theme';
import RNPickerSelect from '../RNPickerSelect';
import { RfH } from '../../utils/helpers';

function CustomSelect(props) {
  const { disabled, error, containerStyle, placeholder, onChangeHandler, data, value } = props;
  const [val, setVal] = useState(value);

  useEffect(() => {
    setVal(value);
  }, []);

  const handleChange = (value) => {
    onChangeHandler(value);
    setVal(value);
  };

  return (
    <View style={[containerStyle, error && { borderColor: '#b00820' }]}>
      <RNPickerSelect
        placeholder={{
          label: placeholder,
          value: '',
        }}
        items={data}
        onValueChange={(value) => (Platform.OS === 'ios' ? setVal(value) : handleChange(value))}
        useNativeAndroidPickerStyle={false}
        style={{
          viewContainer: { ...containerStyle },
          placeholder: { ...styles.inputStyle, color: Colors.black },
          done: { color: Colors.brandBlue },
          inputIOS: { ...styles.inputStyle },
          inputAndroid: { ...styles.inputStyle },
          inputAndroidContainer: { ...containerStyle },
          iconContainer: {
            top: Platform.OS === 'ios' ? RfH(10) : RfH(30),
            right: 5,
          },
        }}
        value={val}
        disabled={disabled}
        onDonePress={() => onChangeHandler(val)}
        onClose={() => onChangeHandler(val)}
        Icon={() => {
          return (
            <View
              style={{
                backgroundColor: 'transparent',
                borderTopWidth: 6,
                borderTopColor: 'gray',
                borderRightWidth: 6,
                borderRightColor: 'transparent',
                borderLeftWidth: 6,
                borderLeftColor: 'transparent',
                width: 0,
                height: 0,
                bottom: Platform.OS === 'ios' ? RfH(5) : RfH(20),
              }}
            />
          );
        }}
      />
      {error ? <Text style={styles.errorTextStyle}>{error}</Text> : null}
    </View>
  );
}

CustomSelect.propTypes = {
  error: PropTypes.any,
  inputWidth: PropTypes.number,
  label: PropTypes.string,
  value: PropTypes.any,
  inputLabelStyle: PropTypes.object,
  textInputStyle: PropTypes.object,
  placeholder: PropTypes.string,
  topLabelText: PropTypes.string,
  onChangeHandler: PropTypes.func,
  icon: PropTypes.any,
  data: PropTypes.any,
  containerStyle: PropTypes.object,
  disabled: PropTypes.bool,
};

CustomSelect.defaultProps = {
  label: '',
  error: '',
  showPasswordField: false,
  inputWidth: 0,
  value: '',
  inputLabelStyle: {},
  textInputStyle: {},
  data: [],
  containerStyle: {},
  disabled: false,
};

export default CustomSelect;
