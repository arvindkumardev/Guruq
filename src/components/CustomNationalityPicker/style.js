import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { RfH, RfW } from '../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';

const styles = StyleSheet.create({
  textInputContainer: {},
  inputStyle: {
    fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'left',
    color: '#262119',
    padding: 0,
  },
  textInputInnerContainer: {
    flexDirection: 'row',
    marginTop: RfH(5),
    justifyContent: 'space-between',
    paddingBottom: RfH(12),
  },
  iconContainer: {
    paddingHorizontal: RfH(10),
  },
  iconStyle: {
    width: RfW(20.3),
    height: RfH(15.3),
    resizeMode: 'contain',
  },
  errorTextStyle: {
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
