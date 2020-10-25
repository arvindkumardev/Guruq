import { StyleSheet } from 'react-native';
import { RfH, RfW } from '../../utils/helpers';

const styles = StyleSheet.create({
  textInputContainer: {},
  inputStyle: {
    fontSize: 15,
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
    fontSize: 15,
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
