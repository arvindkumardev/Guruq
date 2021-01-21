import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { RfH, RfW } from '../../utils/helpers';
import { Colors } from '../../theme';

const styles = StyleSheet.create({
  splashImage: {
    height: RfH(195),
    width: RfW(195),
    // marginTop: RfH(175),
    // marginHorizontal: RfW(71),
    // marginBottom: RfH(0),
    // alignSelf: 'center',
  },
  msgOne: {
    fontSize: RFValue(24, STANDARD_SCREEN_SIZE),
    color: Colors.white,
    fontFamily: 'SegoeUI-Semibold',
    alignSelf: 'center',
    marginTop: RfH(-30),
  },
  msgTwo: {
    fontSize: RFValue(24, STANDARD_SCREEN_SIZE),
    color: Colors.white,
    fontFamily: 'SegoeUI-Semibold',
    alignSelf: 'center',
  },
  bottomMsg: {
    fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
    color: '#fff',
    opacity: 0.5,
    textAlign: 'center',
    bottom: RfH(48),
    left: 0,
    right: 0,
    position: 'absolute',
  },
});
export default styles;
