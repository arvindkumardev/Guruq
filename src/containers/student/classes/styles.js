import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors, Fonts } from '../../../theme';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';

const styles = StyleSheet.create({
  activeRightButton: {
    flex: 1,
    // marginLeft: RfW(-4),
    zIndex: 3,
    backgroundColor: Colors.brandBlue,
    height: 40,

    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  activeLeftButton: {
    flex: 1,
    // marginRight: RfW(-4),
    zIndex: 3,
    backgroundColor: Colors.brandBlue,
    height: 40,

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
    color: Colors.white,
    fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.semiBold,
  },
  inactiveButtonText: {
    textAlign: 'center',
    color: Colors.darkGrey,
    fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.semiBold,
  },
});
export default styles;
