/**
 * toggle-switch-react-native
 * Toggle Switch component for react native, it works on iOS and Android
 * https://github.com/aminebenkeroum/toggle-switch-react-native
 * Email:amine.benkeroum@gmail.com
 * Blog: https://medium.com/@aminebenkeroum/
 * @benkeroumamine
 */

import React from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelStyle: {
    marginHorizontal: 10,
  },
});

const ToggleSwitch = (props) => {
  // export default class ToggleSwitch extends React.Component {
  const calculateDimensions = (size) => {
    switch (size) {
      case 'small':
        return {
          width: 40,
          padding: 10,
          circleWidth: 15,
          circleHeight: 15,
          translateX: 22,
        };
      case 'large':
        return {
          width: 70,
          padding: 20,
          circleWidth: 30,
          circleHeight: 30,
          translateX: 38,
        };
      default:
        return {
          width: 46,
          padding: 12,
          circleWidth: 18,
          circleHeight: 18,
          translateX: 26,
        };
    }
  };

  const offsetX = new Animated.Value(0);

  const dimensions = calculateDimensions(props.size);

  const createToggleSwitchStyle = () => [
    {
      justifyContent: 'center',
      width: dimensions.width,
      borderRadius: 20,
      padding: dimensions.padding,
      backgroundColor: props.isOn ? props.onColor : props.offColor,
    },
    props.isOn ? props.trackOnStyle : props.trackOffStyle,
  ];

  const createInsideCircleStyle = () => [
    {
      alignItems: 'center',
      justifyContent: 'center',
      margin: Platform.OS === 'web' ? 0 : 4,
      left: Platform.OS === 'web' ? 4 : 0,
      position: 'absolute',
      backgroundColor: props.circleColor,
      transform: [{ translateX: offsetX }],
      width: dimensions.circleWidth,
      height: dimensions.circleHeight,
      borderRadius: dimensions.circleWidth / 2,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2.5,
      elevation: 1.5,
      zIndex: 1,
    },
    props.isOn ? props.thumbOnStyle : props.thumbOffStyle,
  ];

  const toValue = props.isOn ? dimensions.width - dimensions.translateX : 0;

  Animated.timing(offsetX, {
    toValue,
    duration: props.animationSpeed,
    useNativeDriver: props.useNativeDriver,
  }).start();

  return (
    <View style={styles.container}>
      {props.label ? <Text style={[styles.labelStyle, props.labelStyle]}>{props.label}</Text> : null}

      <TouchableOpacity
        style={createToggleSwitchStyle()}
        activeOpacity={0.8}
        onPress={() => (props.disabled ? null : props.onToggle(!props.isOn))}>
        <Animated.View style={createInsideCircleStyle()}>{props.icon}</Animated.View>
      </TouchableOpacity>
    </View>
  );
};

ToggleSwitch.propTypes = {
  isOn: PropTypes.bool.isRequired,
  label: PropTypes.string,
  onColor: PropTypes.string,
  offColor: PropTypes.string,
  size: PropTypes.string,
  labelStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  thumbOnStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  thumbOffStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  trackOnStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  trackOffStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  onToggle: PropTypes.func,
  icon: PropTypes.object,
  disabled: PropTypes.bool,
  animationSpeed: PropTypes.number,
  useNativeDriver: PropTypes.bool,
  circleColor: PropTypes.string,
};

ToggleSwitch.defaultProps = {
  // isOn: false,
  onColor: '#4cd137',
  offColor: '#ecf0f1',
  size: 'medium',
  labelStyle: {},
  thumbOnStyle: {},
  thumbOffStyle: {},
  trackOnStyle: {},
  trackOffStyle: {},
  icon: null,
  disabled: false,
  animationSpeed: 300,
  useNativeDriver: true,
  circleColor: 'white',
};

export default ToggleSwitch;
