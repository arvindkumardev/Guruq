import { Platform, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { RfH, RfW } from '../../utils/helpers';
import { Colors } from '../../theme';

const styles = StyleSheet.create({
  textInputContainer: {
    flex: 0.33,
  },
  inputStyle: {
    fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'left',
    color: '#262119',
    padding: 0,
    paddingLeft: 0,
  },
  textInputInnerContainer: {
    marginTop: RfH(5),
    justifyContent: 'flex-end',
    paddingBottom: RfH(12),
    borderBottomWidth: 1,
    borderColor: Colors.separator,
    height: RfH(33),
    flex:1
  },
  iconContainer: {
    paddingHorizontal: RfH(10),
    paddingBottom: RfH(12),
    right: 0,
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
