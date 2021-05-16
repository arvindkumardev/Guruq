import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors, Fonts } from '../../../theme';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { RfH, RfW } from '../../../utils/helpers';

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
  adddetailmainview: {
    marginTop: RfH(24),
    padding: RFValue(16),
  },
  labelmainview: {
    flexDirection: 'row',
    padding: RFValue(8),
    marginTop: RfH(16),
    borderWidth: RFValue(0.5),
    borderRadius: RFValue(8),
    borderColor: Colors.lightGrey2,
  },
  labeltextview: {
    fontFamily: Fonts.semiBold,
    color: Colors.black,
    fontSize: RFValue(18, STANDARD_SCREEN_SIZE),
    textAlign: 'center',
  },
  labeliconstyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
  },
  isDemoClassText: {
    fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.regular,
    color: Colors.black,
  },
  isDemoCheckBoxText: {
    fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.regular,
    color: Colors.black,
    paddingLeft: RfW(8),
  },
});
export default styles;
