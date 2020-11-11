import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Colors from '../../../theme/colors';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { RfH, RfW } from '../../../utils/helpers';
import Fonts from '../../../theme/fonts';

const styles = StyleSheet.create({
  helloView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: RfH(56),
  },
  helloText: {
    marginLeft: RfW(8),
    fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
    color: Colors.secondaryText,
  },
  userName: {
    fontFamily: Fonts.semiBold,
    color: Colors.primaryText,
    fontSize: RFValue(28, STANDARD_SCREEN_SIZE),
    // marginLeft: RfW(36),
  },
  subHeading: {
    marginTop: RfH(56),
    fontSize: RFValue(20, STANDARD_SCREEN_SIZE),
    color: '#313030',
    textAlign: 'left',
    fontFamily: Fonts.bold,
  },
  subHeadingText: {
    color: Colors.secondaryText,
    marginTop: RfH(8),
  },
  areaParentView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: RfH(36),
  },
  areaView: {
    flex: 0.5,
    height: RfH(160),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  areaTitleOne: {
    marginTop: RfH(16),
    fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.semiBold,
    textAlign: 'center',
  },
  areaTitleTwo: {
    fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.semiBold,
    textAlign: 'center',
  },
  classView: {
    height: RfH(104),
    width: RfW(104),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  classTitle: {
    fontSize: RFValue(34, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.semiBold,
    textAlign: 'center',
  },
});
export default styles;
