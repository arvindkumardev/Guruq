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
import BackArrow from '../BackArrow';

function customRangeSelector(props) {
  const navigation = useNavigation();
  const { style, label, labelStyle, topMargin, horizontalPadding, lineVisible, homeIcon } = props;

  const onBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={{ backgroundColor: Colors.white }}>
      <View
        style={[
          commonStyles.topActionView,
          {
            style,
            marginTop: RfH(topMargin),
            paddingHorizontal: RfW(horizontalPadding),
            height: RfH(44),
          },
        ]}>
        <View style={commonStyles.horizontalChildrenView}>
          {homeIcon && <BackArrow action={onBackPress} />}
          <View style={[labelStyle, { flexDirection: 'row', justifyContent:"center" }]}>
            <Text style={commonStyles.headingPrimaryText}>{label}</Text>
          </View>
        </View>
      </View>
      {lineVisible && (
        <View style={{ borderBottomWidth: 1, borderBottomColor: Colors.darkGrey, marginTop: RfH(16), opacity: 0.3 }} />
      )}

      <View style={commonStyles.lineSeparator} />
    </View>
  );
}

customRangeSelector.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  label: PropTypes.string,
  labelStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  topMargin: PropTypes.number,
  horizontalPadding: PropTypes.number,
  lineVisible: PropTypes.bool,
  homeIcon: PropTypes.bool,
};

customRangeSelector.defaultProps = {
  style: {},
  label: '',
  labelStyle: {},
  topMargin: RfH(44),
  horizontalPadding: 0,
  lineVisible: false,
  homeIcon: false,
};

export default customRangeSelector;
