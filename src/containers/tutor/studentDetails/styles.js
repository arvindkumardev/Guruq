import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors, Fonts } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';

export const styles = StyleSheet.create({
  mainContainer: {
    width: RfW(95),
    marginTop: RfH(20),
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: RfH(71),
    width: RfH(71),
  },
  subjectText: {
    textAlign: 'center',
    fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
    color: Colors.primaryText,
    marginTop: RfH(5),
  },
  circle: {
    backgroundColor: Colors.brandBlue2,
    marginTop: RfH(8),
    width: RfW(10),
    height: RfH(10),
    borderRadius: 10 / 2,
  },
  activeRightButton: {
    flex: 1,
    // marginLeft: RfW(-4),
    zIndex: 3,
    left: -10,
    backgroundColor: Colors.white,
    borderColor: Colors.brandBlue2,
    height: RfH(40),
    borderRadius: 8,
    borderWidth: 0.5,
  },
  activeLeftButton: {
    flex: 1,
    // marginRight: RfW(-4),
    zIndex: 3,
    right: -10,
    height: RfH(40),
    borderColor: Colors.brandBlue2,
    borderWidth: 0.5,
    borderRadius: 8,
  },
  inactiveRightButton: {
    flex: 1,
    backgroundColor: Colors.white,
    // marginLeft: RfW(-4),
    borderStartWidth: 0,
    borderColor: Colors.darkGrey,
    height: RfH(40),
    borderRadius: 8,
    borderWidth: 0.5,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  inactiveLeftButton: {
    flex: 1,
    backgroundColor: Colors.white,
    // marginRight: RfW(-4),
    borderColor: Colors.darkGrey,
    borderRadius: 8,
    borderEndWidth: 0,
    height: RfH(40),
    borderWidth: 0.5,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  activeButtonText: {
    textAlign: 'center',
    color: Colors.brandBlue2,
    fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.semiBold,
  },
  inactiveButtonText: {
    textAlign: 'center',
    color: Colors.darkGrey,
    fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.semiBold,
  },
});
