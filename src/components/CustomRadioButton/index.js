import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity, View } from 'react-native';
import { isEmpty } from 'lodash';
import { Images, Colors } from '../../theme';
import { RfH, RfW } from '../../utils/helpers';

function stylingIconButtonWrapper(props) {
  const { iconHeight, iconWidth, styling, enabled, submitFunction } = props;

  return (
    <View>
      <TouchableOpacity onPress={submitFunction}>
        {enabled ? (
          <View>
            <Image source={Images.radio} style={[styling, { height: iconHeight, width: iconWidth }]} />
          </View>
        ) : (
          <View
            style={{
              height: RfH(18),
              width: RfW(18),
              borderRadius: RfW(9),
              borderColor: Colors.inputLabel,
              borderWidth: 1,
            }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

stylingIconButtonWrapper.propTypes = {
  iconHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  iconWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  styling: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  enabled: PropTypes.bool,
  submitFunction: PropTypes.func,
};

stylingIconButtonWrapper.defaultProps = {
  iconHeight: RfH(18),
  iconWidth: RfW(18),
  styling: {},
  enabled: false,
  submitFunction: null,
};

export default stylingIconButtonWrapper;
