import { StyleSheet } from 'react-native';
import {RfH, RfW} from '../../utils/helpers';
import {Colors} from '../../theme';

const styles = StyleSheet.create({
  textInputContainer: {
    marginTop: RfH(28),
  },
  inputStyle: {
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'left',
    color: '#262119',
    padding:0
  },
  textInputInnerContainer: {
    flexDirection: 'row',
    marginTop:RfH(4),
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: Colors.inputLabel,
    alignItems:'center',
    paddingBottom: RfH(12),
   },
  mobileInputInnerContainer: {
    flexDirection: 'row',
    marginTop:RfH(4),
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: Colors.inputLabel,
    height: RfH(34)
  },
  iconContainer: {
    paddingHorizontal: RfH(10),
    justifyContent: 'center',
    paddingRight: RfW(5)
  },
  iconStyle: {
    width: RfW(20.3),
    height: RfH(15.3),
    resizeMode: 'contain',
  },
  errorTextStyle: {
    fontSize: 15,
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
