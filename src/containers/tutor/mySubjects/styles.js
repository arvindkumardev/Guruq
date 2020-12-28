import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors, Fonts } from '../../../theme';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { RfH } from '../../../utils/helpers';

const styles = StyleSheet.create({
  rightButton: {
    flex: 1,
    zIndex: 3,
    height: RfH(40),
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  leftButton: {
    flex: 1,
    zIndex: 3,
    height: RfH(40),
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  inactiveRightButton: {
    flex: 1,
    backgroundColor: Colors.white,
    // marginLeft: RfW(-4),
    borderColor: Colors.darkGrey,
    height: 40,

    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  inactiveLeftButton: {
    flex: 1,
    backgroundColor: Colors.white,
    // marginRight: RfW(-4),
    borderColor: Colors.darkGrey,
    height: 40,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  activeButtonText: {
    textAlign: 'center',
    color: Colors.brandBlue,
    fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.semiBold,
  },
  inactiveButtonText: {
    textAlign: 'center',
    color: Colors.darkGrey,
    fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.semiBold,
  },
});
export default styles;
