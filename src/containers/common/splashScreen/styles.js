import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { RfH, RfW } from '../../../utils/helpers';

const styles = StyleSheet.create({
  splashImage: {
    height: RfH(210),
    width: RfW(210),
    marginTop: RfH(179),
    marginHorizontal: RfW(71),
    alignSelf: 'center',
  },
  msgOne: {
    fontSize: RFValue(20, STANDARD_SCREEN_SIZE),
    color: '#fff',
    fontFamily: 'SegoeUI-Semibold',
    alignSelf: 'center',
    marginTop: RfH(-45),
  },
  msgTwo: {
    fontSize: RFValue(20, STANDARD_SCREEN_SIZE),
    color: '#fff',
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
