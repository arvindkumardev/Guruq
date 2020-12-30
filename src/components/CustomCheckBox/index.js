import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity, View } from 'react-native';
import { isEmpty } from 'lodash';
import { Images, Colors } from '../../theme';
import { RfH, RfW } from '../../utils/helpers';

function CustomCheckBox(props) {
  const { iconHeight, iconWidth, styling, enabled, submitFunction } = props;

  return (
    <View>
      <TouchableOpacity onPress={submitFunction} activeOpacity={1}>
        {enabled ? (
          <View
            style={{
              height: RfH(22),
              width: RfH(22),
              borderRadius: RfH(5),
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: Colors.brandBlue2,
              backgroundColor: Colors.brandBlue2,
              borderWidth: 1,
            }}>
            <Image source={Images.tick} style={[styling, { height: RfH(12), width: RfH(12) }]} resizeMode="contain" />
          </View>
        ) : (
          <View
            style={{
              height: RfH(22),
              width: RfH(22),
              borderRadius: RfH(5),
              borderColor: Colors.black,
              borderWidth: 1,
            }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

CustomCheckBox.propTypes = {
  iconHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  iconWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  styling: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  enabled: PropTypes.bool,
  submitFunction: PropTypes.func,
};

CustomCheckBox.defaultProps = {
  iconHeight: RfH(18),
  iconWidth: RfW(18),
  styling: {},
  enabled: false,
  submitFunction: null,
};

export default CustomCheckBox;
