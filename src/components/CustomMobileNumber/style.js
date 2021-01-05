import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { RfH, RfW } from '../../utils/helpers';
import Colors from "../../theme/colors";

const styles = StyleSheet.create({
  textInputContainer: {
    marginTop: RfH(28),
  },
  inputStyle: {
    fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'left',
    color: '#262119',
    padding: 0,
  },
  textInputInnerContainer: {
    flexDirection: 'row',
    marginTop: RfH(4),
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: RfH(12),
    borderBottomWidth: 0.5,
    borderColor: Colors.secondaryText,
  },
  mobileInputInnerContainer: {
    flexDirection: 'row',
    marginTop: RfH(4),
    justifyContent: 'space-between',
    height: RfH(40),
    borderBottomWidth: 0.5,
    borderColor: Colors.secondaryText,
  },
  iconContainer: {
    paddingHorizontal: RfH(10),
    justifyContent: 'center',
  },
  iconStyle: {
    fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
    alignSelf: 'center',
  },
  errorTextStyle: {
    fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: RfH(22),
    marginTop: RfH(10),
    letterSpacing: 0,
    textAlign: 'left',
    color: '#b00820',
  },
});

export default styles;
