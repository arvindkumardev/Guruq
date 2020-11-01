/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-cycle */
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Images, Colors } from '../../theme';
import { RfH, RfW } from '../../utils/helpers';
import commonStyles from '../../theme/styles';
import { IconButtonWrapper } from '..';

function customRangeSelector(props) {
  const navigation = useNavigation();
  const { style, label, topMargin, horizontalPadding, lineVisible, homeIcon } = props;

  const onBackPress = () => {
    navigation.goBack();
  };

  return (
    <View>
      <View
        style={[
          commonStyles.topActionView,
          { style, marginTop: RfH(topMargin), paddingHorizontal: RfW(horizontalPadding) },
        ]}>
        <View style={commonStyles.horizontalChildrenView}>
          {homeIcon && (
            <IconButtonWrapper
              styling={{ marginRight: RfW(16) }}
              iconImage={Images.backArrow}
              iconHeight={RfH(24)}
              iconWidth={RfW(24)}
              submitFunction={() => onBackPress()}
            />
          )}
          <Text style={commonStyles.pageTitle}>{label}</Text>
        </View>
      </View>
      {lineVisible && (
        <View style={{ borderBottomWidth: 1, borderBottomColor: Colors.darkGrey, marginTop: RfH(16), opacity: 0.3 }} />
      )}
    </View>
  );
}

customRangeSelector.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  label: PropTypes.string,
  topMargin: PropTypes.number,
  horizontalPadding: PropTypes.number,
  lineVisible: PropTypes.bool,
  homeIcon: PropTypes.bool,
};

customRangeSelector.defaultProps = {
  style: {},
  label: '',
  topMargin: RfH(48),
  horizontalPadding: 0,
  lineVisible: false,
  homeIcon: false,
};

export default customRangeSelector;
