import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors, Fonts } from '../../../theme';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { RfH, RfW } from '../../../utils/helpers';

const styles = StyleSheet.create({
  activeRightButton: {
    flex: 1,
    marginLeft: RfW(-4),
    zIndex: 3,
    backgroundColor: Colors.white,
  },
  activeLeftButton: {
    flex: 1,
    marginRight: RfW(-4),
    zIndex: 3,
    backgroundColor: Colors.white,
  },
  inactiveRightButton: {
    flex: 1,
    backgroundColor: Colors.white,
    marginLeft: RfW(-4),
    borderColor: Colors.darkGrey,
  },
  inactiveLeftButton: {
    flex: 1,
    backgroundColor: Colors.white,
    marginRight: RfW(-4),
    borderColor: Colors.darkGrey,
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
export default styles;
