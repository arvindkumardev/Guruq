import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import styles from './style';
import { Colors, Images } from '../../theme';
import { RfH, RfW } from '../../utils/helpers';
import NationalityDropdown from '../NationalityDropdown';
import IconButtonWrapper from '../IconWrapper';
import Flags from '../NationalityDropdown/country/flags';

function CustomNationalityPicker(props) {
  const [showModal, setShowModal] = useState(false);
  const { label, error, inputLabelStyle, textInputStyle, placeholder, country, onChangeHandler } = props;

  const onSelect = (country) => {
    onChangeHandler(country);
    setShowModal(false);
  };

  const getFlag = (iso2) => Flags.get(iso2);
  return (
    <View>
      <View style={[styles.textInputContainer, error && { borderColor: '#818181' }]}>
        <View>
          <Text style={[inputLabelStyle, error && { color: '#818181' }]}>{label}</Text>
        </View>
        <TouchableOpacity onPress={() => setShowModal(true)} style={[styles.textInputInnerContainer, textInputStyle]}>
          {isEmpty(country) && <Text style={[styles.inputStyle, { color: Colors.coolGrey }]}>{placeholder}</Text>}
          {!isEmpty(country) && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <IconButtonWrapper iconImage={getFlag(country.iso2)} iconWidth={RfW(22)} iconHeight={RfH(15)} />
              <Text style={[styles.inputStyle, { marginLeft: RfW(12) }]}>{country.name}</Text>
            </View>
          )}
          <IconButtonWrapper iconImage={Images.expand} iconWidth={RfW(20)} iconHeight={RfW(20)} />
        </TouchableOpacity>
        {showModal && (
          <NationalityDropdown
            toggleModal={() => setShowModal(!showModal)}
            onCountrySelect={onSelect}
            modalVisible={showModal}
            showDialcode={false}
          />
        )}
      </View>
      {error ? <Text style={styles.errorTextStyle}>{error}</Text> : null}
    </View>
  );
}

CustomNationalityPicker.propTypes = {
  error: PropTypes.any,
  label: PropTypes.string,
  country: PropTypes.any,
  inputLabelStyle: PropTypes.object,
  textInputStyle: PropTypes.object,
  placeholder: PropTypes.string,
  onChangeHandler: PropTypes.func,
};

CustomNationalityPicker.defaultProps = {
  label: '',
  error: '',
  showPasswordField: false,
  inputLabelStyle: {},
  textInputStyle: {},
  country: {},
};

export default React.memo(CustomNationalityPicker);
