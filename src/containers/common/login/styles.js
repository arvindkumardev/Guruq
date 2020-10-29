import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Colors from '../../../theme/colors';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { RfH, RfW } from '../../../utils/helpers';
import { cardPB, cardPT, cardPX, cardRadiusMedium, spacePX } from '../../../theme/variables';
import Fonts from '../../../theme/Fonts';

const styles = StyleSheet.create({
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: RFValue(28, STANDARD_SCREEN_SIZE),
    color: Colors.white,
    fontFamily: 'SegoeUI-Semibold',
    marginHorizontal: spacePX,
    marginBottom: RfH(16),
  },
  subtitle: {
    // fontFamily: 'SegoeUI',
    fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
    marginHorizontal: spacePX,
    color: Colors.white,
    marginBottom: RfH(40),
  },
  otpNumber: {
    fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
    marginHorizontal: RfW(16),
    color: Colors.white,
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: '#313031',
    fontSize: RFValue(24, STANDARD_SCREEN_SIZE),
  },
  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
  bottomCard: {
    backgroundColor: Colors.white,
    paddingHorizontal: cardPX,
    paddingTop: cardPT,
    paddingBottom: cardPB,
    borderTopLeftRadius: cardRadiusMedium,
    borderTopRightRadius: cardRadiusMedium,
  },
  bottomParent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  underlineView: {
    marginTop: RfH(40),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.secondaryText,
  },
  forgotPassword: {
    color: Colors.brandBlue2,
    textAlign: 'right',
    marginTop: RfH(6),
  },
  backIcon: {
    marginLeft: RfW(16),
    marginTop: RfH(58),
    marginBottom: RfH(16),
    color: Colors.white,
  },
  eyeIcon: {
    fontSize: RFValue(18, STANDARD_SCREEN_SIZE),
    color: '#818181',
  },
  clearIcon: {
    flex: 0.05,
    fontSize: RFValue(18, STANDARD_SCREEN_SIZE),
    color: Colors.secondaryText,
    marginBottom: RfH(-25),
  },
  applyIcon: {
    color: '#FF9900',
    fontSize: RFValue(10, STANDARD_SCREEN_SIZE),
    marginTop: RfH(-20),
    alignSelf: 'flex-end',
  },
  setPasswordView: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  otpView: {
    marginHorizontal: RfW(59),
    height: RfH(80),
    marginBottom: 0,
  },
  resendParent: {
    alignItems: 'center',
    marginTop: RfH(8),
  },

  contentMarginTop: {
    marginTop: RfH(36),
  },
});
export default styles;
