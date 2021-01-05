import React from 'react';
import {TextInput, View} from 'react-native';
import PropTypes from 'prop-types';
import {isEmpty} from 'lodash';
import {Icon} from 'native-base';
import {Images} from '../../theme';
import {RfH, RfW} from '../../utils/helpers';
import IconButtonWrapper from '../IconWrapper';
import styles from './style';

function CustomSearchBar(props) {
  const { placeholder, onChangeText, value } = props;
  return (
    <View style={styles.container}>
      <IconButtonWrapper iconImage={Images.searchIcon} iconWidth={RfW(24)} iconHeight={RfH(22)} />
      <TextInput
        style={styles.textStyle}
        underlineColorAndroid="transparent"
        placeholder={placeholder}
        autoCorrect={false}
        autoCapitalize="none"
        autoCompleteType="off"
        value={value}
        onChangeText={onChangeText}
      />
      {!isEmpty(value) && (
        <Icon onPress={() => onChangeText('')} style={styles.iconStyle} type="Entypo" name="cross" />
      )}
    </View>
  );
}

CustomSearchBar.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChangeText: PropTypes.func,
};

CustomSearchBar.defaultProps = {
  value: '',
  placeholder: 'Search ...',
};

export default React.memo(CustomSearchBar);
