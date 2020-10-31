import {Platform, StyleSheet} from 'react-native';
import Fonts from '../../theme/fonts';
import {RFValue} from 'react-native-responsive-fontsize';
import {STANDARD_SCREEN_SIZE} from '../../utils/constants';
import {RfH, RfW} from '../../utils/helpers';
import {Colors} from "../../theme";

const styles = StyleSheet.create({
  textInputContainer: {
    flex:1,
  },
  inputStyle: {
    fontFamily: Fonts.regular,
    fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'left',
    color: '#262119',
    padding:0,
    paddingLeft:0,
  },
  textInputInnerContainer: {
    justifyContent: 'flex-end',
    paddingBottom: RfH(12),
    height:RfH(33),
  },
  iconContainer: {
    paddingHorizontal: RfH(10),
    paddingBottom: RfH(12),
    right:0,
  },
  iconStyle: {
    width: RfW(20.3),
    height: RfH(15.3),
    resizeMode: 'contain',
  },
  errorTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    marginTop: RfH(10),
    letterSpacing: 0,
    textAlign: 'left',
    color: '#b00820',
  },
});

export default styles;
