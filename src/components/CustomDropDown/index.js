import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';
import { Colors } from '../../theme';
import RNPickerIcon from '../RNPickerIcon';

function CustomDropDown(props) {
  const { error, onChangeHandler, data, value } = props;

  const handleChange = (value) => {
    onChangeHandler(value);
  };

  return (
    <View style={[styles.textInputContainer, error && { borderColor: '#b00820' }]}>
      <RNPickerIcon
        items={data}
        onValueChange={(value) => handleChange(value)}
        useNativeAndroidPickerStyle={false}
        style={{
          viewContainer: { ...styles.textInputInnerContainer },
          done: { color: Colors.backgroundYellow },
          inputIOS: { ...styles.inputStyle },
          inputAndroid: { ...styles.inputStyle },
          inputAndroidContainer: { ...styles.textInputInnerContainer },
        }}
        value={value}
      />
      {error ? <Text style={styles.errorTextStyle}>{error}</Text> : null}
    </View>
  );
}

CustomDropDown.propTypes = {
  error: PropTypes.any,
  inputWidth: PropTypes.number,
  value: PropTypes.any,
  data: PropTypes.array,
  onChangeHandler: PropTypes.func,
};

CustomDropDown.defaultProps = {
  error: '',
  inputWidth: 0,
  value: '',
  data: [],
};

export default CustomDropDown;
