/*
 * Draws fully customizable dashed lines vertically or horizontally
 *
 * @providesModule Dash
 */

import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, ViewPropTypes } from 'react-native';
import MeasureMeHOC from '../MeasureMeHOC';

export const isStyleRow = (style) => {
  const flatStyle = StyleSheet.flatten(style || {});
  return flatStyle.flexDirection !== 'column';
};

const getDashStyleId = ({ dashGap, dashLength, dashThickness, dashColor }, isRow) =>
  `${dashGap}-${dashLength}-${dashThickness}-${dashColor}-${isRow ? 'row' : 'column'}`;

const createDashStyleSheet = ({ dashGap, dashLength, dashThickness, dashColor }, isRow) => {
  const idStyle = StyleSheet.create({
    style: {
      width: isRow ? dashLength : dashThickness,
      height: isRow ? dashThickness : dashLength,
      marginRight: isRow ? dashGap : 0,
      marginBottom: isRow ? 0 : dashGap,
      backgroundColor: dashColor,
    },
  });
  return idStyle.style;
};

let stylesStore = {};
export const getDashStyle = (props) => {
  const isRow = isStyleRow(props.style);
  const id = getDashStyleId(props, isRow);
  if (!stylesStore[id]) {
    stylesStore = {
      ...stylesStore,
      [id]: createDashStyleSheet(props, isRow),
    };
  }
  return stylesStore[id];
};

const Dash = (props) => {
  const isRow = isStyleRow(props.style);
  const length = isRow ? props.width : props.height;
  const n = Math.ceil(length / (props.dashGap + props.dashLength));
  const calculatedDashStyles = getDashStyle(props);
  const dash = [];
  for (let i = 0; i < n; i++) {
    dash.push(<View key={i} style={[calculatedDashStyles, props.dashStyle]} />);
  }
  return (
    <View onLayout={props.onLayout} style={[props.style, isRow ? styles.row : styles.column]}>
      {dash}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  column: { flexDirection: 'column' },
});

Dash.propTypes = {
  style: ViewPropTypes.style,
  dashGap: PropTypes.number.isRequired,
  dashLength: PropTypes.number.isRequired,
  dashThickness: PropTypes.number.isRequired,
  dashColor: PropTypes.string,
  dashStyle: ViewPropTypes.style,
};

Dash.defaultProps = {
  dashGap: 2,
  dashLength: 4,
  dashThickness: 0.5,
  dashColor: 'black',
};

export default MeasureMeHOC(Dash);
