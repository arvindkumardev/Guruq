import React from 'react';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity, View } from 'react-native';
import { Colors, Images } from '../../theme';
import { RfH, RfW } from '../../utils/helpers';

function CustomRadioButton(props) {
  const { iconHeight, iconWidth, styling, enabled, submitFunction } = props;

  return (
    <View>
      <TouchableOpacity onPress={submitFunction} activeOpacity={1}>
        {enabled ? (
          <View>
            <Image
              source={Images.radio}
              style={[styling, { height: iconHeight, width: iconWidth }]}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View
            style={{
              height: iconHeight,
              width: iconHeight,
              borderRadius: iconHeight,
              borderWidth: 1,
            }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

CustomRadioButton.propTypes = {
  iconHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  iconWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  styling: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  enabled: PropTypes.bool,
  submitFunction: PropTypes.func,
};

CustomRadioButton.defaultProps = {
  iconHeight: RfH(18),
  iconWidth: RfW(18),
  styling: {},
  enabled: false,
  submitFunction: null,
};

export default CustomRadioButton;
