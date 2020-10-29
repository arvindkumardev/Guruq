import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Colors from '../../../theme/colors';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { RfH, RfW } from '../../../utils/helpers';
import Fonts from '../../../theme/Fonts';

const styles = StyleSheet.create({
  helloView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: RfH(58),
    // marginLeft: RfW(16),
  },
  helloText: {
    marginLeft: RfW(8),
    fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
    color: Colors.secondaryText,
  },
  userName: {
    color: Colors.primaryText,
    fontSize: RFValue(28, STANDARD_SCREEN_SIZE),
    marginLeft: RfW(36),
    fontFamily: Fonts.semiBold,
  },
  subHeading: {
    textAlign: 'center',
    marginTop: RfH(58),
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
    fontWeight: '600',
    textAlign: 'center',
  },
  areaTitleTwo: {
    fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
    fontWeight: '600',
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
    fontWeight: '600',
    textAlign: 'center',
  },
});
export default styles;
