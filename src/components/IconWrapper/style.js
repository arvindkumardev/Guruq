import {
  StyleSheet,
} from 'react-native';
import { RfH, RfW } from '../../utils/helpers';

const getIconImageStyle = (iconHeight, iconWidth, backgroundColor) => ({
  height: iconHeight,
  width: iconWidth,
  backgroundColor,
  resizeMode: 'contain',
});

const getLoaderImageStyle = borderRadius => ({
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
  backgroundColor: 'rgb(219, 216, 208)',
  borderRadius,
});

const styles = StyleSheet.create({
  loaderImg: { height: 15, width: 15 },
  countText: { fontSize: RfW(7), textAlign: 'center', color: 'white' },
  countbackground: {
    height: RfW(13), width: RfW(13), justifyContent: 'center', borderRadius: RfW(6.5),
    backgroundColor: 'red', position: 'absolute', left: RfW(12), bottom: RfH(8),
    borderWidth: 1, borderColor: 'white'
  }
});

export default styles;


export {
  getIconImageStyle,
  getLoaderImageStyle,
};
