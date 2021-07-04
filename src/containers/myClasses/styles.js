import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors, Fonts } from '../../theme';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { RfH ,RfW} from '../../utils/helpers';

const styles = StyleSheet.create({
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
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: RfW(16),
    paddingVertical: RfH(10),
  },
  tutorCountText: {
    fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
    color: Colors.primaryText,
    // marginLeft: RfW(8),
  },
  filterText: {
    fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
    color: Colors.darkGrey,
    letterSpacing: 0.28,
    lineHeight: RfH(19),
    marginLeft: RfW(5),
    fontFamily: Fonts.semiBold,
  },
  horizontalLine: {
    width: '100%',
    borderWidth: 0.2,
    opacity: 0.15,
    borderColor: Colors.darkGrey,
    height: RfH(1),
    marginTop: RfH(4),
  },
});
export default styles;
