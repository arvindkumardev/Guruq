/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-cycle */
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import React from 'react';
import { Text, View } from 'react-native';
import { IconButtonWrapper } from '..';
import { Colors } from '../../theme';
import commonStyles from '../../theme/styles';
import { RfH, RfW } from '../../utils/helpers';
import BackArrow from '../BackArrow';

const ScreenHeader = (props) => {
  const navigation = useNavigation();
  const {
    style,
    label,
    labelStyle,
    topMargin,
    horizontalPadding,
    lineVisible,
    homeIcon,
    showRightIcon,
    rightIcon,
    onRightIconClick,
  } = props;

  const onBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={style}>
      <View
        style={[
          commonStyles.topActionView,
          {
            marginTop: RfH(topMargin),
            paddingHorizontal: RfW(horizontalPadding),
            height: RfH(44),
          },
        ]}>
        <View style={[commonStyles.horizontalChildrenSpaceView, { flex: 1 }]}>
          <View style={commonStyles.horizontalChildrenView}>
            {homeIcon && <BackArrow action={onBackPress} />}
            <View style={[labelStyle, { flexDirection: 'row', justifyContent: 'center' }]}>
              <Text style={commonStyles.headingPrimaryText}>{label}</Text>
            </View>
          </View>
          <View>
            {showRightIcon && (
              <IconButtonWrapper
                iconImage={rightIcon}
                iconWidth={RfW(20)}
                iconHeight={RfH(20)}
                submitFunction={() => onRightIconClick()}
              />
            )}
          </View>
        </View>
      </View>
      {lineVisible && <View style={commonStyles.lineSeparator} />}
    </View>
  );
};

ScreenHeader.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  label: PropTypes.string,
  labelStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  topMargin: PropTypes.number,
  horizontalPadding: PropTypes.number,
  lineVisible: PropTypes.bool,
  homeIcon: PropTypes.bool,
  showRightIcon: PropTypes.bool,
  rightIcon: PropTypes.string,
  onRightIconClick: PropTypes.func,
};

ScreenHeader.defaultProps = {
  style: { backgroundColor: Colors.white },
  label: '',
  labelStyle: {},
  topMargin: RfH(44),
  horizontalPadding: 0,
  lineVisible: true,
  homeIcon: false,
  showRightIcon: false,
  rightIcon: null,
  onRightIconClick: null,
};

export default ScreenHeader;
