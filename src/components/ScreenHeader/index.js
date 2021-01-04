/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-cycle */
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import React from 'react';
import { Text, View, TouchableWithoutFeedback } from 'react-native';
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
    showRightText,
    rightText,
    onRightTextClick,
    handleBack,
    rightTextStyle,
  } = props;

  const onBackPress = () => {
    if (handleBack) {
      handleBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={style}>
      <View
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: RfW(horizontalPadding),
            height: Platform.OS === 'ios' ? RfH(50) : RfH(60),
          },
          Platform.OS === 'ios' && { marginTop: RfH(topMargin) },
        ]}>
        <View style={[commonStyles.horizontalChildrenSpaceView, { flex: 1 }]}>
          <View style={{ justifyContent: 'center', flexDirection: 'row', flex: 1 }}>
            <View style={{ position: 'absolute', left: 0, top: -RfH(5), alignItems: 'center' }}>
              {homeIcon && <BackArrow action={onBackPress} />}
            </View>
            <View style={[labelStyle, { flexDirection: 'row', justifyContent: 'center', marginLeft: RfW(8) }]}>
              <Text style={commonStyles.headingPrimaryText}>{label}</Text>
            </View>
          </View>
          <View style={{ position: 'absolute', right: 0, padding: RfW(10) }}>
            {showRightIcon && (
              <IconButtonWrapper
                iconImage={rightIcon}
                iconWidth={RfW(20)}
                iconHeight={RfH(20)}
                submitFunction={() => onRightIconClick()}
              />
            )}
            {showRightText && (
              <TouchableWithoutFeedback onPress={() => onRightTextClick()}>
                <Text style={rightTextStyle}>{rightText}</Text>
              </TouchableWithoutFeedback>
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
  showRightText: PropTypes.bool,
  rightText: PropTypes.string,
  rightIcon: PropTypes.string,
  onRightIconClick: PropTypes.func,
  onRightTextClick: PropTypes.func,
  handleBack: PropTypes.func,
  rightTextStyle: PropTypes.object,
};

ScreenHeader.defaultProps = {
  style: { backgroundColor: Colors.white },
  label: '',
  labelStyle: {},
  topMargin: 44,
  horizontalPadding: 0,
  lineVisible: true,
  homeIcon: false,
  showRightText: false,
  showRightIcon: false,
  rightText: '',
  rightIcon: null,
  onRightIconClick: null,
  onRightTextClick: null,
  handleBack: null,
  rightTextStyle: {},
};

export default ScreenHeader;
