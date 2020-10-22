import React, { useState } from 'react';
import {
  Image, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { Item, Input, Label} from 'native-base';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import styles from './style';
import { Colors, Images } from '../../theme';
import { inputs } from '../../utils/constants';
import { RfH, RfW } from '../../utils/helpers';
import NationalityDropdown from '../NationalityDropdown';
import IconButtonWrapper from '../IconWrapper';
import Flags from '../NationalityDropdown/country/flags';

function CustomMobileNumber(props) {
  const [showModal, setShowModal] = useState(false);
  const {
    label,
    error,
    inputLabelStyle,
    textInputStyle,
    value,
    placeholder,
    onChangeHandler,
    refKey,
    returnKeyType,
    onSubmitEditing,
    showClearButton,
    topMargin,
    isCountryCodeLabel,
    modalTitle
  } = props;
  const [country, setCountry] = useState(value.country);

  const onChangeMobile = (mobile) => {
    onChangeHandler({ country, mobile });
    setShowModal(false);
  };

  const [isFocussed, setIsFocussed] = useState(false);

  const getFlag = (iso2) => Flags.get(iso2);

  const onChangeCountry = (country) => {
    setCountry(country);
    onChangeHandler({ ...country, mobile: '' });
    setShowModal(false);
  };

  return (
    <View>
      <View style={[{ marginTop: RfH(topMargin) }, error && { borderColor: '#818181' }]}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View>
            {isCountryCodeLabel && (
            <Text style={[inputLabelStyle, error && { color: '#818181' }]} />
            )}
            <TouchableOpacity
              onPress={() => setShowModal(true)}
              style={[styles.textInputInnerContainer, textInputStyle, { height: RfH(34) }]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconButtonWrapper
                  iconImage={!isEmpty(country) && getFlag(country.iso2)}
                  iconWidth={RfW(22)}
                  iconHeight={RfH(15)}
                />
                <Text style={[styles.inputStyle, { marginLeft: RfW(9) }]}>
                  {`+${country.dialCode}`}
                </Text>
                <IconButtonWrapper
                  iconImage={Images.expand}
                  iconWidth={RfW(20)}
                  iconHeight={RfW(20)}
                  styling={{ marginLeft: RfW(10), marginTop: RfH(3) }}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ marginLeft: RfW(10), flex: 1 }}>
            {!isEmpty(label) && (
            <Text style={[inputLabelStyle, error && { color: '#b00820' }]}>
              {label}
            </Text>
            )}
            <View style={styles.mobileInputInnerContainer}>
              <TextInput
                keyboardType="phone-pad"
                placeholder={placeholder}
                blurOnSubmit
                value={value.mobile}
                onChangeText={onChangeMobile}
                style={[styles.inputStyle, !value.mobile && { color: Colors.coolGrey }, { flex: 1 }, { paddingBottom: RfH(12), }]}
                refKey={refKey}
                ref={(input) => {
                  inputs[refKey] = input;
                }}
                returnKeyType={returnKeyType}
                onSubmitEditing={onSubmitEditing}
                onFocus={() => setIsFocussed(true)}
                onBlur={() => setIsFocussed(false)}
              />

              {showClearButton && !isEmpty(value.mobile) && isFocussed && (
              <TouchableOpacity
                style={styles.iconContainer}
                activeOpacity={1}
                onPress={() => onChangeHandler({ country, mobile: '' })}
              >
                <Image
                  source={Images.clear}
                  style={styles.iconStyle}
                />
              </TouchableOpacity>
              )}

            </View>
          </View>
        </View>
      </View>
      {
        error
          ? (
            <Text style={styles.errorTextStyle}>
              {error}
            </Text>
          )
          : null
      }
      {showModal && (
      <NationalityDropdown
        toggleModal={() => setShowModal(!showModal)}
        onCountrySelect={onChangeCountry}
        modalVisible={showModal}
        modalTitle={modalTitle}
      />
      )}
    </View>
  );
}

CustomMobileNumber.propTypes = {
  error: PropTypes.any,
  label: PropTypes.string,
  value: PropTypes.object,
  inputLabelStyle: PropTypes.object,
  textInputStyle: PropTypes.object,
  placeholder: PropTypes.string,
  onChangeHandler: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  refKey: PropTypes.string,
  returnKeyType: PropTypes.string,
  showClearButton: PropTypes.bool,
  topMargin: PropTypes.number,
  isCountryCodeLabel: PropTypes.bool,
  modalTitle: PropTypes.string

};

CustomMobileNumber.defaultProps = {
  label: '',
  error: '',
  showPasswordField: false,
  value: {},
  countryCode: '',
  inputLabelStyle: {},
  textInputStyle: {},
  keyboardType: 'default',
  returnKeyType: 'default',
  showClearButton: true,
  topMargin: 28,
  isCountryCodeLabel: true,
};

export default CustomMobileNumber;
