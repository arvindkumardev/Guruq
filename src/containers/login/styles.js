import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';
import { RfH, RfW } from '../../utils/helpers';
import {cardPX, cardPT, cardPB, cardRadiusMedium, spacePX} from '../../theme/variables';

const styles = StyleSheet.create({
  title: {
    fontFamily: 'SegoeUI-Semibold',
    fontSize: 28,
    color: Colors.white,
    fontWeight: '700',
    marginHorizontal: spacePX,
    marginBottom: RfH(16),
  },
  subtitle: {
    // fontFamily: 'SegoeUI',
    fontSize: 16,
    marginHorizontal: spacePX,
    color: Colors.white,
    marginBottom: RfH(40),
  },
  otpNumber: {
    fontSize: 16,
    marginHorizontal: RfW(16),
    color: Colors.white,
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: '#313031',
    fontSize: 24,
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
    borderBottomColor: Colors.inputLabel,
  },
  forgotPassword: {
    color: Colors.primaryButtonBackground,
    textAlign: 'right',
    marginTop: RfH(6),
  },
  backIcon: {
    marginLeft: RfW(16),
    marginTop: RfH(58),
    color: Colors.white,
  },
  eyeIcon: {
    fontSize: 18,
    color: '#818181',
  },
  clearIcon: {
    flex: 0.05,
    fontSize: 18,
    color: Colors.inputLabel,
    marginBottom: RfH(-25),
  },
  applyIcon: {
    color: '#FF9900',
    fontSize: 10,
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
});
export default styles;
