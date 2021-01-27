import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Colors from '../../theme/colors';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { RfH, RfW } from '../../utils/helpers';
import Fonts from '../../theme/fonts';

const styles = StyleSheet.create({
  helloView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: RfH(88),
  },
  helloText: {
    fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
    color: Colors.primaryText,
  },
  userName: {
    color: Colors.primaryText,
    fontSize: RFValue(28, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.semiBold,
  },
  subHeading: {
    textAlign: 'center',
    marginTop: RfH(34),
    fontSize: RFValue(20, STANDARD_SCREEN_SIZE),
    color: Colors.black,
    fontFamily: Fonts.semiBold,
  },
  areaParentView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: RfH(32),
  },
  areaView: {
    flex: 0.5,
    height: RfH(162),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  areaTitleOne: {
    marginTop: RfH(12),
    fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
    fontFamily: 'SegoeUI-Semibold',
    textAlign: 'center',
  },
  areaTitleTwo: {
    fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
    fontFamily: 'SegoeUI-Semibold',
    textAlign: 'center',
  },
  classView: {
    height: RfH(100),
    width: RfW(100),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  classTitle: {
    fontSize: RFValue(35, STANDARD_SCREEN_SIZE),
    fontFamily: 'SegoeUI-Semibold',
    textAlign: 'center',
  },
});
export default styles;
